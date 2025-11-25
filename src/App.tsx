import { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { SummaryCard } from './components/SummaryCard';
import { TransactionTable } from './components/TransactionTable';
import { BankStatement, Summary, TransactionCategory } from './types';
import { parseFile, readFileAsText } from './parsers';
import { exportToCSV, exportSummaryToText } from './export';

function App() {
  const [statement, setStatement] = useState<BankStatement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const content = await readFileAsText(file);
      const parsedStatement = parseFile(content, file.name);
      setStatement(parsedStatement);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      console.error('Error parsing file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStatement(null);
    setError(null);
  };

  const handleExportCSV = () => {
    if (statement) {
      exportToCSV(statement);
    }
  };

  const handleExportSummary = () => {
    if (statement) {
      exportSummaryToText(statement);
    }
  };

  const calculateSummary = (): Summary | null => {
    if (!statement) return null;

    const categorySummary: { [key in TransactionCategory]: number } = {
      card_payment: 0,
      datex: 0,
      fee: 0,
      expense: 0,
      income: 0,
      other: 0
    };

    statement.transactions.forEach(transaction => {
      const amount = transaction.debit || transaction.credit;
      categorySummary[transaction.category] += amount;
    });

    return {
      openingBalance: statement.openingBalance,
      totalDebit: statement.totalDebit,
      totalCredit: statement.totalCredit,
      closingBalance: statement.closingBalance,
      netChange: statement.closingBalance - statement.openingBalance,
      currency: statement.currency,
      transactionCount: statement.transactions.length,
      categorySummary
    };
  };

  const summary = calculateSummary();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        bankName={statement?.bankName}
        accountHolder={statement?.accountHolder}
        onReset={handleReset}
        onExportCSV={statement ? handleExportCSV : undefined}
        onExportSummary={statement ? handleExportSummary : undefined}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!statement ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
            
            {error && (
              <div className="mt-6 bg-red-50 border border-red-300 text-red-800 px-4 py-3 max-w-2xl">
                <span className="font-medium">Грешка: </span>
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {summary && <SummaryCard summary={summary} transactions={statement.transactions} />}
            <TransactionTable 
              transactions={statement.transactions} 
              currency={statement.currency}
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Bank Statement Analyzer © {new Date().getFullYear()} - Aladin Foods
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
