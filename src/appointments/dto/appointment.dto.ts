import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class AppointmentDto {
  @IsString()
  name: string;

  @IsNumber()
  phone: number;

  @IsArray()
  cards: string[];

  @IsNumber()
  price: number;

  @IsDateString()
  dateTime: Date;
}
