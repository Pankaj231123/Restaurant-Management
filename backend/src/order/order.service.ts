import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Menu } from '../menu/menu.entity';
import { User } from '../users/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserResponseDto } from '../users/dto/user-response.dto'; // Import UserResponseDto

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const menu = await this.menuRepository.findOne({ where: { id: createOrderDto.menuItem } });
    if (!menu || !menu.isAvailable) {
      throw new Error('Menu item is not available');
    }

    const user = await this.userRepository.findOne({ where: { id: createOrderDto.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const order = new Order();
    order.menu = menu;
    order.quantity = createOrderDto.quantity;
    order.totalPrice = menu.price * createOrderDto.quantity;
    order.user = user;

    const savedOrder = await this.orderRepository.save(order);

    // Return the order excluding the password in the user data
    return {
      ...savedOrder,
      user: new UserResponseDto(user), // Exclude password in response
    };
  }

  async findAll() {
    const orders = await this.orderRepository.find({ relations: ['menu', 'user'] });
    
    // Exclude password for each order's user
    return orders.map(order => ({
      ...order,
      user: new UserResponseDto(order.user), // Exclude password in response
    }));
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['menu', 'user'],
    });
    
    if (!order) {
      throw new Error('Order not found');
    }

    return {
      ...order,
      user: new UserResponseDto(order.user), // Exclude password in response
    };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['menu', 'user'],
    });
    if (!order) {
      throw new Error('Order not found');
    }

    if (updateOrderDto.menuId) {
      const menu = await this.menuRepository.findOne({ where: { id: updateOrderDto.menuId } });
      if (!menu || !menu.isAvailable) {
        throw new Error('Menu item is not available');
      }
      order.menu = menu;
      order.totalPrice = menu.price * (updateOrderDto.quantity ?? order.quantity);
    }

    if (updateOrderDto.quantity) {
      order.quantity = updateOrderDto.quantity;
      order.totalPrice = (order.menu.price) * updateOrderDto.quantity;
    }

    if (updateOrderDto.userId) {
      const user = await this.userRepository.findOne({ where: { id: updateOrderDto.userId } });
      if (!user) {
        throw new Error('User not found');
      }
      order.user = user;
    }

    const updatedOrder = await this.orderRepository.save(order);

    return {
      ...updatedOrder,
      user: new UserResponseDto(order.user), // Exclude password in response
    };
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new Error('Order not found');
    }
    return this.orderRepository.remove(order);
  }
}
