import React, { useState } from 'react';
import { X, UploadCloud, FileText, Loader2, Sparkles } from 'lucide-react';
import { parseBankStatement } from '../services/geminiService';
import { Transaction } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (transactions: Transaction[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const transactions = await parseBankStatement(inputText);
      if (transactions.length === 0) {
        setError("AI could not identify any income transactions. Please check the text.");
      } else {
        onImport(transactions);
        onClose();
        setInputText('');
      }
    } catch (err) {
      setError("Failed to process text. Please ensure you're using a valid API Key and the text is readable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Sparkles size={20} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">AI Income Capture</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-slate-600 mb-4 text-sm">
            Paste your raw bank statement text, CSV rows, or transaction notifications below. 
            Gemini AI will automatically detect incomes, categorize them, and prepare them for review.
          </p>
          
          <div className="mb-4">
             <label className="block text-sm font-medium text-slate-700 mb-2">
                Or upload a text/csv file
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-500 group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all">
                  <UploadCloud size={20} />
                  <span className="text-sm font-medium">Click to upload statement file</span>
                </div>
              </div>
          </div>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Example: 
2023-10-15 Deposit from Client ABC Inc - Ref: INV-203 $4,500.00
2023-10-16 ACH Credit Stripe Payout $1,250.50
..."
              className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm transition-all outline-none"
            />
            {inputText && (
              <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded-md backdrop-blur">
                {inputText.length} characters
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
               <span className="font-semibold">Error:</span> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={!inputText.trim() || isProcessing}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText size={16} />
                Capture Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;