import { Module } from '@nestjs/common';
import { AppoinmentsController } from './appointments.controller';
import { AppoinmentsService } from './appointments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema } from './schemas/appointment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Appointment', schema: AppointmentSchema },
    ]),
  ],
  controllers: [AppoinmentsController],
  providers: [AppoinmentsService],
  exports: []
})
export class AppoinmentsModule {}
