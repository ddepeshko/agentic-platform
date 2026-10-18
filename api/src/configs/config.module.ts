import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfig } from './app.config.js';
import { llmConfig } from './llm.config.js';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, llmConfig],
        }),
    ],
})
export class ConfigModule {}
