import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BadgesService {
  constructor(
    private readonly prisma: PrismaService, // Assuming you have a PrismaService to interact with your database
  ) {}

  async findBadge(userId: string) {
    try {
      const badges = await this.prisma.userBadge.findMany({
        where: {
          userId: userId,
        },
        include: {
          badge: true,
        },
      });
      // console.log(badges);
      return new Object({
        '7_day': badges.some((b) => b.badge.name == '7-day streak'),
        '15_day': badges.some((b) => b.badge.name == '15-day streak'),
        '30_day': badges.some((b) => b.badge.name == '30-day streak'),
        '60_day': badges.some((b) => b.badge.name == '60-day streak'),
        '100_day': badges.some((b) => b.badge.name == '100-day streak'),
        '300_day': badges.some((b) => b.badge.name == '300-day streak'),
        '1k_check': badges.some((b) => b.badge.name == '1k check-ins'),
        '3k_check': badges.some((b) => b.badge.name == '3k check-ins'),
      });
    } catch (e) {
      console.log(e);
      return new HttpException(e.message, e.status);
    }
  }
}
