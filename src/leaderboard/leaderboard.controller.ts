import { Controller, Get, Req } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  findLeaderBoard(@Req() req) {
    const user = req.user;
    return this.leaderboardService.findLeaderboard(user.userId);
  }
}
