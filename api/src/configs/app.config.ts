import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    port: parseInt(process.env.PORT ?? '', 10) || 3000,
    prefix: process.env.API_PREFIX ?? 'api',
}));
