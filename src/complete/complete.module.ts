import { Module } from '@nestjs/common';
import { CompleteService } from './complete.service';
import { CompleteController } from './complete.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CompleteController],
  providers: [CompleteService, PrismaService],
})
export class CompleteModule {}
