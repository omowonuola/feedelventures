import { Injectable } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(userCredentialsDto: UserCredentialsDto): Promise<any> {
    return this.userRepository.createUser(userCredentialsDto);
  }

  async signInUser(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.userRepository.signInUser(userCredentialsDto);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ resetLink: string }> {
    return this.userRepository.forgotPassword(forgotPasswordDto);
  }

  async changePassword(
    accessToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserEntity> {
    return this.userRepository.changePassword(accessToken, changePasswordDto);
  }
}
