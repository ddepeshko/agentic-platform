import type { ToolDefinition } from '@common/interfaces';
import type { GeoLocation } from '../interfaces/index.js';

export const getGeocodeTool: ToolDefinition = {
    type: 'function',
    function: {
        name: 'get_geo_code',
        description:
            'Знаходить координати (широту й довготу) населеного пункту за назвою. ' +
            'Викликай перед get_weather, коли користувач назвав місто, а не координати. Не вгадуй координати сам.',
        parameters: {
            type: 'object',
            properties: {
                location: {
                    type: 'string',
                    description:
                        'Назва населеного пункту в називному відмінку, без прийменників: «Львів», а не «у Львові». ' +
                        'Можна латиницею. Щоб уточнити країну, додай її через кому: «Opole, Poland».',
                },
            },
            required: ['location'],
        },
    },
};

export async function getLocationByAddressName(locationName: string): Promise<GeoLocation> {
    const params = new URLSearchParams({ name: locationName, count: '1', language: 'uk' });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(`Open-Meteo geocoding ${response.status}: ${data.reason}`);

    const location = data.results?.[0];
    if (!location) {
        throw new Error(`Місто «${locationName}» не знайдено. Спробуй іншу форму назви або латиницею.`);
    }

    return {
        name: location.name,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
    };
}
