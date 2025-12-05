export enum TransactionCategory {
  SALES = 'Sales',
  SERVICE = 'Service Revenue',
  INVESTMENT = 'Investment',
  REFUND = 'Refund',
  GRANT = 'Grant',
  OTHER = 'Other'
}

export enum TransactionStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected'
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  payer: string;
  category: TransactionCategory;
  status: TransactionStatus;
  rawText?: string; // Original text from bank statement if imported
}

export interface Stats {
  totalIncome: number;
  pendingIncome: number;
  verifiedCount: number;
  averageTransaction: number;
}

export type ViewState = 'dashboard' | 'transactions' | 'settings';