import { useState, useEffect } from 'react';
import { StorageManager, UserPreferences } from '../../utils/storage';

export function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences>(StorageManager.loadUserPreferences());
  const [storageInfo, setStorageInfo] = useState(StorageManager.getStorageInfo());
  const [showImportExport, setShowImportExport] = useState(false);
  const [importData, setImportData] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Update storage info periodically
    const interval = setInterval(() => {
      setStorageInfo(StorageManager.getStorageInfo());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    StorageManager.saveUserPreferences(newPreferences);
    showMessage('success', 'Preferences saved successfully');
  };

  const handleExportData = () => {
    try {
      StorageManager.downloadBackup();
      showMessage('success', 'Data exported successfully');
    } catch (error) {
      showMessage('error', 'Failed to export data');
    }
  };

  const handleImportData = () => {
    if (!importData.trim()) {
      showMessage('error', 'Please paste your backup data');
      return;
    }

    try {
      const success = StorageManager.importData(importData);
      if (success) {
        setImportData('');
        setPreferences(StorageManager.loadUserPreferences());
        showMessage('success', 'Data imported successfully');
      } else {
        showMessage('error', 'Failed to import data - invalid format');
      }
    } catch (error) {
      showMessage('error', 'Failed to import data');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      const success = StorageManager.clearAllData();
      if (success) {
        setPreferences(StorageManager.loadUserPreferences());
        setStorageInfo(StorageManager.getStorageInfo());
        showMessage('success', 'All data cleared successfully');
      } else {
        showMessage('error', 'Failed to clear data');
      }
    }
  };

  const handleCleanupOldData = () => {
    const success = StorageManager.cleanupOldData(365);
    if (success) {
      setStorageInfo(StorageManager.getStorageInfo());
      showMessage('success', 'Old data cleaned up successfully');
    } else {
      showMessage('error', 'Failed to cleanup old data');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h3>⚙️ Settings</h3>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Categorization Preferences */}
      <div className="settings-section">
        <h4>Smart Categorization</h4>
        
        <div className="setting-item">
          <label className="setting-label">
            <input
              type="checkbox"
              checked={preferences.autoApplyHighConfidence}
              onChange={(e) => handlePreferenceChange('autoApplyHighConfidence', e.target.checked)}
            />
            Auto-apply high confidence categories
          </label>
          <p className="setting-description">
            Automatically apply category suggestions with high confidence scores
          </p>
        </div>

        <div className="setting-item">
          <label className="setting-label">
            Confidence threshold: {Math.round(preferences.confidenceThreshold * 100)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.05"
            value={preferences.confidenceThreshold}
            onChange={(e) => handlePreferenceChange('confidenceThreshold', parseFloat(e.target.value))}
            className="setting-slider"
          />
          <p className="setting-description">
            Minimum confidence required for auto-applying categories
          </p>
        </div>

        <div className="setting-item">
          <label className="setting-label">
            <input
              type="checkbox"
              checked={preferences.showCategoryConfidence}
              onChange={(e) => handlePreferenceChange('showCategoryConfidence', e.target.checked)}
            />
            Show confidence scores
          </label>
          <p className="setting-description">
            Display confidence percentages in the category manager
          </p>
        </div>

        <div className="setting-item">
          <label className="setting-label">
            <input
              type="checkbox"
              checked={preferences.enableLearning}
              onChange={(e) => handlePreferenceChange('enableLearning', e.target.checked)}
            />
            Enable learning from corrections
          </label>
          <p className="setting-description">
            Allow the system to learn from your category corrections
          </p>
        </div>
      </div>

      {/* Default Categories */}
      <div className="settings-section">
        <h4>Default Categories</h4>
        <div className="setting-item">
          <label className="setting-label">Common categories (comma-separated):</label>
          <textarea
            value={preferences.defaultCategories.join(', ')}
            onChange={(e) => {
              const categories = e.target.value.split(',').map(c => c.trim()).filter(c => c);
              handlePreferenceChange('defaultCategories', categories);
            }}
            className="setting-textarea"
            rows={3}
          />
          <p className="setting-description">
            These categories will be suggested when creating custom rules
          </p>
        </div>
      </div>

      {/* Storage Information */}
      <div className="settings-section">
        <h4>Storage Information</h4>
        <div className="storage-info">
          <div className="storage-stat">
            <span className="stat-label">Used:</span>
            <span className="stat-value">{formatBytes(storageInfo.used)}</span>
          </div>
          <div className="storage-stat">
            <span className="stat-label">Available:</span>
            <span className="stat-value">{formatBytes(storageInfo.available)}</span>
          </div>
          <div className="storage-stat">
            <span className="stat-label">Usage:</span>
            <span className="stat-value">{storageInfo.percentage.toFixed(1)}%</span>
          </div>
        </div>
        <div className="storage-bar">
          <div 
            className="storage-fill" 
            style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <h4>Data Management</h4>
        
        <div className="setting-actions">
          <button 
            onClick={() => setShowImportExport(!showImportExport)}
            className="setting-btn secondary"
          >
            {showImportExport ? 'Hide' : 'Show'} Import/Export
          </button>
          
          <button 
            onClick={handleCleanupOldData}
            className="setting-btn secondary"
          >
            Cleanup Old Data
          </button>
          
          <button 
            onClick={handleClearAllData}
            className="setting-btn danger"
          >
            Clear All Data
          </button>
        </div>

        {showImportExport && (
          <div className="import-export-section">
            <div className="export-section">
              <h5>Export Data</h5>
              <p>Download a backup of all your categorization rules and learning data.</p>
              <button onClick={handleExportData} className="setting-btn primary">
                Download Backup
              </button>
            </div>

            <div className="import-section">
              <h5>Import Data</h5>
              <p>Restore data from a previous backup file.</p>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your backup data here..."
                className="import-textarea"
                rows={6}
              />
              <button 
                onClick={handleImportData}
                className="setting-btn primary"
                disabled={!importData.trim()}
              >
                Import Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
