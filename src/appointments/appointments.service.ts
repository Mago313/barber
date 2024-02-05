import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointment } from './schemas/appointment.schema';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentDto } from './dto/appointment.dto';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class AppoinmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>,
  ) {}

  async fetchAllDateTime() {
    const appointment = await this.appointmentModel.find();

    return appointment.map((appointment) => {
      return appointment.dateTime;
    });
  }

  async getAppointments() {
    const appointment = await this.appointmentModel.find();

    return appointment.map((appointment) => {
      return appointment;
    });
  }

  async createAppointment(
    dto: AppointmentDto,
  ): Promise<
    { appointment?: Appointment } | { statusCode: number; message: string }
  > {
    try {
      const dateTime = moment.utc(dto?.dateTime).toISOString();
      const duplicateDate = await this.appointmentModel.findOne({
        dateTime,
      });

      if (duplicateDate) {
        throw new Error('Date already exists');
      }

      const { name, cards, phone, price } = dto;

      const appointment = await this.appointmentModel.create({
        name,
        cards,
        dateTime,
        phone,
        price,
      });

      return { appointment };
    } catch (error) {
      return { statusCode: 400, message: error.message };
    }
  }

  async changeIsActive(_id: string, dto: { isActive: boolean }) {
    const appointment = await this.appointmentModel.findOne({
      _id: _id,
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (!dto.isActive) {
      await this.appointmentModel.findByIdAndDelete(_id);
      return null;
    } else {
      await this.appointmentModel.updateOne(
        { _id: _id },
        { $set: { isActive: dto.isActive } },
      );
    }
  }
}
