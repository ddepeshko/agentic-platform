import type { ResponseFormat } from '@common/interfaces';

export const scopeCheckFormat: ResponseFormat = {
    type: 'json_schema',
    json_schema: {
        name: 'scope_check',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                inScope: {
                    type: 'boolean',
                    description: 'true, якщо запит належить до зони відповідальності агента; false — якщо ні.',
                },
                reply: {
                    type: 'string',
                    description:
                        'Якщо запит поза зоною: коротка ввічлива відмова українською від імені агента — ' +
                        'скажи, що це поза твоєю зоною, і з чим ти можеш допомогти. ' +
                        'Не повторюй і не перефразовуй запит користувача. ' +
                        'Якщо запит у зоні: порожній рядок.',
                },
            },
            required: ['inScope', 'reply'],
            additionalProperties: false,
        },
    },
};
