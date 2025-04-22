import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllTags(userId: string) {
    const tags = await this.prisma.tag.findMany({
      where: {
        userId: userId,
      },
      include: {
        Goal: true,
      },
    });
    return tags.map((tag) => {
      return {
        ...tag,
        count: tag.Goal.length,
      };
    });
  }

  async findStats(userId: string) {
    try {
      const goals = await this.prisma.goal.findMany({
        where: {
          userId: userId,
          goalLog: {},
        },
        include: {
          goalLog: {
            where: {
              day: {
                gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                lte: new Date(),
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
      return {
        goals: goals,
        completed: goals.filter((goal) => goal.bestStreak >= 21).length,
        streaks: Math.max(...goals.map((goal) => goal.streak), 0),
        bestStreaks: Math.max(...goals.map((goal) => goal.bestStreak), 0),
      };
    } catch (error) {
      console.log(error);
      return new HttpException(error.message, error.status);
    }
  }

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

  async findProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          Goal: {
            include: {
              goalLog: true,
            },
          },
        },
      });
      return user;
    } catch (e) {
      console.log(e);
      return new HttpException(e.message, e.status);
    }
  }
}
