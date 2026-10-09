import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health & Info')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API Health and Information' })
  @ApiResponse({ status: 200, description: 'API is healthy and online' })
  getHealth() {
    return {
      status: 'online',
      name: 'Ayush Multi Speciality Hospital API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL (Neon Cloud)',
      endpoints: {
        enquiries: '/api/enquiries',
        appointments: '/api/appointments',
      },
    };
  }
}
