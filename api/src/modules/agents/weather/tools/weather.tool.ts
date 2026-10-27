import type { ToolDefinition } from '@common/interfaces';
import type { WeatherResult } from '../interfaces/index.js';

export const WEATHER_SYSTEM_PROMPT =
    'Ти агент погоди. Відповідаєш лише на питання про погоду. ' +
    'На інші питання коротко відповідай, що це поза твоєю зоною відповідальності.';

export const WEATHER_SCOPE =
    'Погода в населених пунктах: поточна температура, вітер і загальні погодні умови, ' +
    'а також поради на їх основі (наприклад, чи брати парасольку, як одягнутися).';

export const getWeatherTool: ToolDefinition = {
    type: 'function',
    function: {
        name: 'get_weather',
        description:
            'Повертає поточну погоду за координатами: температуру (°C) і швидкість вітру (км/год). Прогнозу не дає. ' +
            'Координати бери з результату get_geo_code, не вгадуй їх.',
        parameters: {
            type: 'object',
            properties: {
                latitude: { type: 'number', description: 'Широта в градусах, від -90 до 90, напр. 50.45' },
                longitude: { type: 'number', description: 'Довгота в градусах, від -180 до 180, напр. 30.52' },
            },
            required: ['latitude', 'longitude'],
        },
    },
};

export async function getWeather(latitude: number, longitude: number): Promise<WeatherResult> {
    const params = new URLSearchParams({
        latitude: `${latitude}`,
        longitude: `${longitude}`,
        current: 'temperature_2m,wind_speed_10m',
    });
    const url = `https://api.open-meteo.com/v1/forecast?${params}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(`Open-Meteo ${response.status}: ${data.reason}`);

    return {
        time: data.current.time,
        temperature: data.current.temperature_2m,
        temperatureUnit: data.current_units.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        windSpeedUnit: data.current_units.wind_speed_10m,
    };
}
