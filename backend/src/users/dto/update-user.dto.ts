import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)  // Ensure password has at least 6 characters
  password?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string; // Make sure it matches the entity field

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  username?: string;
}
