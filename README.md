# Bank Statement Analyzer 📊

Modern web application for analyzing bank statements from different Bulgarian banks (DSK, OBB).

## Features ✨

- 📤 Upload bank statements (XML, TXT formats)
- 📊 Financial summary with opening/closing balances
- 💰 Total debit and credit calculations
- 📈 Transaction categorization (Card payments, Datex, Fees, Expenses, Income)
- 📱 Mobile-responsive design
- 🎨 Modern, clean UI with Tailwind CSS

## Supported Banks 🏦

- **ДСК Банка** - XML format
- **ОББ Банка** - TXT format

## Tech Stack 🛠️

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)

## Getting Started 🚀

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bank-statement-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Open browser at `http://localhost:5173`

## Building for Production 🏗️

```bash
npm run build
```

The `dist` folder will contain the production-ready files.

## Deployment to Netlify 🚀

### Option 1: Drag & Drop
1. Build the project: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist` folder

### Option 2: Git Integration
1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Usage 📝

1. Click on the upload area or drag & drop a file
2. Select your bank statement file (XML for DSK, TXT for OBB)
3. View the analyzed data:
   - Financial summary
   - Transaction details
   - Category breakdown
4. Click "New Upload" to analyze another file

## File Format Support 📄

### DSK Bank (XML)
- Standard CAMT.053 format
- Contains transaction details, balances, counterparties

### OBB Bank (TXT)
- Custom text format with tabular data
- Parsed line by line for transaction extraction

## Project Structure 📁

```
src/
├── components/         # React components
│   ├── Header.tsx
│   ├── FileUpload.tsx
│   ├── SummaryCard.tsx
│   └── TransactionTable.tsx
├── parsers/           # File parsers
│   ├── dskParser.ts
│   ├── obbParser.ts
│   └── index.ts
├── types.ts           # TypeScript interfaces
├── utils.ts           # Utility functions
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Features in Detail 🔍

### Transaction Categories
- 💳 **Card Payments** - POS terminals, card transactions
- 🚚 **Datex** - Datex delivery service payments
- 💰 **Fees & Commissions** - Bank fees and charges
- 📤 **Expenses** - Outgoing payments
- 📥 **Income** - Incoming payments
- 📋 **Other** - Uncategorized transactions

### Summary Metrics
- Opening Balance
- Total Debit
- Total Credit  
- Closing Balance
- Net Change
- Transaction Count
- Category Breakdown

## License 📄

Private - Aladin Foods © 2024

## Support 💬

For issues or questions, contact IT department.
