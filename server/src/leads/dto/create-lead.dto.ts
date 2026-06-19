import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(5)
  message!: string;

  @IsOptional()
  @IsString()
  source?: string;
}
