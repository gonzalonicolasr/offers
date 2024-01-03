import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  checkHealth(): { status: string } {
    return { status: 'OK' };
  }
}
