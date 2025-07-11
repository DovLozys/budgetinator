import { useState } from 'react';
import Chart, {
  Series,
  Label,
  Legend,
  CommonSeriesSettings,
  ArgumentAxis,
  ValueAxis,
  Title
} from 'devextreme-react/chart';
import PieChart, {
  Series as PieSeries,
  Label as PieLabel,
  Connector,
  Export
} from 'devextreme-react/pie-chart';

import { Transaction, CategoryStats } from '../../types';

interface CategoryAnalyticsProps {
  transactions: Transaction[];
}

interface CategorySpending {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

interface MonthlyCategory {
  month: string;
  category: string;
  amount: number;
}

export function CategoryAnalytics({ transactions }: CategoryAnalyticsProps) {
  const [selectedView, setSelectedView] = useState<'pie' | 'bar' | 'trend'>('pie');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calculate category statistics
  const calculateCategoryStats = (): CategorySpending[] => {
    const categoryMap = new Map<string, { amount: number; count: number }>();
    let totalSpending = 0;

    transactions
      .filter(t => t.Type === 'DEBIT' && t.Category)
      .forEach(transaction => {
        const category = transaction.Category;
        const amount = Math.abs(transaction.Amount);
        
        if (categoryMap.has(category)) {
          const existing = categoryMap.get(category)!;
          categoryMap.set(category, {
            amount: existing.amount + amount,
            count: existing.count + 1
          });
        } else {
          categoryMap.set(category, { amount, count: 1 });
        }
        
        totalSpending += amount;
      });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: (data.amount / totalSpending) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Calculate monthly category trends
  const calculateMonthlyTrends = (): MonthlyCategory[] => {
    const monthlyData: MonthlyCategory[] = [];
    const monthMap = new Map<string, Map<string, number>>();

    transactions
      .filter(t => t.Type === 'DEBIT' && t.Category)
      .forEach(transaction => {
        const date = new Date(transaction.Date);
        const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        const category = transaction.Category;
        const amount = Math.abs(transaction.Amount);

        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, new Map());
        }

        const categoryMap = monthMap.get(monthKey)!;
        categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
      });

    // Convert to array format for charts
    monthMap.forEach((categories, month) => {
      categories.forEach((amount, category) => {
        monthlyData.push({ month, category, amount });
      });
    });

    return monthlyData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  // Get top spending insights
  const getSpendingInsights = (): string[] => {
    const categoryStats = calculateCategoryStats();
    const insights: string[] = [];

    if (categoryStats.length > 0) {
      const topCategory = categoryStats[0];
      insights.push(`Your highest spending category is ${topCategory.category} (£${topCategory.amount.toFixed(2)})`);
      
      if (categoryStats.length > 1) {
        const secondCategory = categoryStats[1];
        const difference = topCategory.amount - secondCategory.amount;
        insights.push(`You spend £${difference.toFixed(2)} more on ${topCategory.category} than ${secondCategory.category}`);
      }

      const smallCategories = categoryStats.filter(c => c.percentage < 5);
      if (smallCategories.length > 0) {
        const totalSmall = smallCategories.reduce((sum, c) => sum + c.amount, 0);
        insights.push(`You have ${smallCategories.length} categories with small spending totaling £${totalSmall.toFixed(2)}`);
      }
    }

    return insights;
  };

  const categoryStats = calculateCategoryStats();
  const monthlyTrends = calculateMonthlyTrends();
  const insights = getSpendingInsights();
  const uniqueCategories = Array.from(new Set(transactions.map(t => t.Category).filter(Boolean)));

  // Filter data based on selected category
  const filteredMonthlyTrends = selectedCategory === 'all' 
    ? monthlyTrends 
    : monthlyTrends.filter(item => item.category === selectedCategory);

  const currencyFormat = {
    style: 'currency' as const,
    currency: 'GBP',
    maximumFractionDigits: 0,
  };

  return (
    <div className="category-analytics">
      <div className="analytics-header">
        <h3>Category Analytics</h3>
        
        <div className="analytics-controls">
          <select 
            value={selectedView} 
            onChange={(e) => setSelectedView(e.target.value as 'pie' | 'bar' | 'trend')}
            className="view-selector"
          >
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="trend">Monthly Trends</option>
          </select>

          {selectedView === 'trend' && (
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-selector"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Insights Panel */}
      <div className="insights-panel">
        <h4>💡 Spending Insights</h4>
        <ul>
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>

      {/* Chart Display */}
      <div className="chart-container">
        {selectedView === 'pie' && (
          <PieChart
            id="category-pie-chart"
            dataSource={categoryStats}
            title="Spending by Category"
            palette="Bright"
          >
            <PieSeries
              argumentField="category"
              valueField="amount"
            >
              <PieLabel
                visible={true}
                format={currencyFormat}
                connector={{ visible: true }}
              />
            </PieSeries>
            <Export enabled={true} />
          </PieChart>
        )}

        {selectedView === 'bar' && (
          <Chart
            id="category-bar-chart"
            dataSource={categoryStats}
            title="Spending by Category"
            rotated={true}
          >
            <CommonSeriesSettings
              argumentField="category"
              valueField="amount"
              type="bar"
            >
              <Label visible={true} format={currencyFormat} />
            </CommonSeriesSettings>
            <Series />
            <ArgumentAxis>
              <Title text="Categories" />
            </ArgumentAxis>
            <ValueAxis>
              <Title text="Amount Spent (£)" />
            </ValueAxis>
          </Chart>
        )}

        {selectedView === 'trend' && (
          <Chart
            id="category-trend-chart"
            dataSource={filteredMonthlyTrends}
            title={selectedCategory === 'all' ? 'Monthly Spending Trends by Category' : `Monthly Trend: ${selectedCategory}`}
          >
            <CommonSeriesSettings
              argumentField="month"
              valueField="amount"
              type="line"
            />
            {selectedCategory === 'all' ? (
              uniqueCategories.map(category => (
                <Series
                  key={category}
                  valueField="amount"
                  name={category}
                  filter={['category', '=', category]}
                />
              ))
            ) : (
              <Series valueField="amount" name={selectedCategory} />
            )}
            <Legend
              verticalAlignment="bottom"
              horizontalAlignment="center"
            />
            <ArgumentAxis>
              <Title text="Month" />
            </ArgumentAxis>
            <ValueAxis>
              <Title text="Amount Spent (£)" />
            </ValueAxis>
          </Chart>
        )}
      </div>

      {/* Category Summary Table */}
      <div className="category-summary">
        <h4>Category Summary</h4>
        <div className="summary-table">
          <div className="summary-header">
            <span>Category</span>
            <span>Amount</span>
            <span>Transactions</span>
            <span>% of Total</span>
            <span>Avg per Transaction</span>
          </div>
          {categoryStats.slice(0, 10).map(stat => (
            <div key={stat.category} className="summary-row">
              <span className="category-name">{stat.category}</span>
              <span className="amount">£{stat.amount.toFixed(2)}</span>
              <span className="count">{stat.count}</span>
              <span className="percentage">{stat.percentage.toFixed(1)}%</span>
              <span className="average">£{(stat.amount / stat.count).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
