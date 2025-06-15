import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  userId: number; // New: Link to user

  @IsString()
  @IsNotEmpty()
  menuItem: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
