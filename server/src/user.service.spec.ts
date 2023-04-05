import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './users/user.entity';
import { UserRepository } from './users/users.repository';
import { UserCredentialsDto } from './users/dto/user-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './users/dto/change-password.dto';

describe('UsersService', () => {
  let usersService: UserRepository;
  let userRepositoryMock;
  let jwtService: JwtService;

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRepository,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            decodeAccessToken: jest.fn(),
            jwtServiceMock,
          },
        },
      ],
    }).compile();

    usersService = moduleRef.get<UserRepository>(UserRepository);
    userRepositoryMock = moduleRef.get(getRepositoryToken(UserEntity));
  });

  describe('createUser', () => {
    const userCredentialsDto: UserCredentialsDto = {
      username: 'john_doe',
      email: 'john_doe@example.com',
      password: 'password',
    };

    it('should create a new user', async () => {
      const hashedPassword = 'hashedPassword';
      const createdUser = { ...userCredentialsDto, password: hashedPassword };
      userRepositoryMock.findOne.mockReturnValue(undefined);
      userRepositoryMock.create.mockReturnValue(createdUser);
      userRepositoryMock.save.mockReturnValue(createdUser);

      const result = await usersService.createUser(userCredentialsDto);

      expect(result).toEqual({ status: 'SUCCESS', saveUser: createdUser });
    });

    it('throws a ConflictException if username or email already exists', async () => {
      jest
        .spyOn(userRepositoryMock, 'save')
        .mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      const userCredentialsDto: UserCredentialsDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
      };

      await expect(usersService.createUser(userCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a ConflictException if any required fields are missing', async () => {
      userRepositoryMock.save.mockRejectedValue({
        code: 'ER_NO_DEFAULT_FOR_FIELD',
      });
      await expect(
        usersService.createUser(userCredentialsDto),
      ).rejects.toThrowError(ConflictException);
    });

    it('should throw an InternalServerErrorException if any other error occurs', async () => {
      userRepositoryMock.save.mockRejectedValue(new Error());
      await expect(
        usersService.createUser(userCredentialsDto),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('signInUser', () => {
    const userCredentialsDto: UserCredentialsDto = {
      email: 'test@test.com',
      password: 'password',
      username: '',
    };
    // userRepositoryMock.findOne.mockReturnValue(undefined);
    it('should throw an UnauthorizedException if email or password are missing', async () => {
      await expect(
        usersService.signInUser({
          email: '',
          password: '',
          username: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
      await expect(
        usersService.signInUser({
          email: 'test@test.com',
          username: '',
          password: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
      await expect(
        usersService.signInUser({
          password: 'password',
          username: '',
          email: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockResolvedValueOnce(undefined);

      await expect(
        usersService.signInUser(userCredentialsDto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      const user = {
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(user);

      await expect(
        usersService.signInUser({
          email: 'test@test.com',
          password: 'wrong_password',
          username: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should return status, id, email and accessToken if user is found and password is correct', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('access_token');

      const result = await usersService.signInUser(userCredentialsDto);

      expect(result.status).toBe('SUCCESS');
      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
      expect(result.accessToken).toBe('access_token');
    });
  });

  describe('signInUser', () => {
    const userCredentialsDto: UserCredentialsDto = {
      email: 'test@test.com',
      password: 'password',
      username: '',
    };
    // userRepositoryMock.findOne.mockReturnValue(undefined);
    it('should throw an UnauthorizedException if email or password are missing', async () => {
      await expect(
        usersService.signInUser({
          email: '',
          password: '',
          username: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
      await expect(
        usersService.signInUser({
          email: 'test@test.com',
          username: '',
          password: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
      await expect(
        usersService.signInUser({
          password: 'password',
          username: '',
          email: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockResolvedValueOnce(undefined);

      await expect(
        usersService.signInUser(userCredentialsDto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      const user = {
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(user);

      await expect(
        usersService.signInUser({
          email: 'test@test.com',
          password: 'wrong_password',
          username: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should return status, id, email and accessToken if user is found and password is correct', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(user);
      const signSpy = jest
        .spyOn(jwtServiceMock, 'sign')
        .mockReturnValueOnce('access_token');

      const result = await usersService.signInUser(userCredentialsDto);

      expect(result.status).toBe('SUCCESS');
      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
      expect(result.accessToken).toBe('access_token');
      expect(signSpy).toHaveBeenCalledWith({ email: user.email, sub: user.id });
    });
  });

  describe('changePassword', () => {
    const user = {
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
    };
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYxOTg0MzE1OH0.IkflFjKZw0Mv72hV_pRJd81PsQVbeBC_9u9QZH5k6z0';
    const changePasswordDto: ChangePasswordDto = {
      newPassword: 'newpassword',
      confirmNewPassword: 'newpassword',
    };

    it('should throw an error if new password or confirm new password is missing', async () => {
      const dto: ChangePasswordDto = {
        newPassword: '',
        confirmNewPassword: '',
      };
      await expect(
        usersService.changePassword(accessToken, dto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if new password and confirm new password do not match', async () => {
      const dto: ChangePasswordDto = {
        newPassword: 'newpassword',
        confirmNewPassword: 'mismatchpassword',
      };
      await expect(
        usersService.changePassword(accessToken, dto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if access token is missing', async () => {
      await expect(
        usersService.changePassword('', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if access token is invalid', async () => {
      await expect(
        usersService.changePassword('invalidtoken', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if user is not found', async () => {
      jest
        .spyOn(userRepositoryMock, 'decodeAccessToken')
        .mockReturnValue({ id: 999 });
      await expect(
        usersService.changePassword(accessToken, changePasswordDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should change user password if all input is valid', async () => {
      jest
        .spyOn(userRepositoryMock, 'decodeAccessToken')
        .mockReturnValue({ id: user.id });
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('testsalt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('testhashedpassword');
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValue({
        id: user.id,
        username: user.username,
        email: user.email,
        password: 'testhashedpassword',
      });
      const result = await usersService.changePassword(
        accessToken,
        changePasswordDto,
      );

      expect(result).toEqual({
        status: 'SUCCESS',
        userDetails: {
          id: user.id,
          username: user.username,
          email: user.email,
          password: 'testhashedpassword',
        },
      });
      expect(userRepositoryMock.save).toHaveBeenCalledWith({
        id: user.id,
        username: user.username,
        email: user.email,
        password: 'testhashedpassword',
      });
    });
  });
});
