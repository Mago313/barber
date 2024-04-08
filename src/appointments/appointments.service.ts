import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { AppointmentDto } from './dto/appointment.dto';
import { Appointment } from './schemas/appointment.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async fetchAllDateTime() {
    const appointment = await this.appointmentModel.find();

    return appointment.map((appointment) => {
      return appointment.dateTime;
    });
  }

  async getAppointments(limit: number) {
    const appointments = await this.appointmentModel
      .find()
      .limit(limit)
      .sort({ dateTime: 1 });

    const totalAppointmentsCount = await this.appointmentModel.countDocuments();

    const hasMore = appointments.length < totalAppointmentsCount;
    return { hasMore, appointments };
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
      const user = await this.userModel.findOne();

      if (user.isDayOff) {
        throw new Error('Day off');
      }

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
      if (error.code === 11000) {
        throw new Error('Date already exists');
      }
      return { statusCode: error.code, message: error.message };
    }
  }

  async deleteAppointment(_id: string) {
    const appointment = await this.appointmentModel.findOne({
      _id: _id,
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return await this.appointmentModel.findByIdAndDelete(_id);
  }
}
