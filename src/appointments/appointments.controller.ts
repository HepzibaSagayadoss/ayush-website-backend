import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from './entities/appointment.entity';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a new doctor appointment from the website form' })
  @ApiResponse({ status: 201, description: 'Appointment request submitted successfully' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List appointments with optional filters for status, doctor, or date' })
  @ApiQuery({ name: 'status', enum: AppointmentStatus, required: false })
  @ApiQuery({ name: 'doctor', type: String, required: false })
  @ApiQuery({ name: 'date', type: String, required: false, description: 'Date format: YYYY-MM-DD' })
  findAll(
    @Query('status') status?: AppointmentStatus,
    @Query('doctor') doctor?: string,
    @Query('date') date?: string,
  ) {
    return this.appointmentsService.findAll(status, doctor, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details by UUID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment status (Confirm/Cancel/Complete) or modify schedule' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment record by UUID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.remove(id);
  }
}
