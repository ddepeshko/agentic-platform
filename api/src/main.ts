import type { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { appConfig } from '@configs';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

    app.setGlobalPrefix(config.prefix);
    await app.listen(config.port);
}
await bootstrap();
