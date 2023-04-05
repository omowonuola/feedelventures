import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { UserCredentialsDto } from './dto/users-credentials.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './users.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  @Post('/forgotpassword')
  @ApiOperation({ summary: 'Forgot PPasword' })
  @ApiResponse({
    description: 'Request for a password reset link',
    type: UserEntity,
  })
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ resetLink: string }> {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Patch('/changepassword/:accessToken')
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({
    description: 'Request for a password change',
    type: UserEntity,
  })
  changePassword(
    @Param('accessToken') accessToken: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<UserEntity> {
    return this.userService.changePassword(accessToken, changePasswordDto);
  }
}
