import React from 'react';
import { Transaction, TransactionCategory, TransactionStatus } from '../types';
import { Check, X, Tag, AlertCircle } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
  onUpdateCategory: (id: string, category: TransactionCategory) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onUpdateStatus, 
  onUpdateCategory, 
  onDelete 
}) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Tag size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No Transactions Found</h3>
        <p className="text-slate-500">Import a bank statement to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Payer / Description</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Amount</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  {t.date}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{t.payer}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[200px]" title={t.description}>{t.description}</div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={t.category}
                    onChange={(e) => onUpdateCategory(t.id, e.target.value as TransactionCategory)}
                    className="bg-transparent border-none text-sm font-medium text-indigo-600 focus:ring-0 cursor-pointer hover:bg-indigo-50 rounded px-2 py-1 -ml-2"
                  >
                    {Object.values(TransactionCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right font-medium text-emerald-600">
                  +${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${t.status === TransactionStatus.VERIFIED ? 'bg-emerald-100 text-emerald-800' : ''}
                    ${t.status === TransactionStatus.PENDING ? 'bg-amber-100 text-amber-800' : ''}
                    ${t.status === TransactionStatus.REJECTED ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {t.status !== TransactionStatus.VERIFIED && (
                      <button 
                        onClick={() => onUpdateStatus(t.id, TransactionStatus.VERIFIED)}
                        className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-100"
                        title="Verify"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {t.status === TransactionStatus.PENDING && (
                      <button 
                         onClick={() => onUpdateStatus(t.id, TransactionStatus.REJECTED)}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-100"
                        title="Reject"
                      >
                        <AlertCircle size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-red-500"
                      title="Delete"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;