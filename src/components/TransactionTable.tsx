import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface TransactionTableProps {
  transactions: Transaction[];
  currency: string;
}

interface CategoryData {
  id: string;
  title: string;
  transactions: Transaction[];
  total: number;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, currency }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Split into CREDIT and DEBIT
  const creditTransactions = transactions.filter(t => t.credit > 0);
  const debitTransactions = transactions.filter(t => t.debit > 0);

  // Group by category
  const groupByCategory = (txns: Transaction[], isCredit: boolean): CategoryData[] => {
    const groups: { [key: string]: Transaction[] } = {};
    
    txns.forEach(t => {
      const cat = t.category || (isCredit ? 'other_income' : 'other_expense');
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });

    const categoryTitles: { [key: string]: string } = {
      'pos_income': 'POS плащания (карти)',
      'card_payment': 'POS плащания (карти)',
      'branch_income': 'Инкасо от поделения',
      'datex_income': 'Датекс',
      'datex': 'Датекс',
      'other_income': 'Други приходи',
      'income': 'Други приходи',
      'fees': 'Такси и комисионни',
      'fee': 'Такси и комисионни',
      'transfers': 'Преводи',
      'other_expense': 'Други разходи',
      'expense': 'Други разходи',
    };

    return Object.entries(groups)
      .map(([id, txns]) => ({
        id,
        title: categoryTitles[id] || id,
        transactions: txns,
        total: txns.reduce((sum, t) => sum + (isCredit ? t.credit : t.debit), 0)
      }))
      .sort((a, b) => b.total - a.total);
  };

  const creditCategories = groupByCategory(creditTransactions, true);
  const debitCategories = groupByCategory(debitTransactions, false);

  // Render category with transactions table
  const renderCategory = (cat: CategoryData, isCredit: boolean) => {
    const isExpanded = expandedCategories.has(cat.id);
    const colorClass = isCredit ? 'text-green-700' : 'text-red-700';
    const headerBg = isCredit ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100';

    return (
      <div key={cat.id} className="border-b border-gray-200 last:border-b-0">
        <div
          className={`px-6 py-3 cursor-pointer ${headerBg} transition-colors`}
          onClick={() => toggleCategory(cat.id)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">{isExpanded ? '▼' : '▶'}</span>
              <span className="font-semibold text-gray-800">{cat.title}</span>
              <span className="text-sm text-gray-500">({cat.transactions.length} тр.)</span>
            </div>
            <span className={`text-lg font-bold ${colorClass}`}>
              {isCredit ? '+' : '-'}{formatCurrency(cat.total, currency)}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Дата</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Описание</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Контрагент</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Фактура/Док.</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Сума</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cat.transactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 max-w-xs truncate">
                      {t.description}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">
                      {t.counterparty || '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">
                      {t.invoiceNumber || '—'}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right font-medium whitespace-nowrap ${colorClass}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(isCredit ? t.credit : t.debit, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);

  return (
    <div className="bg-white border border-gray-300">
      <div className="border-b border-gray-300 px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">ДЕТАЙЛНИ ТРАНЗАКЦИИ</h2>
      </div>

      {/* CREDIT Section */}
      {creditCategories.length > 0 && (
        <div>
          <div className="px-6 py-3 bg-green-100 border-b-2 border-green-600">
            <div className="flex justify-between items-center">
              <span className="font-bold text-green-800">КРЕДИТ (входящи)</span>
              <span className="font-bold text-green-800">+{formatCurrency(totalCredit, currency)}</span>
            </div>
          </div>
          {creditCategories.map(cat => renderCategory(cat, true))}
        </div>
      )}

      {/* DEBIT Section */}
      {debitCategories.length > 0 && (
        <div>
          <div className="px-6 py-3 bg-red-100 border-b-2 border-red-600">
            <div className="flex justify-between items-center">
              <span className="font-bold text-red-800">ДЕБИТ (изходящи)</span>
              <span className="font-bold text-red-800">-{formatCurrency(totalDebit, currency)}</span>
            </div>
          </div>
          {debitCategories.map(cat => renderCategory(cat, false))}
        </div>
      )}
    </div>
  );
};
