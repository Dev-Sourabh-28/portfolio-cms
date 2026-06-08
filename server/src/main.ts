import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'https://portfolio-cms-sigma-nine.vercel.app',
    process.env.FRONTEND_URL,
  ],
  credentials: true,
});

  app.use(cookieParser());

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);
}

void bootstrap();
