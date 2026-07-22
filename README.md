# ПричепМаркет — Фронтенд

Інтернет-магазин легкових причепів та комплектуючих.

## Швидкий старт

```bash
npm install
npm run dev
```

Дев-сервер запуститься на `http://localhost:5173`.

## Побудова для продакшену

```bash
npm run build
npm run preview
```

При побудові автоматично генерується `sitemap.xml` з усіма товарами.

## Технології

- React 19 + TypeScript
- Vite 6 (бандлер)
- Redux Toolkit (стан)
- Tailwind CSS v4
- Axios (HTTP-клієнт)
- EmailJS (відправка повідомлень)

## Структура проекту

```
src/
├── api/                # Axios-інстанція з автентифікацією
├── components/         # Спільні UI-компоненти
│   ├── admin/          # Адмін-панель
│   ├── checkout/       # Кроки оформлення замовлення
│   ├── icons/          # SVG-іконки
│   └── ui/             # Фільтри, кнопки
├── contexts/           # React Context (авторизація, тема, фільтри)
├── hooks/              # Кастомні хуки
├── pages/              # Сторінки додатка
├── redux/              # Store + slice'и
├── utils/              # Утиліти (SEO, форматуючі)
├── App.tsx             # Роутер + layout
├── index.tsx           # Mount point
└── types.ts            # TypeScript-типи
```

## Роутинг

Кастомний роутинг на основі `window.history` + `locationchange` (без React Router).

| Шлях | Сторінка |
|------|----------|
| `/` | Каталог причепів |
| `/details` | Каталог комплектуючих |
| `/product/{slug}` | Деталі причепу |
| `/details/{id}` | Деталі комплектуючої |
| `/cart` | Кошик |
| `/checkout` | Оформлення замовлення |
| `/favorites` | Обране |
| `/contacts` | Контакти |
| `/delivery-and-payment` | Доставка і оплата |
| `/login` / `/register` | Авторизація |
| `/my-profile` / `/my-orders` | Особистий кабінет |
| `/admin/*` | Адмін-панель |

## Змінні середовища

| Змінна | Опис |
|--------|------|
| `VITE_BASE_API_URL` | URL бекенд-сервера |
| `VITE_SITE_URL` | URL сайту (для SEO) |

## Деплой

Хостинг: **Vercel**. Файл `vercel.json` містить SPA-rewrite, редіректи та заголовки безпеки.
