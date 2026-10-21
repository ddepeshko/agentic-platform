import type { ToolDefinition } from '@common/interfaces';
import { AddressLocation } from '@modules/agents/weather/interfaces/index.js';

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

export async function getLocationByAddressName(locationName: string): Promise<AddressLocation> {
    const result = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=1&language=uk`,
    );
    const data = await result.json();
    const [locationData] = data.results;
    if (!locationData) {
        throw new Error(`Location ${locationName} not found. Please try an other location`);
    }
    return {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
    };
}
