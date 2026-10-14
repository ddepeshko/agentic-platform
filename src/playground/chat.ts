import OpenAI from "openai";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { config } from "../platform";

const client = new OpenAI({
  apiKey: config.LLM_API_KEY,
  baseURL: config.LLM_BASE_URL,
});

const messages: OpenAI.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "Ти лаконічний асистент. Відповідай українською.",
  },
];

const rl = readline.createInterface({ input, output });

while (true) {
  const userInput = await rl.question("\nYou: ");
  if (userInput === "stop") break;

  messages.push({ role: "user", content: userInput });

  const response = await client.chat.completions.create({
    model: config.LLM_MODEL,
    messages,
  });

  const reply = response.choices[0]?.message.content;
  if (!reply) {
    console.error("Модель не повернула текстової відповіді");
    messages.pop(); // прибираємо питання без відповіді, щоб історія лишилась цілісною
    continue;
  }

  console.log(`AI: ${reply}`);
  messages.push({ role: "assistant", content: reply });

  console.log(
    `[messages: ${messages.length}, prompt_tokens: ${response.usage?.prompt_tokens}]`,
  );
}

rl.close();
