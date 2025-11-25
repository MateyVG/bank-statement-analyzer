import React, { useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xml,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        onClick={handleClick}
        className={`
          border-4 border-dashed border-gray-400 p-16 text-center cursor-pointer
          transition-all duration-200 bg-white
          ${isLoading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-gray-600 hover:bg-gray-50'
          }
        `}
      >
        <div className="flex flex-col items-center">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mb-6"></div>
              <p className="text-xl font-semibold text-gray-900 mb-2">Обработване...</p>
            </>
          ) : (
            <>
              <div className="text-6xl font-bold text-gray-400 mb-6">+</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                КАЧИ БАНКОВО ИЗВЛЕЧЕНИЕ
              </p>
              <p className="text-gray-600 mb-6">
                Поддържани формати: XML (ДСК), TXT (ОББ)
              </p>
              <div className="flex gap-6 mt-4">
                <div className="px-6 py-2 border border-gray-300 text-gray-700 font-medium">
                  .xml
                </div>
                <div className="px-6 py-2 border border-gray-300 text-gray-700 font-medium">
                  .txt
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
