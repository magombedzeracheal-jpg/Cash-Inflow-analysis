import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Settings, 
  Plus, 
  Download,
  Search,
  ChevronDown
} from 'lucide-react';
import { Transaction, TransactionCategory, TransactionStatus, ViewState } from './types';
import StatsCards from './components/StatsCards';
import IncomeChart from './components/IncomeChart';
import TransactionTable from './components/TransactionTable';
import ImportModal from './components/ImportModal';
import { loadTransactions, saveTransactions, calculateStats } from './services/storageService';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Load
  useEffect(() => {
    const loaded = loadTransactions();
    setTransactions(loaded);
  }, []);

  // Persist on change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Derived State
  const stats = calculateStats(transactions);
  
  const filteredTransactions = transactions
    .filter(t => {
       const searchLower = searchQuery.toLowerCase();
       return (
         t.payer.toLowerCase().includes(searchLower) ||
         t.description.toLowerCase().includes(searchLower) ||
         t.amount.toString().includes(searchLower)
       );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Handlers
  const handleImport = (newTransactions: Transaction[]) => {
    setTransactions(prev => [...newTransactions, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: TransactionStatus) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleUpdateCategory = (id: string, category: TransactionCategory) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, category } : t));
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">IncomeFlow</h1>
        </div>
        
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setView('transactions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'transactions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Wallet size={20} />
            <span className="font-medium">Transactions</span>
            {stats.pendingIncome > 0 && (
               <span className="ml-auto bg-amber-500 text-xs font-bold text-white px-2 py-0.5 rounded-full">New</span>
            )}
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800 rounded-xl p-4">
             <p className="text-xs text-slate-400 mb-2">Monthly Goal</p>
             <div className="flex justify-between items-end mb-2">
               <span className="text-lg font-bold text-white">${stats.totalIncome.toLocaleString()}</span>
               <span className="text-xs text-indigo-400 font-medium">75%</span>
             </div>
             <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
               <div className="bg-indigo-500 h-full rounded-full" style={{ width: '75%' }}></div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4 text-slate-500">
             <span className="font-medium text-slate-800 capitalize">{view}</span>
          </div>

          <div className="flex items-center gap-4">
             <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
               <Search size={18} />
             </button>
             <div className="h-8 w-[1px] bg-slate-200"></div>
             <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  JD
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">John Doe</span>
                <ChevronDown size={14} className="text-slate-400" />
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {view === 'dashboard' ? 'Financial Overview' : 'Recent Incomes'}
              </h2>
              <p className="text-slate-500 mt-1">
                Manage and track your organization's revenue streams.
              </p>
            </div>
            
            <button 
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span className="font-medium">Capture Income</span>
            </button>
          </div>

          {/* Conditional Views */}
          {view === 'dashboard' && (
            <>
              <StatsCards stats={stats} />
              <IncomeChart transactions={transactions} />
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                <button onClick={() => setView('transactions')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button>
              </div>
              <TransactionTable 
                transactions={filteredTransactions.slice(0, 5)} 
                onUpdateStatus={handleUpdateStatus}
                onUpdateCategory={handleUpdateCategory}
                onDelete={handleDelete}
              />
            </>
          )}

          {view === 'transactions' && (
             <>
                <div className="mb-6 flex gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search transactions..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                </div>
                <TransactionTable 
                  transactions={filteredTransactions} 
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateCategory={handleUpdateCategory}
                  onDelete={handleDelete}
                />
             </>
          )}

          {view === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 max-w-2xl">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Application Settings</h3>
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                    <input type="text" className="w-full p-2 border border-slate-300 rounded-md" defaultValue="Acme Corp" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
                     <select className="w-full p-2 border border-slate-300 rounded-md">
                       <option>USD ($)</option>
                       <option>EUR (€)</option>
                       <option>GBP (£)</option>
                     </select>
                  </div>
                  <div className="pt-4">
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">Save Changes</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setImportModalOpen(false)} 
        onImport={handleImport}
      />
    </div>
  );
};

export default App;