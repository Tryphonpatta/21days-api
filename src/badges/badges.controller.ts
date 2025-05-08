import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findBadge(@Req() req) {
    const user = req.user;
    return this.badgesService.findBadge(user.userId);
  }
}
