import { Transaction, CategoryRule, CategorySuggestion, CategoryLearning } from '../types';
import { StorageManager } from '../utils/storage';

// Default category rules based on common transaction patterns
const DEFAULT_CATEGORY_RULES: CategoryRule[] = [
  // Groceries & Food
  {
    id: 'groceries-supermarkets',
    name: 'Supermarkets',
    category: 'Groceries',
    patterns: [
      'tesco', 'sainsbury', 'asda', 'morrisons', 'waitrose', 'lidl', 'aldi',
      'marks.*spencer', 'm&s', 'iceland', 'co-op', 'coop', 'whole foods',
      'trader joe', 'kroger', 'safeway', 'publix'
    ],
    transactionType: 'DEBIT',
    priority: 8,
    isUserDefined: false,
    confidence: 0.9,
    usageCount: 0
  },
  {
    id: 'restaurants-dining',
    name: 'Restaurants & Dining',
    category: 'Dining Out',
    patterns: [
      'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'mcdonald', 'kfc',
      'subway', 'starbucks', 'costa', 'nero', 'pret', 'nando', 'domino',
      'takeaway', 'delivery', 'uber eats', 'deliveroo', 'just eat'
    ],
    transactionType: 'DEBIT',
    priority: 7,
    isUserDefined: false,
    confidence: 0.85,
    usageCount: 0
  },

  // Transportation
  {
    id: 'transport-fuel',
    name: 'Fuel & Petrol',
    category: 'Transportation',
    patterns: [
      'shell', 'bp', 'esso', 'texaco', 'petrol', 'fuel', 'gas station',
      'chevron', 'mobil', 'total', 'gulf'
    ],
    transactionType: 'DEBIT',
    priority: 9,
    isUserDefined: false,
    confidence: 0.95,
    usageCount: 0
  },
  {
    id: 'transport-public',
    name: 'Public Transport',
    category: 'Transportation',
    patterns: [
      'tfl', 'transport for london', 'oyster', 'bus', 'train', 'metro',
      'underground', 'tube', 'rail', 'national express', 'megabus'
    ],
    transactionType: 'DEBIT',
    priority: 9,
    isUserDefined: false,
    confidence: 0.9,
    usageCount: 0
  },

  // Utilities & Bills
  {
    id: 'utilities-electricity',
    name: 'Electricity',
    category: 'Utilities',
    patterns: [
      'british gas', 'edf', 'eon', 'scottish power', 'npower', 'bulb',
      'octopus energy', 'electricity', 'electric', 'power'
    ],
    transactionType: 'DEBIT',
    priority: 9,
    isUserDefined: false,
    confidence: 0.95,
    usageCount: 0
  },
  {
    id: 'utilities-water',
    name: 'Water',
    category: 'Utilities',
    patterns: ['water', 'thames water', 'severn trent', 'anglian water'],
    transactionType: 'DEBIT',
    priority: 9,
    isUserDefined: false,
    confidence: 0.95,
    usageCount: 0
  },

  // Entertainment
  {
    id: 'entertainment-streaming',
    name: 'Streaming Services',
    category: 'Entertainment',
    patterns: [
      'netflix', 'amazon prime', 'disney', 'spotify', 'apple music',
      'youtube premium', 'hulu', 'hbo', 'paramount'
    ],
    transactionType: 'DEBIT',
    priority: 8,
    isUserDefined: false,
    confidence: 0.9,
    usageCount: 0
  },
  {
    id: 'entertainment-cinema',
    name: 'Cinema & Movies',
    category: 'Entertainment',
    patterns: ['cinema', 'odeon', 'vue', 'cineworld', 'movie', 'film'],
    transactionType: 'DEBIT',
    priority: 8,
    isUserDefined: false,
    confidence: 0.9,
    usageCount: 0
  },

  // Healthcare
  {
    id: 'healthcare-pharmacy',
    name: 'Pharmacy',
    category: 'Healthcare',
    patterns: ['boots', 'pharmacy', 'chemist', 'superdrug', 'lloyds pharmacy'],
    transactionType: 'DEBIT',
    priority: 8,
    isUserDefined: false,
    confidence: 0.85,
    usageCount: 0
  },

  // Income
  {
    id: 'income-salary',
    name: 'Salary',
    category: 'Salary',
    patterns: ['salary', 'payroll', 'wages', 'pay'],
    transactionType: 'CREDIT',
    priority: 9,
    isUserDefined: false,
    confidence: 0.9,
    usageCount: 0
  },

  // Shopping
  {
    id: 'shopping-amazon',
    name: 'Amazon',
    category: 'Shopping',
    patterns: ['amazon', 'amzn'],
    transactionType: 'DEBIT',
    priority: 8,
    isUserDefined: false,
    confidence: 0.9,
    usageCount: 0
  },

  // Rent & Housing
  {
    id: 'housing-rent',
    name: 'Rent',
    category: 'Rent',
    patterns: ['rent', 'rental', 'letting', 'property'],
    amountRange: { min: 500 }, // Typically larger amounts
    transactionType: 'DEBIT',
    priority: 9,
    isUserDefined: false,
    confidence: 0.8,
    usageCount: 0
  }
];

export class SmartCategorizer {
  private rules: CategoryRule[] = [];
  private learningData: CategoryLearning[] = [];

  constructor() {
    this.loadRules();
    this.loadLearningData();
  }

  /**
   * Categorize a single transaction
   */
  categorizeTransaction(transaction: Transaction): CategorySuggestion[] {
    const suggestions: CategorySuggestion[] = [];

    // First, check learning data for exact matches
    const learningMatch = this.findLearningMatch(transaction);
    if (learningMatch) {
      suggestions.push({
        category: learningMatch.category,
        confidence: Math.min(0.95, 0.7 + (learningMatch.frequency * 0.05)),
        reason: `Learned from ${learningMatch.frequency} previous corrections`,
        ruleId: 'learning-' + learningMatch.merchantName
      });
    }

    // Then apply rules
    const ruleMatches = this.findRuleMatches(transaction);
    suggestions.push(...ruleMatches);

    // Sort by confidence (highest first)
    suggestions.sort((a, b) => b.confidence - a.confidence);

    // Return top 3 suggestions
    return suggestions.slice(0, 3);
  }

  /**
   * Categorize multiple transactions
   */
  categorizeTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.map(transaction => {
      const suggestions = this.categorizeTransaction(transaction);

      if (suggestions.length > 0) {
        const bestSuggestion = suggestions[0];
        return {
          ...transaction,
          originalCategory: transaction.Category,
          suggestedCategory: bestSuggestion.category,
          categoryConfidence: bestSuggestion.confidence,
          // Only auto-apply if confidence is high and no existing category
          Category: (!transaction.Category || transaction.Category === 'Unknown' || bestSuggestion.confidence > 0.9)
            ? bestSuggestion.category
            : transaction.Category
        };
      }

      return transaction;
    });
  }

  /**
   * Learn from user correction
   */
  learnFromCorrection(transaction: Transaction, correctedCategory: string): void {
    const merchantName = this.extractMerchantName(transaction.Description || '');

    // Find existing learning entry
    const existingIndex = this.learningData.findIndex(
      entry => entry.merchantName === merchantName && entry.category === correctedCategory
    );

    if (existingIndex >= 0) {
      // Update existing entry
      this.learningData[existingIndex].frequency += 1;
      this.learningData[existingIndex].lastUsed = new Date();
    } else {
      // Create new learning entry
      this.learningData.push({
        merchantName,
        description: transaction.Description || '',
        category: correctedCategory,
        frequency: 1,
        lastUsed: new Date()
      });
    }

    // Mark transaction as user corrected
    transaction.isUserCorrected = true;
    transaction.Category = correctedCategory;

    this.saveLearningData();
  }

  /**
   * Add a custom rule
   */
  addCustomRule(rule: Omit<CategoryRule, 'id' | 'isUserDefined' | 'usageCount'>): void {
    const newRule: CategoryRule = {
      ...rule,
      id: 'custom-' + Date.now(),
      isUserDefined: true,
      usageCount: 0
    };

    this.rules.push(newRule);
    this.saveRules();
  }

  /**
   * Get all rules (for management UI)
   */
  getRules(): CategoryRule[] {
    return [...this.rules];
  }

  /**
   * Get learning data (for management UI)
   */
  getLearningData(): CategoryLearning[] {
    return [...this.learningData];
  }

  private findLearningMatch(transaction: Transaction): CategoryLearning | null {
    const merchantName = this.extractMerchantName(transaction.Description || '');

    return this.learningData
      .filter(entry => entry.merchantName === merchantName)
      .sort((a, b) => b.frequency - a.frequency)[0] || null;
  }

  private findRuleMatches(transaction: Transaction): CategorySuggestion[] {
    const suggestions: CategorySuggestion[] = [];
    const description = (transaction.Description || '').toLowerCase();

    for (const rule of this.rules) {
      // Check transaction type match
      if (rule.transactionType && rule.transactionType !== transaction.Type) {
        continue;
      }

      // Check amount range
      if (rule.amountRange) {
        const amount = Math.abs(transaction.Amount);
        if (rule.amountRange.min && amount < rule.amountRange.min) continue;
        if (rule.amountRange.max && amount > rule.amountRange.max) continue;
      }

      // Check pattern matches
      const matchingPatterns = rule.patterns.filter(pattern => {
        const regex = new RegExp(pattern.toLowerCase(), 'i');
        return regex.test(description);
      });

      if (matchingPatterns.length > 0) {
        // Calculate confidence based on rule confidence and pattern strength
        const patternStrength = matchingPatterns.length / rule.patterns.length;
        const confidence = rule.confidence * (0.7 + patternStrength * 0.3);

        suggestions.push({
          category: rule.category,
          confidence,
          reason: `Matched "${matchingPatterns[0]}" pattern`,
          ruleId: rule.id
        });

        // Update rule usage
        rule.usageCount += 1;
        rule.lastUsed = new Date();
      }
    }

    return suggestions;
  }

  private extractMerchantName(description: string): string {
    // Simple merchant name extraction - could be enhanced
    return description
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 3)
      .join(' ')
      .trim();
  }

  private loadRules(): void {
    const storedRules = StorageManager.loadCategoryRules();
    this.rules = [...DEFAULT_CATEGORY_RULES, ...storedRules];
  }

  private saveRules(): void {
    StorageManager.saveCategoryRules(this.rules);
  }

  private loadLearningData(): void {
    this.learningData = StorageManager.loadLearningData();
  }

  private saveLearningData(): void {
    StorageManager.saveLearningData(this.learningData);
  }
}

// Export singleton instance
export const smartCategorizer = new SmartCategorizer();
