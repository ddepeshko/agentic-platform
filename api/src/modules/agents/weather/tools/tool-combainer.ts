import type { ToolDefinition } from '@common/interfaces';
import { getWeatherTool } from '@modules/agents/weather/tools/weather.tool.js';
import { getGeocodeTool } from '@modules/agents/weather/tools/get-geocode.tool.js';

export const weatherTools: ToolDefinition[] = [getGeocodeTool, getWeatherTool];
