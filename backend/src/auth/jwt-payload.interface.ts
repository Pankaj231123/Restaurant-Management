import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {

  @Get()
  @UseGuards(AuthGuard('jwt')) // This will protect the route
  getProfile() {
    return { message: 'This is a protected profile route' };
  }

  
}
export interface JwtPayload {
    username: string;
    sub: number;
  }
