import { config } from "./platform";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: config.LLM_API_KEY,
  baseURL: config.LLM_BASE_URL,
});

const response = await client.chat.completions.create({
  model: config.LLM_MODEL,
  messages: [
    {
      role: "system",
      content: "Ти лаконічний асистент. Відповідай українською.",
    },
    { role: "user", content: "Поясни одним реченням, що таке AI-агент." },
  ],
});

const choice = response.choices[0];

if (!choice?.message.content) {
  console.error(
    "Модель не повернула відповіді:",
    JSON.stringify(response, null, 2),
  );
  process.exit(1);
}

console.log(choice.message.content);
console.log("\n--- usage:", response.usage);
