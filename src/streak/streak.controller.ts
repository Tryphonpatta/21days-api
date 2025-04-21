import { Controller, Get } from '@nestjs/common';
import { StreakService } from './streak.service';

@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get('reset-streak')
  async resetStreak() {
    const streaks = await this.streakService.resetMissedStreaks();
    return streaks;
  }
}
