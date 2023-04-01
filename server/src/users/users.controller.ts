import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@Controller('api/users')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create New User' })
  @ApiResponse({
    description: 'create new user to the database',
    type: UserEntity,
  })
  signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.userService.signUp(userCredentialsDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'SignIn User' })
  @ApiResponse({
    description: 'sign in to the application',
    type: UserEntity,
  })
  signIn(
    @Body() authCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signInUser(authCredentialsDto);
  }
}
