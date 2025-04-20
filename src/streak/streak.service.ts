import { Injectable, Logger } from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';
import { endOfDay, startOfDay } from 'date-fns';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StreakService {
  private readonly logger = new Logger(StreakService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetMissedStreaks() {
    this.logger.debug('Resetting missed streaks...');
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const goals = await this.prisma.goal.findMany({
      include: {
        goalLog: {
          where: {
            day: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        },
      },
    });

    for (const goal of goals) {
      const todayLog = goal.goalLog[0];

      if (!todayLog || !todayLog.status) {
        await this.prisma.goal.update({
          where: { id: goal.id },
          data: { streak: 0 },
        });

        this.logger.log(`Reset streak for goal ${goal.id}`);
      }
    }

    this.logger.log('Streak check completed.');
  }
}
