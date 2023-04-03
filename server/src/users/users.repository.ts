import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Mailer } from '../mail/mail.service.ts/nodemailer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';
import { ChangePasswordDto } from './dto/change-password.dto';

export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
    private jwtService: JwtService, // private mailerService: Mailer,
  ) {}

  async createUser(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<UserEntity> {
    const { username, email, password } = userCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userEntity.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      return await this.userEntity.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // checking for duplicate username
        throw new ConflictException('Username/Email already exists');
        // checking for all required fields filled
      } else if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        throw new ConflictException('All fields are required');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signInUser(userCredentialsDto: UserCredentialsDto): Promise<any> {
    const { email, password } = userCredentialsDto;
    if (!email || !password) {
      throw new UnauthorizedException('Please add email and password');
    }
    const user = await this.userEntity.findOne({ where: { email } });
    console.log(user.id);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);

      return { status: 'SUCCESS', id: user?.id, email, accessToken };
    } else {
      throw new UnauthorizedException('Please check your login details');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;
    if (!email) {
      throw new UnauthorizedException('Please add email');
    }
    const user = await this.userEntity.findOne({ where: { email } });

    if (!user) return 'invalid email';
    // const payload: JwtPayload = { email };
    const accessToken: string = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '20m' },
    );

    return {
      resetLink: `${process.env.CLIENT_URL}/resetpassword/${accessToken}`,
    };
    // const data = await this.mailerService.sendEmail({ email, accessToken });
  }

  async changePassword(
    accessToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserEntity> {
    const { password, confirmPassword } = changePasswordDto;

    if (!password) {
      throw new UnauthorizedException('Please add a new password');
    } else if (password !== confirmPassword) {
      throw new UnauthorizedException('Password must match');
    }
    const decryptToken = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString(),
    );

    const id = decryptToken.id;

    const user = await this.userEntity.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = password;
    // save new password in the database
    return await this.userEntity.save({
      id,
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });
  }

  //   async logout(@Req() request: Request): Promise<any> {
  //     request.session.destroy();

  //     // response.clearCookie('access_token');
  //     // response.sendStatus(200);
  //   }
}
