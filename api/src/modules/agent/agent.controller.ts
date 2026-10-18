import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { LlmErrorFilter } from '../../common/filters/index.js';
import { AgentService } from './agent.service.js';
import type { ChatRequestDto } from './dto/chat-request.dto.js';
import type { ChatResponseDto } from './response/chat.response.dto.js';
import type { PlaygroundResponseDto } from './response/playground.response.dto.js';

@Controller()
@UseFilters(LlmErrorFilter)
export class AgentController {
    constructor(private readonly agentService: AgentService) {}

    @Get('playground')
    getPlayground(): PlaygroundResponseDto {
        return this.agentService.getPlayground();
    }

    @Post('chat')
    @HttpCode(HttpStatus.OK)
    chat(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
        return this.agentService.chat(body);
    }
}
