import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import OpenAI from 'openai';

// Помилки провайдера моделі (429 ліміт, 404 модель не знайдена, Ollama не запущена)
// перетворюємо на HTTP-відповідь з тим самим статусом і зрозумілим повідомленням.
@Catch(OpenAI.APIError)
export class LlmErrorFilter extends BaseExceptionFilter {
  override catch(
    error: InstanceType<typeof OpenAI.APIError>,
    host: ArgumentsHost,
  ) {
    // Немає статусу = модель недоступна (мережа, Ollama вимкнена) → 502 Bad Gateway
    const status = error.status ?? HttpStatus.BAD_GATEWAY;
    super.catch(
      new HttpException(error.message, status, { cause: error }),
      host,
    );
  }
}
