import React, { useState } from 'react';
import { Summary, Transaction } from '../types';
import { formatCurrency } from '../utils';

interface SummaryCardProps {
  summary: Summary;
  transactions: Transaction[];
}

interface CategoryData {
  id: string;
  title: string;
  transactions: Transaction[];
  total: number;
}

interface CompanyData {
  name: string;
  total: number;
  count: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, transactions }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Split into CREDIT and DEBIT
  const creditTransactions = transactions.filter(t => t.credit > 0);
  const debitTransactions = transactions.filter(t => t.debit > 0);

  // Group credit transactions by category
  const groupByCategory = (txns: Transaction[], isCredit: boolean): CategoryData[] => {
    const groups: { [key: string]: Transaction[] } = {};
    
    txns.forEach(t => {
      const cat = t.category || (isCredit ? 'other_income' : 'other_expense');
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });

    const categoryTitles: { [key: string]: string } = {
      // Credit categories
      'pos_income': 'POS плащания (карти)',
      'card_payment': 'POS плащания (карти)',
      'branch_income': 'Инкасо от поделения',
      'datex_income': 'Датекс',
      'datex': 'Датекс',
      'other_income': 'Други приходи',
      'income': 'Други приходи',
      // Debit categories
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

  // Group transactions by counterparty
  const groupByCompany = (txns: Transaction[], isCredit: boolean): CompanyData[] => {
    const companies: { [key: string]: { total: number; count: number } } = {};
    
    txns.forEach(t => {
      let name = t.counterparty?.trim() || t.description?.substring(0, 50) || 'Неизвестен';
      // Clean up counterparty name
      if (name.includes('BGN В ПОЛЗА')) name = 'Комисионна';
      if (name.length > 50) name = name.substring(0, 50) + '...';
      
      if (!companies[name]) companies[name] = { total: 0, count: 0 };
      companies[name].total += isCredit ? t.credit : t.debit;
      companies[name].count += 1;
    });

    return Object.entries(companies)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  };

  // Render a category section
  const renderCategory = (cat: CategoryData, isCredit: boolean) => {
    const isExpanded = expandedSections.has(cat.id);
    const companies = groupByCompany(cat.transactions, isCredit);
    const colorClass = isCredit ? 'text-green-700' : 'text-red-700';
    const bgClass = isCredit ? 'hover:bg-green-50' : 'hover:bg-red-50';

    return (
      <div key={cat.id} className="border-b border-gray-100 last:border-b-0">
        <button
          onClick={() => toggleSection(cat.id)}
          className={`w-full px-4 py-3 flex justify-between items-center ${bgClass} transition-colors`}
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-5">{isExpanded ? '▼' : '▶'}</span>
            <span className="font-medium text-gray-800">{cat.title}</span>
            <span className="text-sm text-gray-500">({cat.transactions.length} тр.)</span>
          </div>
          <span className={`font-bold ${colorClass}`}>
            {isCredit ? '+' : '-'}{formatCurrency(cat.total, summary.currency)}
          </span>
        </button>

        {isExpanded && (
          <div className="bg-gray-50 px-4 pb-3">
            <div className="border-t border-gray-200 pt-2">
              {companies.slice(0, 10).map((company, idx) => (
                <div key={idx} className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">
                    • {company.name}
                    <span className="text-gray-400 ml-1">({company.count})</span>
                  </span>
                  <span className={`font-medium ${colorClass}`}>
                    {formatCurrency(company.total, summary.currency)}
                  </span>
                </div>
              ))}
              {companies.length > 10 && (
                <div className="text-sm text-gray-500 italic mt-1">
                  ...и още {companies.length - 10} контрагента
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const netIncome = summary.totalCredit - summary.totalDebit;

  return (
    <div className="bg-white border border-gray-300 mb-6">
      {/* Header */}
      <div className="border-b border-gray-300 px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">ФИНАНСОВО ОБОБЩЕНИЕ</h2>
        <p className="text-sm text-gray-600">{summary.transactionCount} транзакции</p>
      </div>

      <div className="p-6">
        {/* Balances Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          <div>
            <div className="text-sm text-gray-500">Начално салдо</div>
            <div className="text-2xl font-bold">{formatCurrency(summary.openingBalance, summary.currency)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Крайно салдо</div>
            <div className="text-2xl font-bold">{formatCurrency(summary.closingBalance, summary.currency)}</div>
          </div>
        </div>

        {/* CREDIT Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-green-600">
            <h3 className="font-bold text-green-700 text-lg">КРЕДИТ (входящи)</h3>
            <span className="text-xl font-bold text-green-700">
              +{formatCurrency(summary.totalCredit, summary.currency)}
            </span>
          </div>
          <div className="border border-gray-200 rounded">
            {creditCategories.map(cat => renderCategory(cat, true))}
          </div>
        </div>

        {/* DEBIT Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-red-600">
            <h3 className="font-bold text-red-700 text-lg">ДЕБИТ (изходящи)</h3>
            <span className="text-xl font-bold text-red-700">
              -{formatCurrency(summary.totalDebit, summary.currency)}
            </span>
          </div>
          <div className="border border-gray-200 rounded">
            {debitCategories.map(cat => renderCategory(cat, false))}
          </div>
        </div>

        {/* NET Result */}
        <div className="border-2 border-gray-800 p-4 bg-gray-100 rounded">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">НЕТНО ПОСТЪПЛЕНИЕ</span>
            <span className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {netIncome >= 0 ? '+' : ''}{formatCurrency(netIncome, summary.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
