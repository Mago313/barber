import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppoinmentsService } from './appointments.service';
import { Appointment } from './schemas/appointment.schema';
import { AppointmentDto } from './dto/appointment.dto';

@Controller('appointments')
export class AppoinmentsController {
  constructor(private readonly appointmentService: AppoinmentsService) {}
  @Get('/date-time')
  fetchAllDateTime() {
    return this.appointmentService.fetchAllDateTime();
  }

  @Get('/get')
  getAppointments() {
    return this.appointmentService.getAppointments();
  }

  @Post('/create')
  create(@Body() dto: AppointmentDto) {
    return this.appointmentService.createAppointment(dto);
  }
  @Patch('/status/:id')
  
  changeIsActive(
    @Param('id') _id: string,
    @Body() dto: { isActive: boolean },
  ) {
    return this.appointmentService.changeIsActive(_id, dto);
  }
}