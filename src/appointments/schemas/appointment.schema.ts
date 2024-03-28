import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Appointment {
  @Prop()
  name: string;

  @Prop()
  phone: number;

  @Prop()
  cards: string[];

  @Prop()
  price: number;

  @Prop({ unique: true })
  dateTime: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
