import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { JwtStrategy } from './jwt-passport';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // imports: [ConfigModule],
      // secret: process.env.JWT_SECRET,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: {
        expiresIn: '365d',
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UserService, UserRepository, JwtStrategy],
  controllers: [UsersController],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
