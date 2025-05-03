import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createGoalDto: CreateGoalDto, @Req() req) {
    const userId = req.user.userId;
    return this.goalService.create(createGoalDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req, @Param('tag') tag?: string) {
    return this.goalService.findAll(req.user.userId, tag);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tag/:tagId')
  findAllByTag(@Param('tagId') tag: string, @Req() req) {
    const user = req.user;
    return this.goalService.findAll(user.userId, tag);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.goalService.findOne(id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.goalService.update(id, updateGoalDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.goalService.remove(id, req.user.userId);
  }
}
