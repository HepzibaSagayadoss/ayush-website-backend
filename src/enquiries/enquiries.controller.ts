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
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { EnquiryStatus } from './entities/enquiry.entity';

@ApiTags('Enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new enquiry from the website contact form' })
  @ApiResponse({ status: 201, description: 'Enquiry submitted successfully' })
  create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiriesService.create(createEnquiryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of enquiries with optional status filter' })
  @ApiQuery({ name: 'status', enum: EnquiryStatus, required: false })
  findAll(@Query('status') status?: EnquiryStatus) {
    return this.enquiriesService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific enquiry by UUID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.enquiriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update enquiry status or add administrative notes' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEnquiryDto: UpdateEnquiryDto,
  ) {
    return this.enquiriesService.update(id, updateEnquiryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an enquiry by UUID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.enquiriesService.remove(id);
  }
}
