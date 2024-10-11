import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { exclude } from '../shared/function/exclude.function';
import excludeFieldsUser from '../shared/hidden-fields/exclude-fields-user';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const data: Prisma.UserCreateInput = {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      };

      const createUser = await this.prisma.user.create({ data });

      return {
        ...createUser,
        id: undefined,
      };
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException('Something bad happened', {
          cause: new Error(),
          description: 'Duplicate Entry',
        });
      } else {
        return err.message;
      }
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const dataKeys = await this.prisma.user.findFirst({
      where: { id },
    });
    const userWithoutKeys = exclude(dataKeys, excludeFieldsUser);
    return userWithoutKeys;
  }

  async update(data: UpdateUserDto) {
    try {
      const updateUser = await this.prisma.user.update({
        where: { id: data.id },
        data,
      });
      const userWithoutKeys = exclude(updateUser, excludeFieldsUser);
      return userWithoutKeys;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException('Something bad happened', {
          cause: new Error(),
          description: 'Duplicate Entry',
        });
      } else {
        return err;
      }
    }
  }

  async remove(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string) {
    const dataKeys = await this.prisma.user.findFirst({
      where: { email },
    });
    return dataKeys;
  }
}
