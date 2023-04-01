import { Injectable } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
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
}
