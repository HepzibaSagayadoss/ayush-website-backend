import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ enum: AppointmentStatus, description: 'Appointment status' })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({ description: 'Updated appointment date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  preferredDate?: string;

  @ApiPropertyOptional({ description: 'Updated appointment time slot' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  preferredTime?: string;

  @ApiPropertyOptional({ description: 'Assigned or re-assigned doctor' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  doctor?: string;

  @ApiPropertyOptional({ description: 'Hospital administrative or consultation notes' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNotes?: string;
}
