import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'process@gmail.com',
    description: 'Email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
