import { BankStatement } from './types';

export function exportToCSV(statement: BankStatement): void {
  const headers = [
    'Date',
    'Description', 
    'Counterparty',
    'Invoice/Doc',
    'Reference',
    'Debit',
    'Credit',
    'Currency',
    'Category'
  ];

  const rows = statement.transactions.map(t => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.counterparty.replace(/"/g, '""')}"`,
    t.invoiceNumber || '',
    t.reference,
    t.debit || '',
    t.credit || '',
    t.currency,
    t.category
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `bank_statement_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportSummaryToText(statement: BankStatement): void {
  const summary = `
BANK STATEMENT SUMMARY
=====================

Bank: ${statement.bankName}
Account Holder: ${statement.accountHolder}
IBAN: ${statement.iban}
Currency: ${statement.currency}

BALANCES
--------
Opening Balance: ${statement.openingBalance.toFixed(2)} ${statement.currency}
Total Debit:     ${statement.totalDebit.toFixed(2)} ${statement.currency}
Total Credit:    ${statement.totalCredit.toFixed(2)} ${statement.currency}
Closing Balance: ${statement.closingBalance.toFixed(2)} ${statement.currency}
Net Change:      ${(statement.closingBalance - statement.openingBalance).toFixed(2)} ${statement.currency}

TRANSACTIONS
------------
Total Count: ${statement.transactions.length}

Generated: ${new Date().toLocaleString('bg-BG')}
  `.trim();

  const blob = new Blob([summary], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `summary_${new Date().toISOString().split('T')[0]}.txt`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
