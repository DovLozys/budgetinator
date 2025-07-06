export interface Transaction {
  Date: string;
  Type: 'CREDIT' | 'DEBIT';
  Amount: number;
  Category: string;
  Description?: string;
  [key: string]: any; // Allow for additional bank-specific fields
}

export interface MonthlyStatement {
  month: string;
  monthIndex: number;
  entries: Transaction[];
}

export interface MonthlyTransactionTotals {
  month: string;
  monthIndex: number;
  credits: number;
  debits: number;
}

export interface FileParserModel {
  (statement: Transaction[]): number[];
}