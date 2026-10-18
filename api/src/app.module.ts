import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentModule } from './agent/agent.module.js';
import { AppController } from './app.controller.js';
import { EnvSchema } from './config/env.js';

@Module({
  imports: [
    // Читає .env, перевіряє Zod-схемою і падає на старті, якщо чогось бракує (fail fast).
    // isGlobal: ConfigService доступний у всіх модулях без повторного імпорту.
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvSchema,
    }),
    AgentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
