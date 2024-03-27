import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppoinmentsService } from './appointments.service';
import { AppointmentDto } from './dto/appointment.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('appointments')
export class AppoinmentsController {
  constructor(private readonly appointmentService: AppoinmentsService) {}

  @Get('/date-time')
  fetchAllDateTime() {
    return this.appointmentService.fetchAllDateTime();
  }

  @Get('/get')
  @Auth('admin')
  getAppointments() {
    return this.appointmentService.getAppointments();
  }

  @Post('/create')
  create(@Body() dto: AppointmentDto) {
    return this.appointmentService.createAppointment(dto);
  }
  @Patch('/status/:id')
  @Auth('admin')
  changeIsActive(@Param('id') _id: string, @Body() dto: { isActive: boolean }) {
    return this.appointmentService.changeIsActive(_id, dto);
  }
}
