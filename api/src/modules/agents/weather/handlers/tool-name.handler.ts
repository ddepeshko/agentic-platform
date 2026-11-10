import type { ToolHandler } from '@common/interfaces';
import { getLocationByAddressName, getWeather } from '../tools/index.js';

export const weatherToolHandlers: Record<string, ToolHandler> = {
    get_weather: (args) => getWeather(Number(args.latitude), Number(args.longitude)),
    get_geo_code: (args) => getLocationByAddressName(String(args.location)),
};
