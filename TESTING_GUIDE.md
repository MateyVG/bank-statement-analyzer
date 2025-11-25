# Примери за тестване 🧪

## Тестови файлове

Качените файлове (DSK.xml и OBB.txt) са отлични за тестване.

---

## Какво да очакваш при upload 📊

### DSK.xml файл:
```
✅ Bank: ДСК Банка
✅ Account: ALADIN FOODS EOOD
✅ Transactions: Множество
✅ Категории: Card payments, Fees, Income, Expenses
```

### OBB.txt файл:
```
✅ Bank: ОББ Банка  
✅ Account: (извлича се от файла)
✅ Transactions: Всички от периода
✅ Автоматична категоризация
```

---

## Expected Output 📈

След upload на файл ще видиш:

### 1. Financial Summary (горе)
```
┌─────────────────────────────────────────┐
│  Opening Balance:    X,XXX.XX BGN      │
│  Total Debit:        X,XXX.XX BGN      │
│  Total Credit:       X,XXX.XX BGN      │
│  Closing Balance:    X,XXX.XX BGN      │
│  Net Change:        ±X,XXX.XX BGN      │
│  Transactions:       XX                 │
└─────────────────────────────────────────┘
```

### 2. Category Breakdown
```
💳 Card Payments:      X,XXX.XX BGN
🚚 Datex:              X,XXX.XX BGN  
💰 Fees & Commissions: X,XXX.XX BGN
📤 Expenses:           X,XXX.XX BGN
📥 Income:             X,XXX.XX BGN
```

### 3. Transaction Table
```
Date       | Description        | Debit    | Credit   | Category
-----------|-------------------|----------|----------|---------------
DD.MM.YYYY | POS Terminal...   | XXX.XX   | -        | 💳 Card Payments
DD.MM.YYYY | Bank Fee          | XX.XX    | -        | 💰 Fees
DD.MM.YYYY | Income Payment    | -        | X,XXX.XX | 📥 Income
```

---

## Тестови сценарии 🎯

### Scenario 1: Upload DSK XML
1. Click на upload zone
2. Избери DSK.xml
3. Изчакай 1-2 секунди
4. ✅ Виж summary и transactions

### Scenario 2: Upload OBB TXT
1. Click на upload zone
2. Избери OBB.txt
3. Изчакай 1-2 секунди
4. ✅ Виж summary и transactions

### Scenario 3: New Upload
1. Upload първи файл
2. Click "New Upload" button
3. Upload втори файл
4. ✅ Старите данни се заменят

### Scenario 4: Sorting
1. Upload файл
2. Click на column header (напр. "Date")
3. ✅ Транзакциите се сортират
4. Click отново
5. ✅ Реверс сортиране

### Scenario 5: Mobile Test
1. Отвори в mobile browser
2. Upload файл
3. ✅ Responsive design работи
4. ✅ Horizontal scroll в таблицата

### Scenario 6: PWA Install
1. Отвори в Chrome mobile
2. ✅ Виж "Add to Home Screen"
3. Install
4. ✅ App работи offline ready

---

## Validation Points ✅

При тестване провери:

### Summary Accuracy
- [ ] Opening Balance е верен
- [ ] Closing Balance е верен
- [ ] Total Debit съвпада с файла
- [ ] Total Credit съвпада с файла
- [ ] Net Change = Closing - Opening

### Transaction Details
- [ ] Всички транзакции са показани
- [ ] Дати са правилни
- [ ] Суми са точни
- [ ] Описания са четими
- [ ] Категории са логични

### UI/UX
- [ ] No broken layouts
- [ ] Colors are consistent
- [ ] Icons display correctly
- [ ] Buttons работят
- [ ] Loading states работят
- [ ] Error handling работи

### Performance
- [ ] Upload е бърз (< 3 сек)
- [ ] Smooth scrolling в таблицата
- [ ] No lag при sorting
- [ ] Responsive на mobile

---

## Edge Cases 🔍

Тествай и тези случаи:

### Invalid Files
```
❌ Upload .pdf файл
Expected: Error message

❌ Upload празен файл  
Expected: Error message

❌ Upload корумпиран XML
Expected: Graceful error handling
```

### Large Files
```
📊 Upload файл с 1000+ транзакции
Expected: Работи без забавяне
```

### Special Characters
```
✓ Кирилица в описания
✓ Special chars (€, $, %)
✓ Long text truncation
```

---

## Browser Testing Matrix 🌐

Test на различни browsers:

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome  | 120+    | ✅      | ✅     | Primary |
| Firefox | 120+    | ✅      | ✅     | Primary |
| Safari  | 17+     | ✅      | ✅     | Primary |
| Edge    | 120+    | ✅      | ✅     | Secondary |

---

## Regression Testing 🔄

След промени в кода:

1. **Smoke Test**
   - Upload работи ли?
   - Summary показва ли се?
   - Table рендерира ли се?

2. **Integration Test**
   - Двата parsers работят ли?
   - Categories assignment правилен ли е?
   - Calculations точни ли са?

3. **Visual Test**
   - Layout не е счупен ли?
   - Colors правилни ли са?
   - Responsive работи ли?

---

## Performance Benchmarks ⚡

Target metrics:

```
First Contentful Paint:  < 1.5s
Time to Interactive:     < 3.0s  
Total Blocking Time:     < 300ms
Cumulative Layout Shift: < 0.1
Largest Contentful Paint:< 2.5s
```

Measure с Chrome DevTools → Lighthouse

---

## User Acceptance Testing 👥

Дай на реален потребител да тества:

### Task List
1. [ ] "Upload твоето банково извлечение"
2. [ ] "Намери колко пари си похарчил за Datex"
3. [ ] "Кои са всички такси за месеца?"
4. [ ] "Колко общо е дебита?"
5. [ ] "Сортирай по дата"

Събери feedback:
- Ясно ли е UI-а?
- Бързо ли е?
- Има ли бъгове?
- Липсва ли нещо?

---

## Bug Report Template 🐛

Ако намериш проблем:

```markdown
**Bug Description:**
[Кратко описание]

**Steps to Reproduce:**
1. Направи X
2. После Y
3. Резултат: Z

**Expected:**
[Какво очакваш да се случи]

**Actual:**
[Какво реално се случи]

**File Used:**
[Име на файла]

**Browser:**
[Chrome 120, Firefox 120, etc.]

**Screenshots:**
[Ако е възможно]
```

---

## Production Checklist ✓

Преди да дадеш на потребители:

### Technical
- [ ] Build успешен (`npm run build`)
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Tested двата file formata
- [ ] Mobile responsive
- [ ] PWA manifest валиден

### Content
- [ ] README актуален
- [ ] Instructions ясни
- [ ] Error messages helpful
- [ ] No debug logs в production

### Deployment
- [ ] Netlify deployment успешен
- [ ] Custom domain setup (опционално)
- [ ] HTTPS активен
- [ ] Performance OK (Lighthouse 90+)

### Security
- [ ] No API keys в code
- [ ] No sensitive data hardcoded
- [ ] File processing е client-side only

---

## Support Plan 🆘

След deployment:

### Week 1
- Daily check за errors
- Collect user feedback
- Quick fixes ако е нужно

### Month 1
- Monitor usage
- Performance optimization
- Feature requests priority

### Ongoing
- Monthly updates
- Security patches
- Browser compatibility checks

---

Готов за тестване! 🎉

За въпроси: IT отдел - Matey
