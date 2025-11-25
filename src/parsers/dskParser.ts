import { BankStatement, Transaction } from '../types';

function parseAmount(amountStr: string): number {
  if (!amountStr || amountStr.trim() === '') return 0;
  const cleaned = amountStr.trim().replace(/\s/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

function parseDate(dateStr: string): string {
  const cleaned = dateStr.trim();
  if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return cleaned;
}

function cleanText(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
}

function categorizeByContent(reason: string, counterparty: string, isCredit: boolean): string {
  const desc = (reason + ' ' + counterparty).toLowerCase();
  
  if (isCredit) {
    // Credit categories
    if (desc.includes('pos') || desc.includes('карт') || /^\d{6}x+\d+/.test(reason)) {
      return 'pos_income';
    }
    if (desc.includes('поделение') || desc.includes('инкасо') || desc.includes('цп d') || desc.includes('цп d')) {
      return 'branch_income';
    }
    if (desc.includes('датекс') || desc.includes('datex')) {
      return 'datex_income';
    }
    return 'other_income';
  } else {
    // Debit categories
    if (desc.includes('такса') || desc.includes('комисион') || desc.includes('fee')) {
      return 'fees';
    }
    if (desc.includes('превод') || desc.includes('прехвърляне') || desc.includes('bisera')) {
      return 'transfers';
    }
    return 'other_expense';
  }
}

export function parseDSKXML(xmlContent: string): BankStatement {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid XML format');
  }

  // Detect format type
  const isOldFormat = xmlContent.includes('<AccountMovementsResult>');

  let iban = '';
  let clientName = 'АЛАДИН ФУУДС ООД';
  let bankName = 'Банка ДСК';
  let openingBalance = 0;
  let closingBalance = 0;

  if (isOldFormat) {
    const bankAccountID = cleanText(xmlDoc.querySelector('BankAccountID')?.textContent);
    const ibanMatch = bankAccountID.match(/([A-Z]{2}\d{2}[A-Z0-9]+)/);
    iban = ibanMatch ? ibanMatch[1] : bankAccountID;
    
    clientName = cleanText(xmlDoc.querySelector('Client n')?.textContent) || 
                 cleanText(xmlDoc.querySelector('Client > n')?.textContent) || clientName;

    const sumsNode = xmlDoc.querySelector('Sums');
    if (sumsNode) {
      openingBalance = parseAmount(sumsNode.querySelector('BeginSum')?.textContent || '0');
      closingBalance = parseAmount(sumsNode.querySelector('EndSum')?.textContent || '0');
    }
  }

  // Extract transactions
  const transactions: Transaction[] = [];
  const movementNodes = xmlDoc.querySelectorAll('AccountMovement');

  let totalDebit = 0;
  let totalCredit = 0;

  movementNodes.forEach(node => {
    const date = parseDate(
      cleanText(node.querySelector('AccountingDate')?.textContent) ||
      cleanText(node.querySelector('ValueDate')?.textContent) || ''
    );
    
    const reason = cleanText(node.querySelector('Reason')?.textContent);
    const counterparty = cleanText(node.querySelector('OppositeSideName')?.textContent);
    const counterpartyAccount = cleanText(node.querySelector('OppositeSideAccount')?.textContent);
    const movementType = cleanText(node.querySelector('MovementType')?.textContent);
    const amount = parseAmount(node.querySelector('Amount')?.textContent || '0');

    const isCredit = movementType.toLowerCase() === 'credit';
    const debit = isCredit ? 0 : amount;
    const credit = isCredit ? amount : 0;

    totalDebit += debit;
    totalCredit += credit;

    const category = categorizeByContent(reason, counterparty, isCredit);

    // Extract short description
    let description = reason.split('<br')[0].trim();
    if (description.length > 80) {
      description = description.substring(0, 80) + '...';
    }

    transactions.push({
      date,
      description,
      counterparty: counterparty || '',
      reference: counterpartyAccount || '',
      invoiceNumber: undefined, // DSK doesn't have invoice numbers
      debit,
      credit,
      currency: 'BGN',
      category
    });
  });

  // For new format, calculate closing balance
  if (!isOldFormat) {
    closingBalance = openingBalance + totalCredit - totalDebit;
  }

  return {
    bankName,
    accountHolder: clientName,
    iban,
    currency: 'BGN',
    openingBalance,
    closingBalance,
    totalDebit,
    totalCredit,
    transactions
  };
}
