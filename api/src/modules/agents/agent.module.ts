import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller.js';
import { AgentService } from './agent.service.js';
import { ConversationStore } from './conversation.store.js';

@Module({
    controllers: [AgentController],
    providers: [AgentService, ConversationStore],
})
export class AgentModule {}
