// src/auth/auth.controller.ts

import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

class OtpRequestDto { email: string; }
class OtpVerifyDto { email: string; otp: string; }
class LoginDto { email: string; password: string; }

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Step 1: Request an OTP for the given email.
   */
  @Post('request-otp')
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Failed to send OTP' })
  requestOtp(@Body() dto: OtpRequestDto) {
    if (!dto.email) throw new BadRequestException('Email is required');
    return this.authService.generateAndSendOtp(dto.email);
  }

  /**
   * Step 2: Verify OTP and issue a JWT.
   */
  @Post('verify-otp')
  @ApiResponse({ status: 200, description: 'Logged in via OTP', schema: { example: { access_token: '...' } } })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  verifyOtp(@Body() dto: OtpVerifyDto) {
    if (!dto.email || !dto.otp) {
      throw new BadRequestException('Email and OTP are required');
    }
    return this.authService.loginWithOtp(dto.email, dto.otp);
  }

  /**
   * Optional: Standard email + password login.
   */
  @Post('login')
  @ApiResponse({ status: 200, description: 'Logged in via password', schema: { example: { access_token: '...' } } })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.authService.login(dto.email, dto.password);
  }
}
