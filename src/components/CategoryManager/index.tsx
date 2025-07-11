import { useState, useEffect } from 'react';
import { Transaction } from '../../types';
import { smartCategorizer } from '../../models/smartCategorizer';

interface CategoryManagerProps {
  transactions: Transaction[];
  onTransactionUpdate: (updatedTransaction: Transaction) => void;
  onBulkUpdate: (updates: Array<{ index: number; category: string }>) => void;
}

interface TransactionWithIndex extends Transaction {
  index: number;
}

export function CategoryManager({ transactions, onTransactionUpdate, onBulkUpdate }: CategoryManagerProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set());
  const [bulkCategory, setBulkCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showOnlyUncategorized, setShowOnlyUncategorized] = useState(false);
  const [showOnlyLowConfidence, setShowOnlyLowConfidence] = useState(false);

  // Get unique categories for filter dropdown
  const uniqueCategories = Array.from(new Set(transactions.map(t => t.Category).filter(Boolean)));

  // Filter transactions based on current filters
  const filteredTransactions: TransactionWithIndex[] = transactions
    .map((transaction, index) => ({ ...transaction, index }))
    .filter(transaction => {
      if (filterCategory !== 'all' && transaction.Category !== filterCategory) return false;
      if (showOnlyUncategorized && transaction.Category && transaction.Category !== 'Unknown') return false;
      if (showOnlyLowConfidence && (transaction.categoryConfidence || 1) > 0.7) return false;
      return true;
    });

  const handleCategoryChange = (transaction: TransactionWithIndex, newCategory: string) => {
    const updatedTransaction = { ...transaction, Category: newCategory };
    
    // Learn from this correction
    smartCategorizer.learnFromCorrection(updatedTransaction, newCategory);
    
    onTransactionUpdate(updatedTransaction);
  };

  const handleBulkCategoryChange = () => {
    if (!bulkCategory || selectedTransactions.size === 0) return;

    const updates = Array.from(selectedTransactions).map(index => ({
      index,
      category: bulkCategory
    }));

    // Learn from bulk corrections
    updates.forEach(update => {
      const transaction = transactions[update.index];
      smartCategorizer.learnFromCorrection(transaction, update.category);
    });

    onBulkUpdate(updates);
    setSelectedTransactions(new Set());
    setBulkCategory('');
  };

  const toggleTransactionSelection = (index: number) => {
    const newSelection = new Set(selectedTransactions);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedTransactions(newSelection);
  };

  const selectAll = () => {
    setSelectedTransactions(new Set(filteredTransactions.map(t => t.index)));
  };

  const clearSelection = () => {
    setSelectedTransactions(new Set());
  };

  const getConfidenceColor = (confidence?: number): string => {
    if (!confidence) return '#999';
    if (confidence > 0.8) return '#4CAF50'; // Green
    if (confidence > 0.6) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getConfidenceText = (confidence?: number): string => {
    if (!confidence) return 'Manual';
    return `${Math.round(confidence * 100)}%`;
  };

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <h3>Category Management</h3>
        
        {/* Filters */}
        <div className="filters">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyUncategorized}
              onChange={(e) => setShowOnlyUncategorized(e.target.checked)}
            />
            Show only uncategorized
          </label>
          
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyLowConfidence}
              onChange={(e) => setShowOnlyLowConfidence(e.target.checked)}
            />
            Show only low confidence
          </label>
        </div>

        {/* Bulk operations */}
        {selectedTransactions.size > 0 && (
          <div className="bulk-operations">
            <span>{selectedTransactions.size} transactions selected</span>
            <input
              type="text"
              placeholder="New category"
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              className="bulk-category-input"
            />
            <button onClick={handleBulkCategoryChange} className="bulk-apply-btn">
              Apply to Selected
            </button>
            <button onClick={clearSelection} className="bulk-clear-btn">
              Clear Selection
            </button>
          </div>
        )}

        <div className="selection-controls">
          <button onClick={selectAll} className="select-all-btn">
            Select All Visible
          </button>
        </div>
      </div>

      {/* Transaction list */}
      <div className="transaction-list">
        <div className="transaction-header">
          <span className="col-select">Select</span>
          <span className="col-date">Date</span>
          <span className="col-description">Description</span>
          <span className="col-amount">Amount</span>
          <span className="col-category">Category</span>
          <span className="col-confidence">Confidence</span>
        </div>

        {filteredTransactions.map((transaction) => (
          <div key={transaction.index} className="transaction-row">
            <input
              type="checkbox"
              checked={selectedTransactions.has(transaction.index)}
              onChange={() => toggleTransactionSelection(transaction.index)}
              className="transaction-checkbox"
            />
            
            <span className="col-date">{transaction.Date}</span>
            
            <span className="col-description" title={transaction.Description}>
              {transaction.Description?.substring(0, 40)}
              {(transaction.Description?.length || 0) > 40 ? '...' : ''}
            </span>
            
            <span className={`col-amount ${transaction.Type === 'DEBIT' ? 'debit' : 'credit'}`}>
              {transaction.Type === 'DEBIT' ? '-' : '+'}£{Math.abs(transaction.Amount).toFixed(2)}
            </span>
            
            <input
              type="text"
              value={transaction.Category || ''}
              onChange={(e) => handleCategoryChange(transaction, e.target.value)}
              className="category-input"
              placeholder="Enter category"
            />
            
            <span 
              className="col-confidence"
              style={{ color: getConfidenceColor(transaction.categoryConfidence) }}
            >
              {getConfidenceText(transaction.categoryConfidence)}
              {transaction.isUserCorrected && ' ✓'}
            </span>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="no-transactions">
          No transactions match the current filters.
        </div>
      )}
    </div>
  );
}
