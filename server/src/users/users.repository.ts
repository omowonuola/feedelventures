import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { UserCredentialsDto } from './dto/users-credentials.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '../mail/nodemailer.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';
import { ChangePasswordDto } from './dto/change-password.dto';

export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
    private jwtService: JwtService,
    private mailerService: MailService,
  ) {}

  async createUser(userCredentialsDto: UserCredentialsDto): Promise<any> {
    const { username, email, password } = userCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userEntity.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      //   return await this.userEntity.save(user);
      const saveUser = await this.userEntity.save(user);
      return { status: 'SUCCESS', saveUser };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // checking for duplicate username/email
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

    if (!user) throw new UnauthorizedException('invalid email');

    // to calculate the time for JWT token to expire after 20min
    const now = new Date();
    const expirationTime = now.getTime() + 20 * 60 * 1000; // adding 20 minutes in milliseconds
    const expirationTimeStamp = Math.floor(expirationTime / 1000);

    const accessToken: string = this.jwtService.sign(
      { id: user.id },
      { expiresIn: expirationTimeStamp },
    );
    const data = await this.mailerService.sendEmail({ email, accessToken });
    if (data) {
      return { status: 'SUCCESS', message: 'Password Reset Email Sent' };
    }
  }

  async changePassword(
    accessToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    const { newPassword, confirmNewPassword } = changePasswordDto;

    if (!newPassword || !confirmNewPassword) {
      throw new UnauthorizedException('Please add a new password');
    } else if (newPassword !== confirmNewPassword) {
      throw new UnauthorizedException('Password must match');
    }

    if (!accessToken) {
      throw new UnauthorizedException('Access token is missing');
    }

    const parts = accessToken.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid access token');
    }
    const decryptToken = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    const id = decryptToken.id;

    const user = await this.userEntity.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newPassword;
    // save new password in the database
    const userDetails = await this.userEntity.save({
      id,
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });

    if (userDetails) {
      return { status: 'SUCCESS', userDetails };
    }
  }

  // async logout(@Req() request: Request): Promise<any> {
  //   request.session.destroy();

  //   // response.clearCookie('access_token');
  //   // response.sendStatus(200);
  // }
}
