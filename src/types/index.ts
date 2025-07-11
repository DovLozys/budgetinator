export interface Transaction {
  Date: string;
  Type: 'CREDIT' | 'DEBIT';
  Amount: number;
  Category: string;
  Description?: string;
  originalCategory?: string; // Store original category from bank
  suggestedCategory?: string; // AI-suggested category
  categoryConfidence?: number; // Confidence score 0-1
  isUserCorrected?: boolean; // Whether user manually corrected this
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

// Smart Categorization Types
export interface CategoryRule {
  id: string;
  name: string;
  category: string;
  patterns: string[]; // Regex patterns or keywords
  amountRange?: {
    min?: number;
    max?: number;
  };
  transactionType?: 'CREDIT' | 'DEBIT';
  priority: number; // Higher number = higher priority
  isUserDefined: boolean;
  confidence: number; // Base confidence for this rule
  usageCount: number; // How many times this rule has been applied
  lastUsed?: Date;
}

export interface CategorySuggestion {
  category: string;
  confidence: number;
  reason: string; // Why this category was suggested
  ruleId?: string; // Which rule triggered this suggestion
}

export interface CategoryLearning {
  merchantName: string;
  description: string;
  category: string;
  frequency: number; // How many times user chose this category for similar transactions
  lastUsed: Date;
}

export interface CategoryStats {
  category: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  monthlyTrend: number; // Percentage change from previous month
  topMerchants: Array<{
    merchant: string;
    amount: number;
    count: number;
  }>;
}