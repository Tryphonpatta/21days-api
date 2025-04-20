import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GoalModule } from './goal/goal.module';
import { CompleteModule } from './complete/complete.module';
import { StreakModule } from './streak/streak.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    GoalModule,
    CompleteModule,
    StreakModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
