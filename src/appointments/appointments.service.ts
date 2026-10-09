import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly mailService: MailService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      status: AppointmentStatus.PENDING,
    });
    const saved = await this.appointmentRepository.save(appointment);

    // Trigger confirmation email asynchronously (does not block client response)
    this.mailService.sendAppointmentConfirmation(saved).catch(() => {
      // Error is logged inside MailService
    });

    return saved;
  }

  async findAll(status?: AppointmentStatus, doctor?: string, date?: string): Promise<Appointment[]> {
    const query = this.appointmentRepository.createQueryBuilder('appointment');

    if (status) {
      query.andWhere('appointment.status = :status', { status });
    }

    if (doctor) {
      query.andWhere('appointment.doctor ILIKE :doctor', { doctor: `%${doctor}%` });
    }

    if (date) {
      query.andWhere('appointment.preferredDate = :date', { date });
    }

    query.orderBy('appointment.createdAt', 'DESC');
    return await query.getMany();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentRepository.save(appointment);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
    return { success: true, message: `Appointment with ID "${id}" successfully removed` };
  }
}
