import { Injectable } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signUp(userCredentialsDto: UserCredentialsDto): Promise<any> {
    return this.userRepository.createUser(userCredentialsDto);
  }


}
