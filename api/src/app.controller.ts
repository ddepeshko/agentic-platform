import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // Перевірка, що сервер живий: знадобиться для Docker і моніторингу (модуль 11)
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
