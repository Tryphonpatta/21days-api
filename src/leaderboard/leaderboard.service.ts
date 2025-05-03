import { HttpException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly prisma: PrismaService, // Assuming you have a PrismaService to interact with your database
  ) {}
  async findLeaderboard(userId: string) {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          Goal: {
            include: {
              goalLog: true,
            },
          },
        },
      });
      const leaderboard = users.map((user) => {
        const streaks = user.Goal.map((goal) => goal.streak);
        const bestStreaks = user.Goal.map((goal) => goal.bestStreak);
        const complete = user.Goal.filter((goal) => goal.bestStreak >= 21);
        const isUser = user.id === userId;
        return {
          id: user.id,
          name: user.username,
          email: user.email,
          streak: Math.max(...streaks, 0),
          bestStreak: Math.max(...bestStreaks, 0),
          completed: complete.length,
          isUser: isUser,
        };
      });
      return leaderboard;
    } catch (e) {
      console.log(e);
      return new HttpException(e.message, e.status);
    }
  }
}
