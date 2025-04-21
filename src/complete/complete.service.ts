import { HttpException, Injectable } from '@nestjs/common';
import { CreateCompleteDto } from './dto/create-complete.dto';
import { PrismaService } from 'src/prisma.service';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { DateTime } from 'luxon';

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
}
