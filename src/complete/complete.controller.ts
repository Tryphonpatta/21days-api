import { Controller, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { CompleteService } from './complete.service';
import { CreateCompleteDto } from './dto/create-complete.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('complete')
export class CompleteController {
  constructor(private readonly completeService: CompleteService) {}

  @Post(':id')
  create(
    @Body() createCompleteDto: CreateCompleteDto,
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const user = req.user;
    return this.completeService.create(createCompleteDto, user.id, id);
  }
}
