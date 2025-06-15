import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  token: string; // Use Stripe test tokens like "tok_visa"

  @IsNotEmpty()
  @IsString()
  name: string;
}
