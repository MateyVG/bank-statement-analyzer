import React from 'react';

interface HeaderProps {
  bankName?: string;
  accountHolder?: string;
  onReset: () => void;
  onExportCSV?: () => void;
  onExportSummary?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  bankName, 
  accountHolder, 
  onReset, 
  onExportCSV,
  onExportSummary 
}) => {
  return (
    <div className="bg-white border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              АНАЛИЗ НА БАНКОВИ ИЗВЛЕЧЕНИЯ
            </h1>
            {bankName && (
              <p className="text-sm text-gray-600 mt-1">
                {bankName} • {accountHolder}
              </p>
            )}
          </div>
          
          {bankName && (
            <div className="flex gap-3">
              {onExportCSV && (
                <button
                  onClick={onExportCSV}
                  className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  EXPORT CSV
                </button>
              )}
              {onExportSummary && (
                <button
                  onClick={onExportSummary}
                  className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  EXPORT SUMMARY
                </button>
              )}
              <button
                onClick={onReset}
                className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                НОВ ФАЙЛ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
