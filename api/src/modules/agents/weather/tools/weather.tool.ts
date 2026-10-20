import type { ToolDefinition, ToolHandler } from '@common/interfaces';
import type { WeatherResult } from '../interfaces/index.js';

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

export const weatherToolHandlers: Record<string, ToolHandler> = {
    get_weather: (args) => getWeather(Number(args.latitude), Number(args.longitude)),
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
