import { useState, useEffect } from 'react';
import { smartCategorizer } from '../../models/smartCategorizer';
import { CategoryRule, CategoryLearning } from '../../types';

export function LearningDashboard() {
  const [rules, setRules] = useState<CategoryRule[]>([]);
  const [learningData, setLearningData] = useState<CategoryLearning[]>([]);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    category: '',
    patterns: '',
    priority: 5,
    confidence: 0.8
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRules(smartCategorizer.getRules());
    setLearningData(smartCategorizer.getLearningData());
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.category || !newRule.patterns) {
      alert('Please fill in all required fields');
      return;
    }

    smartCategorizer.addCustomRule({
      name: newRule.name,
      category: newRule.category,
      patterns: newRule.patterns.split(',').map(p => p.trim()),
      priority: newRule.priority,
      confidence: newRule.confidence
    });

    setNewRule({
      name: '',
      category: '',
      patterns: '',
      priority: 5,
      confidence: 0.8
    });
    setShowAddRule(false);
    loadData();
  };

  const getTopLearnings = () => {
    return learningData
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  };

  const getUserDefinedRules = () => {
    return rules.filter(rule => rule.isUserDefined);
  };

  const getSystemRules = () => {
    return rules.filter(rule => !rule.isUserDefined);
  };

  const getLearningStats = () => {
    const totalLearnings = learningData.length;
    const totalCorrections = learningData.reduce((sum, item) => sum + item.frequency, 0);
    const avgCorrections = totalLearnings > 0 ? totalCorrections / totalLearnings : 0;
    
    return {
      totalLearnings,
      totalCorrections,
      avgCorrections: Math.round(avgCorrections * 10) / 10
    };
  };

  const stats = getLearningStats();
  const topLearnings = getTopLearnings();
  const userRules = getUserDefinedRules();
  const systemRules = getSystemRules();

  return (
    <div className="learning-dashboard">
      <div className="dashboard-header">
        <h3>🧠 Smart Categorization Learning</h3>
        <button 
          onClick={() => setShowAddRule(!showAddRule)}
          className="add-rule-btn"
        >
          {showAddRule ? 'Cancel' : 'Add Custom Rule'}
        </button>
      </div>

      {/* Learning Statistics */}
      <div className="learning-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalLearnings}</div>
          <div className="stat-label">Merchants Learned</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCorrections}</div>
          <div className="stat-label">Total Corrections</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.avgCorrections}</div>
          <div className="stat-label">Avg Corrections per Merchant</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userRules.length}</div>
          <div className="stat-label">Custom Rules</div>
        </div>
      </div>

      {/* Add Custom Rule Form */}
      {showAddRule && (
        <div className="add-rule-form">
          <h4>Add Custom Categorization Rule</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Rule Name *</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                placeholder="e.g., Local Coffee Shops"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                value={newRule.category}
                onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                placeholder="e.g., Dining Out"
              />
            </div>
            <div className="form-group full-width">
              <label>Patterns * (comma-separated)</label>
              <input
                type="text"
                value={newRule.patterns}
                onChange={(e) => setNewRule({...newRule, patterns: e.target.value})}
                placeholder="e.g., starbucks, costa, cafe nero"
              />
            </div>
            <div className="form-group">
              <label>Priority (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={newRule.priority}
                onChange={(e) => setNewRule({...newRule, priority: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Confidence (0.1-1.0)</label>
              <input
                type="number"
                min="0.1"
                max="1.0"
                step="0.1"
                value={newRule.confidence}
                onChange={(e) => setNewRule({...newRule, confidence: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="form-actions">
            <button onClick={handleAddRule} className="save-rule-btn">
              Save Rule
            </button>
            <button onClick={() => setShowAddRule(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Top Learning Data */}
      <div className="learning-section">
        <h4>🎯 Most Frequently Corrected Merchants</h4>
        {topLearnings.length > 0 ? (
          <div className="learning-list">
            {topLearnings.map((learning, index) => (
              <div key={index} className="learning-item">
                <div className="merchant-info">
                  <span className="merchant-name">{learning.merchantName}</span>
                  <span className="category-learned">→ {learning.category}</span>
                </div>
                <div className="learning-meta">
                  <span className="frequency">{learning.frequency} corrections</span>
                  <span className="last-used">
                    Last: {new Date(learning.lastUsed).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No learning data yet. Start correcting categories to see improvements!</p>
        )}
      </div>

      {/* Custom Rules */}
      <div className="rules-section">
        <h4>⚙️ Your Custom Rules ({userRules.length})</h4>
        {userRules.length > 0 ? (
          <div className="rules-list">
            {userRules.map((rule) => (
              <div key={rule.id} className="rule-item">
                <div className="rule-header">
                  <span className="rule-name">{rule.name}</span>
                  <span className="rule-category">{rule.category}</span>
                </div>
                <div className="rule-details">
                  <span className="rule-patterns">
                    Patterns: {rule.patterns.join(', ')}
                  </span>
                  <div className="rule-meta">
                    <span>Priority: {rule.priority}</span>
                    <span>Confidence: {Math.round(rule.confidence * 100)}%</span>
                    <span>Used: {rule.usageCount} times</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No custom rules yet. Add rules to improve categorization accuracy!</p>
        )}
      </div>

      {/* System Rules Summary */}
      <div className="system-rules-section">
        <h4>🔧 System Rules ({systemRules.length})</h4>
        <div className="system-rules-summary">
          <p>The system comes with {systemRules.length} built-in categorization rules covering:</p>
          <div className="rule-categories">
            {Array.from(new Set(systemRules.map(r => r.category))).map(category => (
              <span key={category} className="rule-category-tag">{category}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
