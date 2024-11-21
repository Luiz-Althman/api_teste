import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PublishService } from './publish.service';
import { CreatePublishDto } from './dto/create-publish.dto';
import { UpdatePublishDto } from './dto/update-publish.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('publish')
@Controller('publish')
export class PublishController {
  constructor(private readonly publishService: PublishService) {}

  @Post()
  create(@Body() createPublishDto: CreatePublishDto) {
    return this.publishService.create(createPublishDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.publishService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('by-id')
  findOne(@Body('id') id: number) {
    return this.publishService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user')
  findAllByUser(@Body('userId') userId: number) {
    return this.publishService.findAllByUser(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  update(
    @Body()
    body: {
      id: number;
      userId: number;
      updatePublishDto: UpdatePublishDto;
    },
  ) {
    const { id, userId, updatePublishDto } = body;
    return this.publishService.update(id, userId, updatePublishDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Body() body: { id: number; userId: number }) {
    const { id, userId } = body;
    return this.publishService.remove(id, userId);
  }
}
