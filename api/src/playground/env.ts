// Для playground-скриптів, які запускаються без Nest
export function loadEnv() {
    return {
        LLM_BASE_URL: process.env.LLM_BASE_URL ?? '',
        LLM_API_KEY: process.env.LLM_API_KEY ?? '',
        LLM_MODEL: process.env.LLM_MODEL ?? '',
    };
}
