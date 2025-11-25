import { BankStatement, Transaction } from '../types';

function categorizeOBBTxt(description: string, isCredit: boolean): string {
  const desc = description.toLowerCase();
  
  if (isCredit) {
    if (desc.includes('pos') || desc.includes('карт')) return 'pos_income';
    if (desc.includes('датекс') || desc.includes('datex')) return 'datex_income';
    return 'other_income';
  } else {
    if (desc.includes('такса') || desc.includes('комисион')) return 'fees';
    if (desc.includes('превод') || desc.includes('прехвърляне')) return 'transfers';
    return 'other_expense';
  }
}

function parseAmount(amountStr: string): number {
  if (!amountStr || amountStr.trim() === '') return 0;
  // Replace comma with period for decimal parsing
  return parseFloat(amountStr.replace(',', '.')) || 0;
}

function parseDate(dateStr: string): string {
  // Convert DD/MM/YYYY to YYYY-MM-DD
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dateStr;
}

export function parseOBBTXT(txtContent: string): BankStatement {
  const lines = txtContent.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length < 2) {
    throw new Error('Invalid OBB file format - too few lines');
  }

  const transactions: Transaction[] = [];
  let totalDebit = 0;
  let totalCredit = 0;
  let openingBalance = 0;
  let closingBalance = 0;
  
  // Skip header (first line)
  // Process transaction lines (all except last line which is totals)
  const transactionLines = lines.slice(1, lines.length - 1);
  
  transactionLines.forEach(line => {
    // Split by pipe character
    const parts = line.split('|');
    
    if (parts.length >= 7) {
      const date = parseDate(parts[0]);
      // parts[1] is time - not used currently
      const debitStr = parts[2];
      const creditStr = parts[3];
      
      // Description columns
      const description = parts[4] || '';
      const counterparty = parts[5] || '';
      const balance = parseAmount(parts[6]);
      const reference = parts[7] || '';
      const additionalInfo = parts[8] || '';
      const referenceId = parts[9] || '';
      
      const debit = parseAmount(debitStr);
      const credit = parseAmount(creditStr);
      
      totalDebit += debit;
      totalCredit += credit;
      
      // Track balances
      if (transactions.length === 0) {
        // First transaction - calculate opening balance
        if (credit > 0) {
          openingBalance = balance - credit;
        } else if (debit > 0) {
          openingBalance = balance + debit;
        } else {
          openingBalance = balance;
        }
      }
      closingBalance = balance;
      
      const category = categorizeOBBTxt(description + ' ' + counterparty + ' ' + additionalInfo, credit > 0);
      
      const fullDescription = [description, counterparty, additionalInfo]
        .filter(s => s && s.trim())
        .join(' - ');
      
      transactions.push({
        date,
        description: fullDescription || 'N/A',
        counterparty,
        reference: reference || referenceId,
        invoiceNumber: undefined, // OBB TXT doesn't have invoice numbers  
        debit,
        credit,
        currency: 'BGN',
        category
      });
    }
  });
  
  // Try to get totals from last line if present
  const lastLine = lines[lines.length - 1];
  if (lastLine.startsWith('Total:')) {
    const totalParts = lastLine.split('|');
    if (totalParts.length >= 5) {
      const reportedDebit = parseAmount(totalParts[4]);
      const reportedCredit = parseAmount(totalParts[5]);
      
      // Use reported totals if available
      if (reportedDebit > 0) totalDebit = reportedDebit;
      if (reportedCredit > 0) totalCredit = reportedCredit;
    }
  }

  return {
    bankName: 'ОББ Банка',
    accountHolder: 'ALADIN FOODS',
    iban: 'N/A',
    currency: 'BGN',
    openingBalance,
    closingBalance,
    totalDebit,
    totalCredit,
    transactions
  };
}
