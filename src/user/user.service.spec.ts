import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { exclude } from '../shared/function/exclude.function';
import excludeFieldsUser from '../shared/hidden-fields/exclude-fields-user';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        surname: 'Doe',
        nickname: 'johnd',
        email: 'john.doe@example.com',
        role: 'estudante',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createdUser = { ...createUserDto, id: 1, password: hashedPassword };
      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
      expect(result).toEqual({ ...createdUser, id: undefined });
    });

    it('should throw ConflictException on duplicate entry', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        surname: 'Doe',
        nickname: 'johnd',
        email: 'john.doe@example.com',
        role: 'estudante',
        password: 'password123',
      };

      (prisma.user.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          name: 'John',
          surname: 'Doe',
          nickname: 'johnd',
          email: 'john.doe@example.com',
          role: 'estudante',
        },
        {
          name: 'Jane',
          surname: 'Doe',
          nickname: 'janed',
          email: 'jane.doe@example.com',
          role: 'professor',
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user without excluded fields', async () => {
      const user = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        nickname: 'johnd',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        role: 'estudante',
      };
      const expectedUser = exclude(user, excludeFieldsUser);

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedUser);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a user and return without excluded fields', async () => {
      const updateUserDto: UpdateUserDto = {
        id: 1,
        name: 'John Updated',
        surname: 'Doe Updated',
        nickname: 'johnupd',
        email: 'john.updated@example.com',
        role: 'professor',
      };

      const updatedUser = { ...updateUserDto, password: 'hashedPassword' };
      const expectedUser = exclude(updatedUser, excludeFieldsUser);

      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(updateUserDto);

      expect(result).toEqual(expectedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: updateUserDto.id },
        data: updateUserDto,
      });
    });

    it('should throw ConflictException on duplicate entry during update', async () => {
      const updateUserDto: UpdateUserDto = {
        id: 1,
        name: 'John Updated',
        surname: 'Doe Updated',
        nickname: 'johnupd',
        email: 'john.updated@example.com',
        role: 'professor',
      };

      (prisma.user.update as jest.Mock).mockRejectedValue({ code: 'P2002' });

      await expect(service.update(updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user and return confirmation message', async () => {
      (prisma.user.delete as jest.Mock).mockResolvedValue({});

      const result = await service.remove(1);

      expect(result).toEqual('This action removes a #1 user');
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
