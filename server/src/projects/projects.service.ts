import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    const { portfolioId, titleStyle, descriptionStyle, ...projectData } = dto;
    return this.prisma.project.create({
      data: {
        ...projectData,
        titleStyle: titleStyle as Prisma.InputJsonValue,
        descriptionStyle: descriptionStyle as Prisma.InputJsonValue,
        portfolio: {
          connect: { id: portfolioId },
        },
      },
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
    const {
      portfolioId,
      title,
      description,
      githubUrl,
      liveUrl,
      techStack,
      imageUrl,
      imageUrls,
      titleStyle,
      descriptionStyle,
    } = dto;

    const data: Prisma.ProjectUpdateInput = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (githubUrl !== undefined) data.githubUrl = githubUrl;
    if (liveUrl !== undefined) data.liveUrl = liveUrl;
    if (techStack !== undefined) data.techStack = techStack;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (imageUrls !== undefined) data.imageUrls = imageUrls;
    if (titleStyle !== undefined)
      data.titleStyle = titleStyle as Prisma.InputJsonValue;
    if (descriptionStyle !== undefined)
      data.descriptionStyle = descriptionStyle as Prisma.InputJsonValue;
    if (portfolioId) data.portfolio = { connect: { id: portfolioId } };

    return this.prisma.project.update({
      where: {
        id,
      },
      data: data,
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
