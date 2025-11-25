import { BankStatement, Transaction } from '../types';

function parseAmount(amountStr: string): number {
  if (!amountStr || amountStr.trim() === '') return 0;
  // OBB format: 1,236.31 (comma as thousands, period as decimal)
  const cleaned = amountStr.trim().replace(/,/g, '').replace(/\s/g, '');
  return parseFloat(cleaned) || 0;
}

function parseDate(dateStr: string): string {
  const cleaned = dateStr.trim();
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return cleaned;
}

function cleanText(text: string | null | undefined): string {
  if (!text) return '';
  return text.trim();
}

function categorizeOBB(trName: string, nameR: string, isCredit: boolean): string {
  const desc = (trName + ' ' + nameR).toLowerCase();
  
  if (isCredit) {
    if (desc.includes('картова транзакция') || desc.includes('pos')) {
      return 'pos_income';
    }
    if (desc.includes('датекс') || desc.includes('datex')) {
      return 'datex_income';
    }
    if (desc.includes('превод') || desc.includes('бисера') || desc.includes('вноска')) {
      return 'other_income';
    }
    if (desc.includes('валутна търговия') || desc.includes('fx')) {
      return 'fx_income';
    }
    return 'other_income';
  } else {
    if (desc.includes('такса') || desc.includes('комисион')) {
      return 'fees';
    }
    if (desc.includes('превод') || desc.includes('изходящ') || desc.includes('сепа')) {
      return 'transfers';
    }
    if (desc.includes('валутна търговия') || desc.includes('fx')) {
      return 'fx_expense';
    }
    return 'other_expense';
  }
}

// Detect currency from IBAN
function detectCurrency(): string {
  return 'BGN';
}

export function parseOBBXML(xmlContent: string): BankStatement {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid XML format');
  }

  const iban = cleanText(xmlDoc.querySelector('IBAN_S')?.textContent) || '';
  const openingBalance = parseAmount(xmlDoc.querySelector('OPEN_BALANCE')?.textContent || '0');
  const closingBalance = parseAmount(xmlDoc.querySelector('CLOSE_BALANCE')?.textContent || '0');

  // Try to detect currency from transactions or default to BGN
  let currency = detectCurrency();

  const transactions: Transaction[] = [];
  const transactionNodes = xmlDoc.querySelectorAll('TRANSACTION');

  let totalDebit = 0;
  let totalCredit = 0;

  transactionNodes.forEach(txNode => {
    const date = parseDate(cleanText(txNode.querySelector('POST_DATE')?.textContent));
    
    const creditText = cleanText(txNode.querySelector('AMOUNT_C')?.textContent);
    const debitText = cleanText(txNode.querySelector('AMOUNT_D')?.textContent);
    
    const credit = parseAmount(creditText);
    const debit = parseAmount(debitText);
    
    const trName = cleanText(txNode.querySelector('TR_NAME')?.textContent);
    const nameR = cleanText(txNode.querySelector('NAME_R')?.textContent);
    const remI = cleanText(txNode.querySelector('REM_I')?.textContent);
    const remII = cleanText(txNode.querySelector('REM_II')?.textContent);
    const reference = cleanText(txNode.querySelector('REFERENCE')?.textContent);
    
    // Detect currency from REM_II (e.g., "BGN1390.00" or "EUR0.87")
    if (remII) {
      const currMatch = remII.match(/^(BGN|EUR|USD)/i);
      if (currMatch) {
        currency = currMatch[1].toUpperCase();
      }
    }
    
    totalDebit += debit;
    totalCredit += credit;
    
    const isCredit = credit > 0;
    const category = categorizeOBB(trName, nameR, isCredit);
    
    // Store REM_I as invoice/document number (shows full content)
    const invoiceInfo = remI || undefined;
    
    // Build description WITHOUT extra info
    const description = trName || 'N/A';
    
    // Counterparty - prefer nameR, then remII
    const counterparty = nameR || remII || '';
    
    // Reference is the transaction reference
    const fullReference = reference || '';
    
    transactions.push({
      date,
      description,
      counterparty,
      reference: fullReference,
      invoiceNumber: invoiceInfo,
      debit,
      credit,
      currency,
      category
    });
  });

  return {
    bankName: 'ОББ Банка',
    accountHolder: 'ALADIN FOODS',
    iban,
    currency,
    openingBalance,
    closingBalance,
    totalDebit,
    totalCredit,
    transactions
  };
}