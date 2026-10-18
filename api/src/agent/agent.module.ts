import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller.js';
import { AgentService } from './agent.service.js';
import { llmProvider } from './llm.provider.js';

@Module({
  controllers: [AgentController],
  providers: [llmProvider, AgentService],
})
export class AgentModule {}
