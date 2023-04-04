import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Johndoe@12',
    description: 'Password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/,
    {
      message: 'password is too weak',
    },
  )
  readonly newPassword: string;

  @ApiProperty({
    example: 'Johndoe@12',
    description: 'confirmPassword',
  })
  @IsNotEmpty()
  @IsString()
  readonly confirmNewPassword: string;
}
