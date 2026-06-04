import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { PortfoliosService } from './portfolios.service';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: Request & { user: { userId: string } },
    @Body() dto: CreatePortfolioDto,
  ) {
    return this.portfoliosService.create(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request & { user: { userId: string } }) {
    return this.portfoliosService.findAll(req.user.userId);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.portfoliosService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findById(@Param('id') id: string) {
    return this.portfoliosService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreatePortfolioDto) {
    return this.portfoliosService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.portfoliosService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/custom-fields')
  addCustomField(@Param('id') id: string, @Body() dto: CreateCustomFieldDto) {
    return this.portfoliosService.addCustomField(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/custom-fields/:fieldId')
  updateCustomField(
    @Param('fieldId') fieldId: string,
    @Body() dto: UpdateCustomFieldDto,
  ) {
    return this.portfoliosService.updateCustomField(fieldId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/custom-fields/:fieldId')
  deleteCustomField(@Param('fieldId') fieldId: string) {
    return this.portfoliosService.deleteCustomField(fieldId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reorder-fields')
  reorderCustomFields(
    @Param('id') id: string,
    @Body() body: { fieldOrders: { id: string; order: number }[] },
  ) {
    return this.portfoliosService.reorderCustomFields(id, body.fieldOrders);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-field')
  toggleFieldVisibility(
    @Param('id') id: string,
    @Body() body: { fieldType: string; isVisible: boolean },
  ) {
    return this.portfoliosService.toggleFieldVisibility(
      id,
      body.fieldType,
      body.isVisible,
    );
  }
}
