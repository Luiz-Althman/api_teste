import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublishDto } from './dto/create-publish.dto';
import { UpdatePublishDto } from './dto/update-publish.dto';

@Injectable()
export class PublishService {
  constructor(private prisma: PrismaService) {}

  async create(createPublishDto: CreatePublishDto) {
    return this.prisma.publish.create({
      data: createPublishDto,
    });
  }

  async findAll() {
    return this.prisma.publish.findMany();
  }

  async findOne(id: number) {
    return this.prisma.publish.findUnique({
      where: { id },
    });
  }

  async update(id: number, userId: number, updatePublishDto: UpdatePublishDto) {
    const publish = await this.prisma.publish.findUnique({
      where: { id },
    });

    if (!publish || publish.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta publicação.',
      );
    }

    return this.prisma.publish.update({
      where: { id },
      data: updatePublishDto,
    });
  }

  async remove(id: number, userId: number) {
    const publish = await this.prisma.publish.findUnique({
      where: { id },
    });

    if (!publish || publish.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta publicação.',
      );
    }

    return this.prisma.publish.delete({
      where: { id },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.publish.findMany({
      where: { userId },
    });
  }
}
