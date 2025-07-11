import { CategoryRule, CategoryLearning } from '../types';

// Storage keys
const STORAGE_KEYS = {
  CATEGORY_RULES: 'budgetinator-category-rules',
  CATEGORY_LEARNING: 'budgetinator-category-learning',
  USER_PREFERENCES: 'budgetinator-user-preferences',
  CATEGORY_STATS: 'budgetinator-category-stats'
} as const;

// User preferences interface
export interface UserPreferences {
  defaultCategories: string[];
  autoApplyHighConfidence: boolean;
  confidenceThreshold: number;
  showCategoryConfidence: boolean;
  enableLearning: boolean;
  lastDataExport?: Date;
  theme?: 'light' | 'dark';
}

// Default user preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  defaultCategories: ['Groceries', 'Dining Out', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare'],
  autoApplyHighConfidence: true,
  confidenceThreshold: 0.8,
  showCategoryConfidence: true,
  enableLearning: true
};

/**
 * Storage utility class for managing localStorage operations
 */
export class StorageManager {
  
  /**
   * Save category rules to localStorage
   */
  static saveCategoryRules(rules: CategoryRule[]): boolean {
    try {
      const userRules = rules.filter(rule => rule.isUserDefined);
      localStorage.setItem(STORAGE_KEYS.CATEGORY_RULES, JSON.stringify(userRules));
      return true;
    } catch (error) {
      console.warn('Failed to save category rules:', error);
      return false;
    }
  }

  /**
   * Load category rules from localStorage
   */
  static loadCategoryRules(): CategoryRule[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORY_RULES);
      if (stored) {
        const rules = JSON.parse(stored) as CategoryRule[];
        // Convert date strings back to Date objects
        return rules.map(rule => ({
          ...rule,
          lastUsed: rule.lastUsed ? new Date(rule.lastUsed) : undefined
        }));
      }
      return [];
    } catch (error) {
      console.warn('Failed to load category rules:', error);
      return [];
    }
  }

  /**
   * Save learning data to localStorage
   */
  static saveLearningData(learningData: CategoryLearning[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORY_LEARNING, JSON.stringify(learningData));
      return true;
    } catch (error) {
      console.warn('Failed to save learning data:', error);
      return false;
    }
  }

  /**
   * Load learning data from localStorage
   */
  static loadLearningData(): CategoryLearning[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORY_LEARNING);
      if (stored) {
        const data = JSON.parse(stored) as CategoryLearning[];
        // Convert date strings back to Date objects
        return data.map(entry => ({
          ...entry,
          lastUsed: new Date(entry.lastUsed)
        }));
      }
      return [];
    } catch (error) {
      console.warn('Failed to load learning data:', error);
      return [];
    }
  }

  /**
   * Save user preferences to localStorage
   */
  static saveUserPreferences(preferences: UserPreferences): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
      return false;
    }
  }

  /**
   * Load user preferences from localStorage
   */
  static loadUserPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (stored) {
        const preferences = JSON.parse(stored) as UserPreferences;
        // Convert date strings back to Date objects
        return {
          ...DEFAULT_PREFERENCES,
          ...preferences,
          lastDataExport: preferences.lastDataExport ? new Date(preferences.lastDataExport) : undefined
        };
      }
      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  /**
   * Export all data as JSON
   */
  static exportData(): string {
    const data = {
      categoryRules: this.loadCategoryRules(),
      learningData: this.loadLearningData(),
      userPreferences: this.loadUserPreferences(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON
   */
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.categoryRules || !data.learningData || !data.userPreferences) {
        throw new Error('Invalid data format');
      }

      // Import each data type
      this.saveCategoryRules(data.categoryRules);
      this.saveLearningData(data.learningData);
      this.saveUserPreferences(data.userPreferences);

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Clear all stored data
   */
  static clearAllData(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.warn('Failed to clear data:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let used = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length;
        }
      });

      // Estimate available space (most browsers have ~5-10MB limit)
      const estimated = 5 * 1024 * 1024; // 5MB
      const percentage = (used / estimated) * 100;

      return {
        used,
        available: estimated - used,
        percentage: Math.min(percentage, 100)
      };
    } catch (error) {
      console.warn('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Check if localStorage is available
   */
  static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Backup data to a downloadable file
   */
  static downloadBackup(): void {
    try {
      const data = this.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `budgetinator-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download backup:', error);
    }
  }

  /**
   * Clean up old learning data (keep only recent entries)
   */
  static cleanupOldData(maxAge: number = 365): boolean {
    try {
      const learningData = this.loadLearningData();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAge);

      const filteredData = learningData.filter(entry => 
        entry.lastUsed > cutoffDate || entry.frequency > 5
      );

      return this.saveLearningData(filteredData);
    } catch (error) {
      console.warn('Failed to cleanup old data:', error);
      return false;
    }
  }
}
