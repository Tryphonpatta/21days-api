import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  login(createAuthDto: LoginDto) {
    const user = this.prisma.user.findUnique({
      where: {
        username: createAuthDto.username,
        password: createAuthDto.password,
      },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
  }
  validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
