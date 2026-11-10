import type { ToolDefinition } from '@common/interfaces';
import { getGeocodeTool } from './get-geocode.tool.js';
import { getWeatherTool } from './weather.tool.js';

export const weatherTools: ToolDefinition[] = [getGeocodeTool, getWeatherTool];
