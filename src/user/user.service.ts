import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllTags(userId: string) {
    const tags = await this.prisma.tag.findMany({
      where: {
        userId: userId,
      },
    });
    return tags;
  }
}
