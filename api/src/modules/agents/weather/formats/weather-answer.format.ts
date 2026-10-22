import type { ResponseFormat } from '@common/interfaces';

// Приклад схеми. Для погоди не вмикаємо: числа вже структуровані в результатах тулів, зайвий виклик моделі нічого не дає.

export const weatherAnswerFormat: ResponseFormat = {
    type: 'json_schema',
    json_schema: {
        name: 'weather_answer',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                city: {
                    type: 'string',
                    description: 'Назва міста українською, як у питанні користувача, у називному відмінку',
                },
                temperature: {
                    type: 'number',
                    description: 'Температура в °C, точно з результату get_weather',
                },
                windSpeed: {
                    type: 'number',
                    description: 'Швидкість вітру в км/год, точно з результату get_weather',
                },
                summary: {
                    type: 'string',
                    description:
                        'Коротка відповідь користувачу одним-двома реченнями. ' +
                        'Лише на основі даних тулів: не додавай хмарність, опади чи поради, яких немає в даних.',
                },
            },
            required: ['city', 'temperature', 'windSpeed', 'summary'],
            additionalProperties: false,
        },
    },
};
