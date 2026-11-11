import { geocodeTool, getWeatherTool, type Tool } from '@modules/tools/index.js';

export const WEATHER_SYSTEM_PROMPT =
    'Ти агент погоди. Відповідаєш лише на питання про погоду. ' +
    'На інші питання коротко відповідай, що це поза твоєю зоною відповідальності.';

export const WEATHER_SCOPE =
    'Погода в населених пунктах: поточна температура, вітер і загальні погодні умови, ' +
    'а також поради на їх основі (наприклад, чи брати парасольку, як одягнутися).';

export const WEATHER_TOOLS: Tool[] = [geocodeTool, getWeatherTool];
