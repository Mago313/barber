import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;
  @Prop()
  login: string;
  @Prop()
  password: string;
  @Prop()
  isDayOff: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
