import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

//export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  menuId?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
