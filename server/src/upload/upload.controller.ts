import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const url = await this.cloudinaryService.uploadImage(
        file.buffer,
        'lead-tracker',
      );
      return { url };
    } catch {
      throw new BadRequestException('Failed to upload image');
    }
  }
}
