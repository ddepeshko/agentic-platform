import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import type { ChatMessage, CompletionResult, ToolDefinition } from '../../common/interfaces/index.js';
import { llmConfig } from '../../configs/index.js';

@Injectable()
export class LlmService {
    private readonly client: OpenAI;

    constructor(@Inject(llmConfig.KEY) private readonly config: ConfigType<typeof llmConfig>) {
        this.client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });
    }

    public get model(): string {
        return this.config.model;
    }

    public async complete(messages: ChatMessage[], tools?: ToolDefinition[]): Promise<CompletionResult> {
        const startedAt = Date.now();

        const response = await this.client.chat.completions.create({
            model: this.config.model,
            messages,
            ...(tools?.length ? { tools } : {}),
        });

        const choice = response.choices[0];
        if (!choice) {
            throw new Error('Модель не повернула жодного варіанта відповіді');
        }

        return {
            message: choice.message,
            finishReason: choice.finish_reason,
            usage: response.usage ?? null,
            model: response.model,
            durationMs: Date.now() - startedAt,
        };
    }
}
