import type OpenAI from 'openai';
import type { RiskLevel } from './risk-level.js';

export interface Tool {
    name: string;
    description: string;
    parameters: OpenAI.FunctionParameters;
    readOnly: boolean;
    riskLevel: RiskLevel;
    owner: string;
    execute: (args: Record<string, unknown>) => Promise<unknown>;
}
