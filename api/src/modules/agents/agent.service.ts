import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '@modules/llm/llm.service.js';
import { ConversationStore } from './conversation.store.js';
import type { ChatRequestDto } from './dto/chat-request.dto.js';
import type { ChatResponseDto } from './response/chat.response.dto.js';
import type { PlaygroundResponseDto } from './response/playground.response.dto.js';
import { AgentRunner } from './runtime/agent-runner.js';
import { toToolDefinition } from '@modules/tools/index.js';
import { WEATHER_SCOPE, WEATHER_SYSTEM_PROMPT, WEATHER_TOOLS } from './weather/weather.agent.js';
import type { AgentRunOptions } from './runtime/interfaces/index.js';

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
            tools: WEATHER_TOOLS.map(toToolDefinition),
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
            tools: useTools ? WEATHER_TOOLS.map(toToolDefinition) : undefined,
            handlers: Object.fromEntries(WEATHER_TOOLS.map((tool) => [tool.name, tool.execute])),
            maxSteps: MAX_STEPS,
            scope: WEATHER_SCOPE,
            contextWindow: this.llmService.contextWindow,
        };
    }
}
