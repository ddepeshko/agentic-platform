# Правила коду для `api/` (NestJS)

## Структура

```
src/
├── main.ts, app.module.ts, app.controller.ts
├── configs/                 ← config.module.ts + окремий *.config.ts на кожну область (registerAs)
├── common/                  ← спільне для всіх модулів
│   ├── interfaces/          ← інтерфейси, по файлу на інтерфейс + barrel
│   ├── filters/             ← exception filters
│   └── (пізніше) guards/ interceptors/ decorators/ constants/ enums/ utils/
├── services/<інтеграція>/   ← обгортки над зовнішніми сервісами: llm, (пізніше) telegram, погодні API
│   ├── <назва>.module.ts       (@Global, експортує сервіс)
│   └── <назва>.service.ts
├── modules/<фіча>/          ← бізнес-модулі
│   ├── <фіча>.module.ts / .controller.ts / .service.ts
│   ├── dto/                 ← вхідні дані (interface …Dto)
│   ├── response/            ← відповіді (interface …ResponseDto)
│   └── tools/               ← тули агента (поки тут; у модулі 2 — окремий modules/tools/)
└── playground/              ← уроки, запускаються через tsx без Nest
```

Зразок — архітектура проєкту CCI (`~/WebstormProjects/cci/api`), оновлена під Nest 12.

## Конфіг

- Кожна область — `registerAs('<назва>', () => ({ ... }))` у `configs/<назва>.config.ts`, підключається в `load` у `config.module.ts`.
- Читаємо типізовано: `@Inject(llmConfig.KEY) config: ConfigType<typeof llmConfig>`. Без `configService.get('a.b')` з рядковими ключами і без `ConfigTypesEnum`.

## Іменування

- Файли: `agent.module.ts`, `agent.controller.ts`, `agent.service.ts`, `chat-request.dto.ts`, `playground.response.dto.ts`, `weather.tool.ts`.
- Класи: `AgentModule`, `AgentController`, `AgentService`, `LlmService`.
- Імпорти з розширенням `.js` (Nest 12 — ESM, `node` запускає `dist/`).

## Модифікатори доступу

- Кожен член класу має явний модифікатор доступу: `public`, `protected` або `private` (поля, методи, геттери, сигнали, `input()`). `public` пишемо явно. Порядок: декоратори → модифікатор доступу → `static` / `readonly` / `override` / `async` / `get`. Конструктор без модифікатора; параметри конструктора — `private readonly`.

## Типи

- `interface` замість `type`, кожен у своєму файлі, експорт через barrel (`index.ts`).
- `type` лише для union або синонімів типів з бібліотек.
- DTO — інтерфейси, без class-validator і Zod.

## Підходи

- Без абстрактних базових класів (`AbstractService`, `AbstractController`): спільну логіку виносимо в сервіси й композицію.
- Сервіси зовнішніх інтеграцій — `@Global()` модулі, щоб не імпортувати їх у кожен модуль.
- Логіка agent loop (урок 1.4+) — звичайний TS-клас без декораторів Nest у `modules/agent/runtime/`; Nest-сервіс лише викликає його.

## Форматування

- 4 пробіли, одинарні лапки, `printWidth` 120 (`.prettierrc`, `.editorconfig`).

## Загальне

- Мінімум коментарів (лише «чому»), без зайвих абстракцій.
- Обробка помилок лише для підключення до моделі (`LlmErrorFilter`) і відповіді агента.
- Тести поки не пишемо.
