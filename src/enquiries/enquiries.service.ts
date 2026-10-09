import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry, EnquiryStatus } from './entities/enquiry.entity';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';

@Injectable()
export class EnquiriesService {
  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepository: Repository<Enquiry>,
  ) {}

  async create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry> {
    const enquiry = this.enquiryRepository.create({
      ...createEnquiryDto,
      status: EnquiryStatus.PENDING,
    });
    return await this.enquiryRepository.save(enquiry);
  }

  async findAll(status?: EnquiryStatus): Promise<Enquiry[]> {
    if (status) {
      return await this.enquiryRepository.find({
        where: { status },
        order: { createdAt: 'DESC' },
      });
    }
    return await this.enquiryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Enquiry> {
    const enquiry = await this.enquiryRepository.findOne({ where: { id } });
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID "${id}" not found`);
    }
    return enquiry;
  }

  async update(id: string, updateEnquiryDto: UpdateEnquiryDto): Promise<Enquiry> {
    const enquiry = await this.findOne(id);
    Object.assign(enquiry, updateEnquiryDto);
    return await this.enquiryRepository.save(enquiry);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const enquiry = await this.findOne(id);
    await this.enquiryRepository.remove(enquiry);
    return { success: true, message: `Enquiry with ID "${id}" successfully deleted` };
  }
}
