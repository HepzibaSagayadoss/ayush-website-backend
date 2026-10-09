import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Sundar Raman', description: 'Patient full name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  patientName: string;

  @ApiProperty({ example: 'sundar.raman@example.com', description: 'Patient email address' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(200)
  email: string;

  @ApiProperty({ example: '+91 98401 23456', description: 'Patient phone number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone: string;

  @ApiProperty({ example: 'Orthopaedic Surgery', description: 'Selected hospital department or care service' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  service: string;

  @ApiProperty({ example: 'Dr. C. Kalaichelvam', description: 'Preferred doctor or "First available specialist"' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  doctor: string;

  @ApiProperty({ example: '2026-10-15', description: 'Preferred appointment date (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  preferredDate: string;

  @ApiProperty({ example: '10:00 AM', description: 'Preferred time slot' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  preferredTime: string;

  @ApiPropertyOptional({ example: 'Experiencing joint stiffness and knee discomfort.', description: 'Reason for visit / symptoms' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
