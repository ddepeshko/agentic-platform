import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '@modules/llm/llm.service.js';
import { ConversationStore } from './conversation.store.js';
import type { ChatRequestDto } from './dto/chat-request.dto.js';
import type { ChatResponseDto } from './response/chat.response.dto.js';
import type { PlaygroundResponseDto } from './response/playground.response.dto.js';
import { AgentRunner } from './runtime/agent-runner.js';
import { weatherToolHandlers } from './weather/handlers/index.js';
import { WEATHER_SCOPE, WEATHER_SYSTEM_PROMPT } from './weather/tools/index.js';
import { weatherTools } from './weather/tools/tool-combainer.js';
import type { AgentRunOptions } from '@modules/agents/runtime/interfaces/index.js';

const MAX_STEPS = 5;

@Injectable()
export class AgentService {
    constructor(
        private readonly llmService: LlmService,
        private readonly conversations: ConversationStore,
    ) {}

    public getPlayground(): PlaygroundResponseDto {
        return {
            model: this.llmService.model,
            tools: weatherTools,
        };
    }

    public async chat({ conversationId, message, useTools }: ChatRequestDto): Promise<ChatResponseDto> {
        const id =
            conversationId && this.conversations.has(conversationId)
                ? conversationId
                : this.conversations.create(WEATHER_SYSTEM_PROMPT);
        const runnerConfig: AgentRunOptions = this.getRunnerConfig(useTools);
        const logger = new Logger(AgentRunner.name);
        this.conversations.append(id, { role: 'user', content: message });

        const runner = new AgentRunner(this.llmService, logger, runnerConfig);
        const { messages, ...run } = await runner.run(this.conversations.get(id));
        messages.forEach((runMessage) => this.conversations.append(id, runMessage));

        return { conversationId: id, messages: this.conversations.get(id), ...run };
    }

    private getRunnerConfig(useTools: boolean | undefined): AgentRunOptions {
        return {
            tools: useTools ? weatherTools : undefined,
            handlers: weatherToolHandlers,
            maxSteps: MAX_STEPS,
            scope: WEATHER_SCOPE,
        };
    }
}
