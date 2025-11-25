# 📋 Deployment Checklist

Използвай този checklist за да се уверим че всичко работи перфектно!

---

## Phase 1: Локално Тестване ✅

### Setup
- [ ] Отворил си проекта във VS Code
- [ ] Пуснал си `npm install` без грешки
- [ ] Dependencies са инсталирани успешно

### Development Server
- [ ] `npm run dev` работи без грешки
- [ ] Браузърът се отваря на http://localhost:5173
- [ ] Няма console errors в browser DevTools
- [ ] Няма TypeScript compilation errors

### UI Testing
- [ ] Upload screen се показва правилно
- [ ] Gradient background изглежда добре
- [ ] Upload zone е ясна и функционална
- [ ] Icons се показват правилно

### DSK XML File Testing
- [ ] Upload на DSK.xml работи
- [ ] Summary card се показва след upload
- [ ] Opening Balance е правилен
- [ ] Closing Balance е правилен
- [ ] Total Debit е правилен
- [ ] Total Credit е правилен
- [ ] Net Change е правилен
- [ ] Transaction count е правилен
- [ ] Category breakdown се показва
- [ ] Transaction table се показва
- [ ] Всички транзакции са видими
- [ ] Categories са правилно assigned
- [ ] Dates са форматирани правилно
- [ ] Amounts са форматирани правилно

### OBB TXT File Testing
- [ ] Upload на OBB.txt работи
- [ ] Summary се показва правилно
- [ ] Transactions са парснати правилно
- [ ] Всички данни са видими

### Table Functionality
- [ ] Click на "Date" column header сортира
- [ ] Click отново reverse сортира
- [ ] Сортиране по Description работи
- [ ] Сортиране по Debit работи
- [ ] Сортиране по Credit работи
- [ ] Сортиране по Category работи
- [ ] Hover effects работят на rows
- [ ] Scrolling е smooth

### Export Functionality
- [ ] CSV export бутон се показва след upload
- [ ] Click на CSV download-ва файл
- [ ] CSV файлът се отваря в Excel
- [ ] Данните в CSV са правилни
- [ ] Summary export бутон работи
- [ ] Summary TXT файл се download-ва
- [ ] TXT съдържанието е правилно

### Mobile Responsive Testing
- [ ] Отвори Chrome DevTools
- [ ] Toggle device toolbar (Cmd/Ctrl + Shift + M)
- [ ] Тествай на iPhone SE size
- [ ] Upload zone работи на mobile
- [ ] Summary cards са responsive
- [ ] Table има horizontal scroll
- [ ] Бутоните са достъпни
- [ ] Text е readable
- [ ] Тествай на iPad size
- [ ] Landscape orientation работи

### "New Upload" Functionality
- [ ] "New Upload" бутон се показва след upload
- [ ] Click на бутона изчиства данните
- [ ] Връща се на upload screen
- [ ] Може да се upload-не нов файл

---

## Phase 2: Production Build ✅

### Build Process
- [ ] `npm run build` работи без грешки
- [ ] Няма TypeScript errors
- [ ] Няма ESLint warnings (или са приемливи)
- [ ] Build завършва успешно
- [ ] `dist/` папка е създадена

### Build Preview
- [ ] `npm run preview` работи
- [ ] Preview server стартира
- [ ] Отваряш preview URL
- [ ] Приложението работи като в dev mode
- [ ] Upload работи
- [ ] Export работи
- [ ] Никакви console errors

### Build Output Check
- [ ] `dist/` папката съдържа:
  - [ ] index.html
  - [ ] assets/ папка с JS/CSS
  - [ ] Manifest файлове (за PWA)
- [ ] File sizes са разумни (под 500KB total)

---

## Phase 3: Netlify Deployment ✅

### Pre-deployment
- [ ] Имаш Netlify account
- [ ] Logged in си в Netlify

### Deployment (избери метод)

#### Option A: Drag & Drop
- [ ] Build направен (`npm run build`)
- [ ] Отворил си https://app.netlify.com/drop
- [ ] Drag-нал си `dist/` папката
- [ ] Upload завършва
- [ ] Получаваш deployment URL

#### Option B: Netlify CLI
- [ ] Netlify CLI е инсталиран (`npm i -g netlify-cli`)
- [ ] `netlify login` работи
- [ ] `netlify init` setup завършва
- [ ] `netlify deploy --prod` работи
- [ ] Deployment е успешен

#### Option C: GitHub Integration
- [ ] GitHub repo е създадено
- [ ] Code е pushed към GitHub
- [ ] Netlify site е създаден
- [ ] Repo е connected
- [ ] Build settings са правилни:
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
- [ ] Auto deploy е enabled
- [ ] First deployment е успешен

### Post-deployment
- [ ] Deployment status е "Published"
- [ ] Получаваш live URL
- [ ] URL е достъпен

---

## Phase 4: Live Site Testing ✅

### Basic Functionality
- [ ] Live URL се отваря
- [ ] Page loads без errors
- [ ] Console е чист (no errors)
- [ ] Upload screen се показва
- [ ] Gradient background работи

### File Upload Testing
- [ ] Upload на DSK.xml работи на live site
- [ ] Upload на OBB.txt работи на live site
- [ ] Processing е бърз (под 3 секунди)
- [ ] Резултатите са правилни

### Feature Testing
- [ ] Summary се показва правилно
- [ ] Transactions table работи
- [ ] Sorting работи
- [ ] Export бутоните работят
- [ ] CSV download работи
- [ ] Summary TXT download работи
- [ ] "New Upload" работи

### Performance Testing
- [ ] Page load е бърз (под 3 sec)
- [ ] No lag при interaction
- [ ] Smooth animations
- [ ] Responsive UI

### Mobile Testing (Real Device)
- [ ] Отвори на реален телефон
- [ ] URL се зарежда
- [ ] Upload работи на mobile
- [ ] Touch interactions работят
- [ ] Scrolling е smooth
- [ ] Buttons са достъпни
- [ ] Text е readable

### PWA Testing
- [ ] Отвори в Chrome на mobile
- [ ] "Add to Home Screen" prompt се появява
- [ ] Install приложението
- [ ] App icon се появява на home screen
- [ ] App се отваря като native app
- [ ] Функционалността работи

### Cross-browser Testing
- [ ] Тествай в Chrome
- [ ] Тествай в Firefox
- [ ] Тествай в Safari (ако имаш Mac/iPhone)
- [ ] Тествай в Edge

---

## Phase 5: GitHub (Optional) ✅

### Repository Setup
- [ ] GitHub repo е създадено
- [ ] .gitignore е правилно конфигуриран
- [ ] README.md е updated

### Initial Commit
- [ ] `git init` направен
- [ ] `git add .` направен
- [ ] `git commit -m "Initial commit"` направен
- [ ] Remote repo е добавен
- [ ] Code е pushed успешно

### Continuous Deployment
- [ ] Netlify е connected към GitHub
- [ ] Auto deploy on push е enabled
- [ ] Test commit & push работи
- [ ] Auto deployment работи

---

## Phase 6: Documentation Review ✅

### Check Documentation
- [ ] START_HERE.md е ясен и актуален
- [ ] QUICKSTART.md е верен
- [ ] DEPLOYMENT.md е comprehensive
- [ ] PROJECT_SUMMARY.md е детайлен
- [ ] TESTING_GUIDE.md е полезен
- [ ] README.md е пълен
- [ ] ЗА_МАТЕЙ.md е на Български и ясен

---

## Phase 7: Final Checks ✅

### Security
- [ ] No API keys в code
- [ ] No sensitive data hardcoded
- [ ] File processing е client-side only
- [ ] HTTPS е активен на live site

### Performance
- [ ] Lighthouse score е над 90
- [ ] No major performance issues
- [ ] Bundle size е приемлив

### Accessibility
- [ ] Buttons са достъпни
- [ ] Colors имат добър contrast
- [ ] Text е readable
- [ ] Keyboard navigation работи

### Final Review
- [ ] Всички features работят
- [ ] No known bugs
- [ ] Documentation е complete
- [ ] Ready за production use

---

## Phase 8: User Acceptance ✅

### Share with Real User
- [ ] Дай URL-а на потребител
- [ ] Потребителят може да upload файл
- [ ] Потребителят разбира UI-a
- [ ] Потребителят може да види резултатите
- [ ] Потребителят може да export данни

### Collect Feedback
- [ ] UI е ясен?
- [ ] Features работят според очакванията?
- [ ] Има ли missing functionality?
- [ ] Performance е добър?
- [ ] Mobile experience е добър?

### Address Issues
- [ ] Bug fixes (ако има)
- [ ] Feature requests priority
- [ ] Documentation updates

---

## 🎉 Deployment Complete!

Ако всички checkboxes са ✅, готов си за production! 

### Quick Links
- Live Site: _____________
- GitHub Repo: _____________
- Netlify Dashboard: _____________

### Next Steps
1. Monitor usage первите дни
2. Collect feedback
3. Plan improvements
4. Regular updates

---

## 📞 Support Checklist

### For Users
- [ ] Инструкции как да използват
- [ ] Contact за въпроси
- [ ] Bug report process

### For Developers
- [ ] GitHub issues enabled
- [ ] Documentation е актуална
- [ ] Update process е ясен

---

Успех! 🚀
