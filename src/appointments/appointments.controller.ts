import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AppointmentsService } from './appointments.service';
import { AppointmentDto } from './dto/appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Get('/date-time')
  fetchAllDateTime() {
    return this.appointmentService.fetchAllDateTime();
  }

  @Get('/get')
  @Auth('admin')
  async getAppointments(@Query('limit') limit: number) {
    return await this.appointmentService.getAppointments(limit);
  }

  @Post('/create')
  create(@Body() dto: AppointmentDto) {
    return this.appointmentService.createAppointment(dto);
  }
  @Delete('/delete/:id')
  @Auth('admin')
  changeIsActive(@Param('id') _id: string) {
    return this.appointmentService.deleteAppointment(_id);
  }
}
