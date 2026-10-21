import type { ToolHandler } from '@common/interfaces';
import { getLocationByAddressName } from '@modules/agents/weather/tools/get-geocode.tool.js';
import { getWeather } from '@modules/agents/weather/tools/index.js';

export const weatherToolHandlers: Record<string, ToolHandler> = {
    get_weather: (args) => getWeather(Number(args.latitude), Number(args.longitude)),
    get_geo_code: (args) => getLocationByAddressName(String(args.location)),
};
