import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

type AuthPayload = {
  userId: string;
  email: string;
};

type AuthLoginResult = {
  message: string;
  access_token: string;
  user: User;
};

type AuthRequest = Request & {
  user: AuthPayload;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: AuthLoginResult = await this.authService.login(body);

    const isProd = process.env.NODE_ENV === 'production';

    const cookieOptions: Record<string, any> = {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    if (isProd) {
      cookieOptions.secure = true;
      cookieOptions.sameSite = 'none';
      if (process.env.COOKIE_DOMAIN) cookieOptions.domain = process.env.COOKIE_DOMAIN;
    } else {
      cookieOptions.secure = false;
      cookieOptions.sameSite = 'lax';
    }

    res.cookie('token', result.access_token, cookieOptions);

    return {
      message: 'Login successful',
      access_token: result.access_token,
      user: result.user,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return req.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';

    const cookieOptions: Record<string, any> = {};
    if (isProd) {
      cookieOptions.secure = true;
      cookieOptions.sameSite = 'none';
      if (process.env.COOKIE_DOMAIN) cookieOptions.domain = process.env.COOKIE_DOMAIN;
    } else {
      cookieOptions.secure = false;
      cookieOptions.sameSite = 'lax';
    }

    res.clearCookie('token', cookieOptions);
    return { message: 'Logged out' };
  }
}
