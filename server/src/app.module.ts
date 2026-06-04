import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
// import { LeadsModule } from './leads/leads.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { ProjectsModule } from './projects/projects.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [AuthModule, PrismaModule, PortfoliosModule, ProjectsModule, CloudinaryModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
