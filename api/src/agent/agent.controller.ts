import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AgentService } from './agent.service.js';
import {
  ChatRequestSchema,
  type ChatRequestDto,
} from './dto/chat-request.dto.js';
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
  // Це запит до моделі, а не створення ресурсу, тому 200, а не стандартний для POST 201
  @HttpCode(200)
  chat(@Body({ schema: ChatRequestSchema }) body: ChatRequestDto) {
    return this.agentService.chat(body);
  }
}
