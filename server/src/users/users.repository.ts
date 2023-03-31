import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
// import { JwtPayload } from './jwt-payload';

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
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userEntity.create({ username, password: hashedPassword });

    try {
      return await this.userEntity.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // checking for duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
