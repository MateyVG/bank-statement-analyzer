# Бърз Старт 🚀

## Инсталация

```bash
cd bank-statement-analyzer
npm install
npm run dev
```

Отвори: http://localhost:5173

## Deployment в Netlify

### Най-бърз начин:

```bash
# 1. Build
npm run build

# 2. Drag & drop
# Отиди на https://app.netlify.com/drop
# Драгни `dist` папката
```

### Или чрез Git:

```bash
# 1. Push в GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main

# 2. В Netlify:
# - Import from GitHub
# - Build: npm run build
# - Publish: dist
```

## Как работи приложението

1. **Upload файл** - XML (ДСК) или TXT (ОББ)
2. **Виж резултати:**
   - Opening/Closing Balance
   - Total Debit/Credit
   - Всички транзакции с категории
3. **New Upload** - за нов файл

## Категории на транзакции

- 💳 Card Payments - картови плащания
- 🚚 Datex - датекс доставки
- 💰 Fees - комисионни
- 📤 Expenses - разходи
- 📥 Income - приходи

## Структура

```
src/
├── components/     # UI компоненти
├── parsers/        # XML/TXT парсери
├── types.ts        # TypeScript типове
├── utils.ts        # Помощни функции
└── App.tsx         # Главен компонент
```

## Production Build

```bash
npm run build
# dist/ папката е готова за deployment
```

Готово! 🎉
