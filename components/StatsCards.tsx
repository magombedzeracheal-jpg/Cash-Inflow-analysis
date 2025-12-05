import React from 'react';
import { Stats } from '../types';
import { DollarSign, Activity, CheckCircle, Clock } from 'lucide-react';

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
        <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Total Captured Income</p>
          <h3 className="text-2xl font-bold text-slate-800">${stats.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
        <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Pending Review</p>
          <h3 className="text-2xl font-bold text-slate-800">${stats.pendingIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Verified Transactions</p>
          <h3 className="text-2xl font-bold text-slate-800">{stats.verifiedCount}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Avg. Transaction</p>
          <h3 className="text-2xl font-bold text-slate-800">
             ${(stats.verifiedCount + (stats.pendingIncome > 0 ? 1 : 0)) > 0 
                ? (stats.totalIncome / Math.max(1, (stats.verifiedCount))).toLocaleString(undefined, { maximumFractionDigits: 0 }) 
                : '0'}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;