import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('process')
  async processPayment(
    @Req() req: Request,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    const user = req.user as any;
    return this.paymentService.processPayment(user.id, createPaymentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getMyPayments(@Req() req: Request) {
    const user = req.user as any;       // Jwt strategy must have set req.user = { id, ... }
    const userId = user.id as number;
    const payments = await this.paymentService.findByUserId(userId);
    return payments;
  }
  


}
