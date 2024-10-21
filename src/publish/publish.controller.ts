import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { PublishService } from './publish.service';
import { CreatePublishDto } from './dto/create-publish.dto';
import { UpdatePublishDto } from './dto/update-publish.dto';

@Controller('publish')
export class PublishController {
  constructor(private readonly publishService: PublishService) {}

  @Post()
  create(@Body() createPublishDto: CreatePublishDto) {
    return this.publishService.create(createPublishDto);
  }

  @Get()
  findAll() {
    return this.publishService.findAll();
  }

  @Get('publishId')
  findOne(@Body('id') id: number) {
    return this.publishService.findOne(+id);
  }

  @Get('user')
  findAllByUser(@Body('userId') userId: number) {
    return this.publishService.findAllByUser(userId);
  }

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

  @Delete()
  remove(@Body() body: { id: number; userId: number }) {
    const { id, userId } = body;
    return this.publishService.remove(id, userId);
  }
}
