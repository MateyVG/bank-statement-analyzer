# Стъпки за Deployment 🚀

## 1. Подготовка на проекта

### Отвори проекта във VS Code
```bash
cd bank-statement-analyzer
code .
```

### Инсталирай dependencies
```bash
npm install
```

### Тествай локално
```bash
npm run dev
```
Отвори браузъра на `http://localhost:5173` и тествай с примерните файлове.

---

## 2. GitHub Setup

### Инициализирай Git repository
```bash
git init
git add .
git commit -m "Initial commit: Bank Statement Analyzer"
```

### Създай ново repo в GitHub
1. Отиди на https://github.com/new
2. Име: `bank-statement-analyzer`
3. Private repo (препоръчително)
4. Не добавяй README, .gitignore, license (вече ги имаме)

### Push към GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/bank-statement-analyzer.git
git branch -M main
git push -u origin main
```

---

## 3. Netlify Deployment

### Метод 1: Netlify CLI (Препоръчително) ⭐

#### Инсталирай Netlify CLI
```bash
npm install -g netlify-cli
```

#### Login в Netlify
```bash
netlify login
```

#### Инициализирай проекта
```bash
netlify init
```

Избери:
- "Create & configure a new site"
- Team: (избери твоя team)
- Site name: `bank-analyzer-aladin` (или друго име)
- Build command: `npm run build`
- Publish directory: `dist`

#### Deploy
```bash
netlify deploy --prod
```

---

### Метод 2: GitHub Integration 🔗

1. **Отиди на Netlify Dashboard**
   - https://app.netlify.com

2. **Избери "Add new site" → "Import an existing project"**

3. **Connect to Git provider**
   - Избери GitHub
   - Authorize Netlify

4. **Избери repository**
   - Намери `bank-statement-analyzer`

5. **Build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

---

### Метод 3: Manual Deploy (Drag & Drop) 📦

```bash
# Build проекта
npm run build

# Netlify Drop
# Отиди на https://app.netlify.com/drop
# Drag & drop целия `dist` folder
```

---

## 4. Environment Variables (ако е нужно)

Ако в бъдеще добавиш API keys или secrets:

```bash
# В Netlify Dashboard
Site settings → Environment variables → Add variable
```

---

## 5. Custom Domain (опционално)

### В Netlify Dashboard:
1. Domain settings
2. Add custom domain
3. Follow DNS setup instructions

---

## 6. Проверка след deployment ✅

1. **Отвори live site URL** (напр. `https://bank-analyzer-aladin.netlify.app`)

2. **Тествай функционалност:**
   - Upload DSK XML file ✓
   - Upload OBB TXT file ✓
   - Check summary displays correctly ✓
   - Check transactions table ✓
   - Test on mobile device ✓

3. **PWA функционалност:**
   - Отвори в Chrome на мобилен
   - Виж "Add to Home Screen" prompt
   - Инсталирай като app

---

## 7. Continuous Deployment 🔄

След като setup-неш GitHub integration:

```bash
# Всяка промяна автоматично ще deploy-ва
git add .
git commit -m "Update feature"
git push origin main

# Netlify автоматично ще build и deploy
```

---

## 8. Monitoring & Analytics 📊

### Netlify Analytics (опционално)
- Site settings → Analytics → Enable

### Error Tracking
- Check deployment logs in Netlify dashboard
- Check browser console for errors

---

## Troubleshooting 🔧

### Build fails?
```bash
# Clear cache и rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type errors?
```bash
# Check TypeScript
npx tsc --noEmit
```

### Netlify 404 errors?
- Провери че `netlify.toml` е committed
- Провери redirect rules

---

## Полезни команди 📝

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Netlify
netlify dev          # Run locally with Netlify environment
netlify deploy       # Deploy draft
netlify deploy --prod # Deploy to production
netlify open         # Open Netlify dashboard
netlify status       # Check deployment status

# Git
git status           # Check changes
git log --oneline    # View commits
git push origin main # Push to GitHub
```

---

## Quick Start Checklist ✓

- [ ] `npm install`
- [ ] Test locally (`npm run dev`)
- [ ] Create GitHub repo
- [ ] Push to GitHub
- [ ] Connect to Netlify (choose method)
- [ ] Deploy
- [ ] Test live site
- [ ] Add to mobile home screen (PWA test)

---

## Support & Updates 💬

За промени и updates:
1. Направи промените локално
2. Test с `npm run dev`
3. Commit и push към GitHub
4. Netlify автоматично ще deploy новата версия

Готово! 🎉
