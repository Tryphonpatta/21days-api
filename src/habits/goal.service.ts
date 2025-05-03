import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { PrismaService } from 'src/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetNotes() {
    const goals = await this.prisma.goal.updateMany({
      data: {
        note: '',
      },
    });
    return goals;
  }

  async create(createGoalDto: CreateGoalDto, userId: string) {
    const goal = await this.prisma.goal.create({
      data: {
        name: createGoalDto.name,
        note: createGoalDto.note ? createGoalDto.note : '',
        userId: userId,
        color: createGoalDto.color ? createGoalDto.color : '#000000',
        description: createGoalDto.description ? createGoalDto.description : '',
        ...(createGoalDto.tag && { tagId: createGoalDto.tag }),
      },
    });
    return goal;
  }

  async findAll(userId: string, tag?: string) {
    const goals = await this.prisma.goal.findMany({
      where: {
        userId,
        ...(tag && { tagId: tag }),
      },
      include: {
        tag: true,
        goalLog: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Get only the latest
        },
      },
    });
    // console.log(goals);
    return goals.map((goal) => {
      return {
        ...goal,
        status: goal.goalLog[0]?.status,
        streak: goal.goalLog[0]?.streak ? goal.goalLog[0].streak : 0,
      };
    });
  }

  async findOne(id: string, userId: string) {
    const goal = await this.prisma.goal.findUnique({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        tag: true,
      },
    });
    return goal;
  }

  async update(id: string, updateGoalDto: UpdateGoalDto, userId: string) {
    console.log(updateGoalDto);
    const goal = await this.prisma.goal.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        name: updateGoalDto.name,
        note: updateGoalDto.note,
        color: updateGoalDto.color,
        ...(updateGoalDto.tag && { tagId: updateGoalDto.tag }),
        ...(updateGoalDto.description && {
          description: updateGoalDto.description,
        }),
        ...(updateGoalDto.color && { color: updateGoalDto.color }),
        ...(updateGoalDto.tag && { tagId: updateGoalDto.tag }),
      },
      include: {
        tag: true,
      },
    });
    return goal;
  }

  async remove(id: string, userId: string) {
    const goal = await this.prisma.goal.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
    return goal;
  }
}
