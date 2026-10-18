import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentModule } from './agent/agent.module.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AgentModule],
  controllers: [AppController],
})
export class AppModule {}
