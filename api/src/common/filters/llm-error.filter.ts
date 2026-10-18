import { Catch, HttpException, HttpStatus, type ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import OpenAI from 'openai';

// Помилки моделі (429, 404, Ollama не запущена) віддаємо клієнту з тим самим статусом
@Catch(OpenAI.APIError)
export class LlmErrorFilter extends BaseExceptionFilter {
    override catch(error: InstanceType<typeof OpenAI.APIError>, host: ArgumentsHost) {
        const status = error.status ?? HttpStatus.BAD_GATEWAY;
        super.catch(new HttpException(error.message, status, { cause: error }), host);
    }
}
