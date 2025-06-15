import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { Menu } from '../menu/menu.entity';
import { User } from '../users/user.entity'; 
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Order, Menu, User]), UsersModule], 
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
