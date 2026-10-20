import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule } from '@configs';
import { LlmModule } from '@modules/llm/llm.module.js';
import { AgentModule } from '@modules/agents/agent.module.js';

@Module({
    imports: [ConfigModule, LlmModule, AgentModule],
    controllers: [AppController],
})
export class AppModule {}
