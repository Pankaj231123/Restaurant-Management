// src/auth/auth.service.ts

import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  // In-memory OTP cache; replace with Redis or DB in production
  private otpCache: Record<string, string> = {};

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /** Validate credentials and return user without password */
  private async validateUserCredentials(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  /** Standard email+password login */
  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.validateUserCredentials(email, password);
    const payload = { sub: user.id, username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }

  /** Generate and send OTP to user’s email */
  async generateAndSendOtp(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('No account found for this email');
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    this.otpCache[email] = otp;

    try {
      await this.usersService.sendOtpEmail(email, otp); // delegate to UsersService or call mailer directly
      return { message: 'OTP sent successfully' };
    } catch (err) {
      console.error('Error sending OTP:', err);
      throw new BadRequestException('Failed to send OTP email');
    }
  }

  /** Verify the OTP and issue a JWT */
  async loginWithOtp(email: string, otp: string): Promise<{ access_token: string }> {
    const expected = this.otpCache[email];
    if (!expected) {
      throw new BadRequestException('No OTP requested for this email');
    }
    if (expected !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    delete this.otpCache[email];

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found after OTP verification');
    }

    const payload = { sub: user.id, username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }
}
