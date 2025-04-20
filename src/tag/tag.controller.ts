import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto, @Req() req) {
    const userId = req.user.userId;
    return this.tagService.create(createTagDto, userId);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.userId;
    return this.tagService.findAll(userId);
  }
}
