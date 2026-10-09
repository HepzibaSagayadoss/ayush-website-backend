import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnquiryDto {
  @ApiProperty({ example: 'Ravi Kumar', description: 'Full name of the person making the enquiry' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'ravi.kumar@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(200)
  email: string;

  @ApiPropertyOptional({ example: '+91 98765 43210', description: 'Phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ example: 'I would like to know the availability of Dr. Kalaichelvam for consultation this Saturday.', description: 'Enquiry message content' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}
