import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EnquiryStatus } from '../entities/enquiry.entity';

export class UpdateEnquiryDto {
  @ApiPropertyOptional({ enum: EnquiryStatus, description: 'Updated enquiry status' })
  @IsOptional()
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus;

  @ApiPropertyOptional({ description: 'Internal hospital staff notes' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNotes?: string;
}
