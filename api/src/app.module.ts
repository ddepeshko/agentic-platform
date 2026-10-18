import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule } from './configs/index.js';
import { AgentModule } from './modules/agent/agent.module.js';
import { LlmModule } from './services/llm/llm.module.js';

@Module({
    imports: [ConfigModule, LlmModule, AgentModule],
    controllers: [AppController],
})
export class AppModule {}
