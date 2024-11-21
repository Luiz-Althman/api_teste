import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('by-id')
  findOne(@Body('id') id: number) {
    return this.commentService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user')
  findAllByUser(@Body('userId') userId: number) {
    return this.commentService.findAllByUser(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  update(
    @Body()
    body: {
      id: number;
      userId: number;
      updateCommentDto: UpdateCommentDto;
    },
  ) {
    const { id, userId, updateCommentDto } = body;
    return this.commentService.update(id, userId, updateCommentDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Body() body: { id: number; userId: number }) {
    const { id, userId } = body;
    return this.commentService.remove(+id, userId);
  }
}
