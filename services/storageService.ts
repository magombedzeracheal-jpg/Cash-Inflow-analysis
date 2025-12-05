import { Transaction, TransactionStatus } from '../types';

const STORAGE_KEY = 'incomeflow_transactions';

export const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load transactions", e);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error("Failed to save transactions", e);
  }
};

export const calculateStats = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, t) => {
      if (t.status !== TransactionStatus.REJECTED) {
        acc.totalIncome += t.amount;
        if (t.status === TransactionStatus.VERIFIED) {
          acc.verifiedCount++;
        } else {
          acc.pendingIncome += t.amount;
        }
      }
      return acc;
    },
    { totalIncome: 0, pendingIncome: 0, verifiedCount: 0, averageTransaction: 0 }
  );
};