export interface Transaction {
  date: string;
  description: string;
  counterparty: string;
  reference: string;
  invoiceNumber?: string; // NEW: For invoice/document numbers
  debit: number;
  credit: number;
  currency: string;
  category: TransactionCategory;
}

// Category is now a simple string to allow flexible categorization
export type TransactionCategory = string;

export interface BankStatement {
  bankName: string;
  accountHolder: string;
  iban: string;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  totalDebit: number;
  totalCredit: number;
  transactions: Transaction[];
}

export interface Summary {
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
  netChange: number;
  currency: string;
  transactionCount: number;
  categorySummary: {
    [key in TransactionCategory]: number;
  };
}
