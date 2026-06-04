import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePortfolioDto) {
    const { customFields, ...portfolioData } = dto;
    return this.prisma.portfolio.create({
      data: {
        ...portfolioData,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.portfolio.findMany({
      where: {
        userId,
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.portfolio.findUnique({
      where: {
        slug,
      },
      include: {
        projects: true,
        customFields: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.portfolio.findUnique({
      where: {
        id,
      },
      include: {
        projects: true,
        customFields: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(id: string, dto: Partial<CreatePortfolioDto>) {
    const { customFields, ...portfolioData } = dto;
    return this.prisma.portfolio.update({
      where: {
        id,
      },
      data: portfolioData,
    });
  }

  async remove(id: string) {
    return this.prisma.portfolio.delete({
      where: {
        id,
      },
    });
  }

  async addCustomField(portfolioId: string, dto: CreateCustomFieldDto) {
    // Check max 10 custom fields limit
    const existingCount = await this.prisma.customField.count({
      where: { portfolioId },
    });

    if (existingCount >= 10) {
      throw new BadRequestException('Maximum 10 custom fields allowed per portfolio');
    }

    return this.prisma.customField.create({
      data: {
        type: dto.type,
        content: dto.content,
        order: dto.order,
        style: dto.style as any,
        isVisible: dto.isVisible,
        portfolioId,
      },
    });
  }

  async updateCustomField(fieldId: string, dto: UpdateCustomFieldDto) {
    const updateData: any = {};
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.order !== undefined) updateData.order = dto.order;
    if (dto.style !== undefined) updateData.style = dto.style as any;
    if (dto.isVisible !== undefined) updateData.isVisible = dto.isVisible;

    return this.prisma.customField.update({
      where: { id: fieldId },
      data: updateData,
    });
  }

  async deleteCustomField(fieldId: string) {
    return this.prisma.customField.delete({
      where: { id: fieldId },
    });
  }

  async reorderCustomFields(portfolioId: string, fieldOrders: { id: string; order: number }[]) {
    // Update each field's order
    const updates = fieldOrders.map(({ id, order }) =>
      this.prisma.customField.update({
        where: { id },
        data: { order },
      }),
    );

    await Promise.all(updates);
    return this.prisma.customField.findMany({
      where: { portfolioId },
      orderBy: { order: 'asc' },
    });
  }

  async toggleFieldVisibility(portfolioId: string, fieldType: string, isVisible: boolean) {
    // For built-in fields, we'll store them as special custom fields with a specific type
    // This is a simplified approach - in production you might want a separate table for built-in field visibility
    const existingField = await this.prisma.customField.findFirst({
      where: {
        portfolioId,
        type: fieldType,
      },
    });

    if (existingField) {
      return this.prisma.customField.update({
        where: { id: existingField.id },
        data: { isVisible },
      });
    }

    // If it doesn't exist, create it
    return this.prisma.customField.create({
      data: {
        portfolioId,
        type: fieldType,
        content: {},
        order: 0,
        isVisible,
      },
    });
  }
}
