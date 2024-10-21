import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePublishDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
