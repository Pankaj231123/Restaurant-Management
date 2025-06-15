import {Controller,Get,Post,Put,Patch,Delete,Param,Body,ParseIntPipe,UseGuards,Req,HttpCode,HttpStatus,NotFoundException,} from '@nestjs/common';
import { Request } from 'express';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Get authenticated user profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@Req() req: Request & { user?: any }) {
    const userId = req.user?.id;
    if (!userId) throw new NotFoundException('Invalid user');

    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.sanitizeUser(user);
  }

  // Create user
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.usersService.saveData(dto);
    return this.sanitizeUser(user);
  }

  // Get all users
  @Get()
  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersService.allData();
    return users.map(this.sanitizeUser);
  }

  // Get one user
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Partial<User>> {
    const user = await this.usersService.getId(id);
    if (!user) throw new NotFoundException('User not found');
    return this.sanitizeUser(user);
  }

  // Update user
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.usersService.updateData(id, dto);
    return this.sanitizeUser(user);
  }

  //  Patch user
  @Patch(':id')
  async patch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.usersService.updateData(id, dto);
    return this.sanitizeUser(user);
  }

  // Delete user
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.deleteId(id);
  }

  // Sanitize user by excluding password
  private sanitizeUser(user: User): Partial<User> {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
