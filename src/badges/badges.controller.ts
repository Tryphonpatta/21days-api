import { Controller, Get, Req } from '@nestjs/common';
import { BadgesService } from './badges.service';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  findBadge(@Req() req) {
    const user = req.user;
    return this.badgesService.findBadge(user.userId);
  }
}
