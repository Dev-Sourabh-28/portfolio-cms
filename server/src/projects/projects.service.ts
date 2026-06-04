import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: dto as Prisma.ProjectCreateInput,
    });
  }

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: {
        portfolio: {
          userId,
        },
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    const { portfolioId, ...updateData } = dto as Prisma.ProjectUpdateInput;

    const data: Prisma.ProjectUpdateInput = {
      ...updateData,
      ...(portfolioId ? { portfolio: { connect: { id: portfolioId } } } : {}) as Prisma.ProjectUpdateInput,
    };

    return this.prisma.project.update({
      where: {
        id,
      },
      data: data as Prisma.ProjectUpdateInput,
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
