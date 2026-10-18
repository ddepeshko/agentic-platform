import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AgentService } from './agent.service.js';
import type { ChatRequestDto } from './dto/chat-request.dto.js';
import { LlmErrorFilter } from './llm-error.filter.js';

@Controller()
@UseFilters(LlmErrorFilter)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('playground')
  getPlayground() {
    return this.agentService.getPlayground();
  }

  @Post('chat')
  @HttpCode(200)
  chat(@Body() body: ChatRequestDto) {
    return this.agentService.chat(body);
  }
}
