import { Module } from '@nestjs/common';
import { AppoinmentsController } from './appointments.controller';
import { AppoinmentsService } from './appointments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema } from './schemas/appointment.schema';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Appointment', schema: AppointmentSchema },
      { name: 'User', schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [AppoinmentsController],
  providers: [AppoinmentsService],
  exports: [],
})
export class AppoinmentsModule {}
