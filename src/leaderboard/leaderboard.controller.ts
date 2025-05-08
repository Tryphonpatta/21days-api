import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findLeaderBoard(@Req() req) {
    const user = req.user;
    return this.leaderboardService.findLeaderboard(user.userId);
  }
}
