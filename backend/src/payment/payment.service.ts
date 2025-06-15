import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2022-11-15',
  });

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private usersService: UsersService,
  ) {}

  async processPayment(userId: number, dto: CreatePaymentDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    let paymentMethod;
    try {
      paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: dto.token },
        billing_details: { name: dto.name },
      });
    } catch (err: any) {
      throw new BadRequestException(`Failed to create payment method: ${err.message}`);
    }


    

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: dto.amount * 100, // Stripe uses cents
      currency: dto.currency,
      payment_method: paymentMethod.id,
      confirmation_method: 'manual',
      confirm: true,
    });

    await this.paymentRepository.save({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: dto.amount,
      currency: dto.currency,
      status: paymentIntent.status,
    });

    return { success: true, status: paymentIntent.status };
  }
    async findByUserId(userId: number): Promise<Payment[]> {
    // You probably have a Payment entity that looks roughly like:
    // @Entity()
    // export class Payment {
    //   @PrimaryGeneratedColumn() id: number;
    //   @Column() userId: number;
    //   @Column() stripePaymentIntentId: string;
    //   @Column('numeric') amount: number;
    //   @Column() currency: string;
    //   @Column() status: string;
    //   @CreateDateColumn() createdAt: Date;
    // }
    //
    // We can simply do:
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

}
}
