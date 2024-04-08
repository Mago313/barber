import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentSchema } from './schemas/appointment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Appointment', schema: AppointmentSchema },
      { name: 'User', schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [],
})
export class AppoinmentsModule {}
