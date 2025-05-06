import { HttpException, Injectable } from '@nestjs/common';
import { CreateCompleteDto } from './dto/create-complete.dto';
import { PrismaService } from 'src/prisma.service';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { DateTime } from 'luxon';

const BadgeStreak = [
  { streak: 7, name: '7-day-streak', id: 2 },
  { streak: 15, name: '15-day-streak', id: 3 },
  { streak: 30, name: '30-day-streak', id: 4 },
  { streak: 60, name: '60-day-streak', id: 5 },
  { streak: 100, name: '100-day-streak', id: 6 },
  { streak: 300, name: '300-day-streak', id: 7 },
];

// const BadgeCheckIn = [
//   { streak: 1000, name: '1k check-ins' },
//   { streak: 3000, name: '3k check-ins' },
// ];

@Injectable()
export class CompleteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    CreateCompleteDto: CreateCompleteDto,
    userId: string,
    id: string,
  ) {
    try {
      const goal = await this.prisma.goal.findUnique({
        where: { id, userId },
      });

      if (!goal) {
        throw new HttpException('Goal not found or unauthorized', 404);
      }
      const today = DateTime.fromISO(new Date().toISOString())
        .setZone('Asia/Bangkok')
        .toISO();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      const existingLog = await this.prisma.goalLog.findFirst({
        where: {
          goalId: id,
          day: { gte: todayStart, lte: todayEnd },
        },
      });

      const isCompleting = CreateCompleteDto.status === true;
      if (isCompleting && existingLog) {
        throw new HttpException(
          'Goal already completed today,Pls refresh to update',
          400,
        );
      }
      if (!existingLog && isCompleting) {
        const yesterdayGoalLog = await this.prisma.goalLog.findFirst({
          where: {
            goalId: id,
            day: {
              gte: subDays(todayStart, 1),
              lte: endOfDay(subDays(todayStart, 1)),
            },
          },
        });
        if (yesterdayGoalLog) {
          const goalLog = await this.prisma.goalLog.create({
            data: {
              status: CreateCompleteDto.status,
              goalId: id,
              day: today,
              streak: yesterdayGoalLog.streak + 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          await this.prisma.goal.update({
            where: { id },
            data: {
              streak: yesterdayGoalLog.streak + 1,
            },
          });
          await this.checkBadge(yesterdayGoalLog.streak + 1, userId);
          return { ...goalLog, streak: yesterdayGoalLog.streak + 1 };
        }
        const goalLog = await this.prisma.goalLog.create({
          data: {
            status: CreateCompleteDto.status,
            goalId: id,
            day: today,
            streak: 1,
          },
        });
        await this.prisma.goal.update({
          where: { id },
          data: {
            streak: 1,
          },
        });
        return { ...goalLog, streak: 1 };
      }
      if (!isCompleting && existingLog) {
        await this.prisma.goalLog.delete({
          where: {
            id: existingLog.id,
          },
        });
        const yesterdayGoalLog = await this.prisma.goalLog.findFirst({
          where: {
            goalId: id,
            day: {
              gte: subDays(todayStart, 1),
              lte: endOfDay(subDays(todayStart, 1)),
            },
          },
        });
        if (yesterdayGoalLog) {
          const goal = await this.prisma.goal.update({
            where: { id },
            data: {
              streak: yesterdayGoalLog.streak,
            },
          });
          return { ...goal, streak: yesterdayGoalLog.streak };
        }
        const goal = await this.prisma.goal.update({
          where: { id },
          data: {
            streak: 0,
          },
        });
        return { ...goal, streak: 0 };
      }

      return { message: 'Goal status updated successfully.' };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async checkBadge(streak: number, userId: string) {
    try {
      const badges = await this.prisma.badge.findMany({
        where: { UserBadge: { some: { userId } } },
      });
      if (streak < 7) return;
      let i = 0;
      for (const badge of BadgeStreak) {
        if (streak <= badge.streak) {
          break;
        }
        i++;
      }
      //check if the user already has the badge
      const badgeExists = badges.find(
        (badge) => badge.name === BadgeStreak[i].name,
      );
      if (badgeExists) return;
      const badgeUser = await this.prisma.userBadge.create({
        data: {
          userId: userId,
          badgeId: BadgeStreak[i].id,
        },
      });
      return badgeUser;
    } catch (error) {
      console.log(error);
    }
  }
}
