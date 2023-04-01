import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';

export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async createUser(
    authCredentialsDto: UserCredentialsDto,
  ): Promise<UserEntity> {
    const { username, email, password } = authCredentialsDto;

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
    const user = await this.userEntity.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);

      return { email, accessToken };
    } else {
      throw new UnauthorizedException('Please check your login details');
    }
  }
}
