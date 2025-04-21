import { HttpException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTagDto: CreateTagDto, userId: string) {
    const tag = await this.prisma.tag.create({
      data: {
        name: createTagDto.name,
        userId: userId,
      },
    });
    return tag;
  }

  async findAll(userId: string) {
    const tags = await this.prisma.tag.findMany({
      where: {
        userId,
      },
    });
    return tags;
  }

  async remove(userId: string, id: string) {
    try {
      const tag = await this.prisma.tag.delete({
        where: {
          id: id,
          userId: userId,
        },
      });
      return tag;
    } catch (error) {
      console.log(error);
      return new HttpException(error.message, error.status);
    }
  }
}
