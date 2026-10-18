import type { ToolDefinition } from '../../../common/interfaces/index.js';

export const WEATHER_SYSTEM_PROMPT =
    'Ти агент погоди. Відповідаєш лише на питання про погоду. ' +
    'На інші питання коротко відповідай, що це поза твоєю зоною відповідальності.';

export const getWeatherTool: ToolDefinition = {
    type: 'function',
    function: {
        name: 'get_weather',
        description: 'Повертає поточну погоду (температура, вітер) за географічними координатами.',
        parameters: {
            type: 'object',
            properties: {
                latitude: { type: 'number', description: 'Широта, від -90 до 90' },
                longitude: { type: 'number', description: 'Довгота, від -180 до 180' },
            },
            required: ['latitude', 'longitude'],
        },
    },
};

export const weatherTools: ToolDefinition[] = [getWeatherTool];
