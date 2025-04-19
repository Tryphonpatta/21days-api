import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, JwtService],
})
export class AuthModule {}
