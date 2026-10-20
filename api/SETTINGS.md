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
└── modules/
    ├── llm/                 ← клієнт моделі (@Global LlmModule + LlmService)
    └── agents/              ← бізнес-модуль агентів
        ├── agent.module.ts / .controller.ts / .service.ts
        ├── dto/             ← вхідні дані (interface …Dto)
        ├── response/        ← відповіді (interface …ResponseDto)
        └── weather/tools/   ← тули агента погоди (у модулі 2 — окремий modules/tools/)
```

Зразок — архітектура проєкту CCI (`~/WebstormProjects/cci/api`), оновлена під Nest 12.

## Імпорти й аліаси

- Аліаси в `tsconfig.json` (`paths`): `@common/<папка>` → barrel `src/common/<папка>/index.ts`, `@configs` → `src/configs/index.ts`, `@modules/*` → `src/modules/*`.
- Між папками — через аліас: `import { LlmErrorFilter } from '@common/filters'`, `import { LlmService } from '@modules/llm/llm.service.js'`.
- Усередині одного модуля — відносно: `./agent.service.js`.
- `nest build` переписує аліаси у відносні шляхи в `dist/`, тож `node` запускає збірку без додаткових пакетів. Новий аліас = рядок у `paths`.

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
- Сервіси зовнішніх інтеграцій (`llm`, пізніше telegram) — `@Global()` модулі в `modules/`, щоб не імпортувати їх у кожен модуль.
- Логіка agent loop (урок 1.4+) — звичайний TS-клас без декораторів Nest у `modules/agent/runtime/`; Nest-сервіс лише викликає його.

## Форматування

- 4 пробіли, одинарні лапки, `printWidth` 120 (`.prettierrc`, `.editorconfig`).

## Загальне

- Мінімум коментарів (лише «чому»), без зайвих абстракцій.
- Обробка помилок лише для підключення до моделі (`LlmErrorFilter`) і відповіді агента.
- Тести поки не пишемо.
