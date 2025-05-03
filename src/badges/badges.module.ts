import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BadgesController],
  providers: [BadgesService, PrismaService],
})
export class BadgesModule {}
