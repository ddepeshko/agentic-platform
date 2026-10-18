import { z } from 'zod';

// Одна схема змінних оточення для всього бекенду:
// її використовують і ConfigModule (Nest), і playground-скрипти (без Nest).
export const EnvSchema = z.object({
  LLM_BASE_URL: z.url(),
  LLM_API_KEY: z.string().min(1),
  LLM_MODEL: z.string().min(1),
  // Змінні оточення завжди рядки, тому coerce перетворює "3000" на число
  PORT: z.coerce.number().int().positive().default(3000),
});

export type Env = z.infer<typeof EnvSchema>;

// Для скриптів поза Nest (playground): та сама перевірка, fail fast на старті.
export function loadEnv(): Env {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid configuration:\n' + z.prettifyError(result.error));
    process.exit(1);
  }

  return result.data;
}
