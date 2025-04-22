import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('tags')
  findAllTags(@Req() req) {
    const user = req.user;
    return this.userService.findAllTags(user.userId);
  }

  @Get('stats')
  findStats(@Req() req) {
    const user = req.user;
    return this.userService.findStats(user.userId);
  }

  @Get('leaderboard')
  findLeaderBoard(@Req() req) {
    const user = req.user;
    return this.userService.findLeaderboard(user.userId);
  }

  @Get('profile')
  findProfile(@Req() req) {
    const user = req.user;
    return this.userService.findProfile(user.userId);
  }

  @Get('badge')
  findBadge(@Req() req) {
    const user = req.user;
    return this.userService.findBadge(user.userId);
  }
}
