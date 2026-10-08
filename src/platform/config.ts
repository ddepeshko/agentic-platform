import { z } from "zod";

const EnvSchema = z.object({
  LLM_BASE_URL: z.url(),
  LLM_API_KEY: z.string().min(1),
  LLM_MODEL: z.string().min(1),
});

export type Config = z.infer<typeof EnvSchema>;

function loadConfig(): Config {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Invalid configuration:\n" + z.prettifyError(result.error));
    process.exit(1);
  }

  return result.data;
}

export const config = loadConfig();
