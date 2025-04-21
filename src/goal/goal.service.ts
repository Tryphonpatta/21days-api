import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGoalDto: CreateGoalDto, userId: string) {
    const goal = await this.prisma.goal.create({
      data: {
        name: createGoalDto.name,
        note: createGoalDto.note ? createGoalDto.note : '',
        userId: userId,
        color: createGoalDto.color ? createGoalDto.color : '#000000',
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
    return goals.map((goal) => {
      return {
        ...goal,
        status: goal.goalLog[0]?.status,
        streak: goal.goalLog[0]?.streak ? goal.goalLog[0].streak : 0,
      };
    });
  }

  async findOne(id: string) {
    const goal = await this.prisma.goal.findUnique({
      where: {
        id: id,
      },
      include: {
        tag: true,
      },
    });
    return goal;
  }

  async update(id: string, updateGoalDto: UpdateGoalDto) {
    const goal = await this.prisma.goal.update({
      where: {
        id: id,
      },
      data: {
        name: updateGoalDto.name,
        note: updateGoalDto.note,
        color: updateGoalDto.color,
        ...(updateGoalDto.tag && { tagId: updateGoalDto.tag }),
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
