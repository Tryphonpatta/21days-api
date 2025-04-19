import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async login(createAuthDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: createAuthDto.username,
        password: createAuthDto.password,
      },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
    // Generate JWT token
    console.log('JwtService sign call:', this.jwtService);

    const token = this.jwtService.sign({
      username: user.username,
      userId: user.id,
      email: user.email,
    });
    return {
      access_token: token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }
  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async signUp(createAuthDto: SignUpDto) {
    try {
      const data = await this.prisma.user.create({
        data: {
          username: createAuthDto.username,
          email: createAuthDto.email,
          password: createAuthDto.password,
        },
      });
      return { username: data.username, email: data.email };
    } catch (error) {
      throw new HttpException('User already exists', 409);
    }
  }
}
