import { useState } from 'react';

import { ChartPanel } from '../ChartPanel';
import { FileSelector } from '../FileSelector';
import { SummaryPanel } from '../SummaryPanel';
import { CategoryManager } from '../CategoryManager';
import { LearningDashboard } from '../LearningDashboard';
import { Settings } from '../Settings';

import 'devextreme/dist/css/dx.light.css';
import '../CategoryManager/CategoryManager.css';
import '../CategoryAnalytics/CategoryAnalytics.css';
import '../LearningDashboard/LearningDashboard.css';
import '../Settings/Settings.css';

import { Transaction, MonthlyStatement, MonthlyTransactionTotals } from '../../types';

function App() {
	const [fullStatement, setFullStatement] = useState<Transaction[]>([]);
	const [monthlyStatements, setMonthlyStatements] = useState<(MonthlyStatement | undefined)[]>([]);
	const [monthlyTransactionTotals, setMonthlyTransactionTotals] = useState<MonthlyTransactionTotals[]>([]);
	const [showCategoryManager, setShowCategoryManager] = useState(false);
	const [showLearningDashboard, setShowLearningDashboard] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	// Handle individual transaction updates from CategoryManager
	const handleTransactionUpdate = (updatedTransaction: Transaction & { index: number }) => {
		const updatedStatement = fullStatement.map((transaction, index) =>
			index === updatedTransaction.index ? updatedTransaction : transaction
		);
		setFullStatement(updatedStatement);

		// Update monthly statements as well
		updateMonthlyData(updatedStatement);
	};

	// Handle bulk transaction updates from CategoryManager
	const handleBulkTransactionUpdate = (updates: Array<{ index: number; category: string }>) => {
		const updatedStatement = [...fullStatement];
		updates.forEach(update => {
			if (updatedStatement[update.index]) {
				updatedStatement[update.index] = {
					...updatedStatement[update.index],
					Category: update.category,
					isUserCorrected: true
				};
			}
		});
		setFullStatement(updatedStatement);
		updateMonthlyData(updatedStatement);
	};

	// Helper function to update monthly data when transactions change
	const updateMonthlyData = (transactions: Transaction[]) => {
		// Recalculate monthly statements
		const transactionsByMonth: (MonthlyStatement | undefined)[] = [];
		for (let i = 0; i < transactions.length; i++) {
			const date = new Date(transactions[i]['Date']);
			if (transactionsByMonth[date.getMonth()] === undefined) {
				transactionsByMonth[date.getMonth()] = {
					month: date.toLocaleString('default', { month: 'long' }),
					monthIndex: date.getMonth(),
					entries: [transactions[i]]
				};
			} else {
				transactionsByMonth[date.getMonth()]!.entries.push(transactions[i]);
			}
		}
		setMonthlyStatements(transactionsByMonth);

		// Recalculate monthly totals
		const totals: MonthlyTransactionTotals[] = [];
		transactionsByMonth.forEach((monthStatement) => {
			if (monthStatement) {
				const data: MonthlyTransactionTotals = {
					month: monthStatement.month,
					credits: monthStatement.entries.reduce((prev, entry) => {
						if (entry.Type === 'CREDIT') return prev;
						return prev + entry.Amount;
					}, 0),
					debits: Math.abs(
						monthStatement.entries.reduce((prev, entry) => {
							if (entry.Type === 'DEBIT') return prev;
							return prev + entry.Amount;
						}, 0)
					),
					monthIndex: monthStatement.monthIndex
				};
				totals.push(data);
			}
		});
		setMonthlyTransactionTotals(totals);
	};

	return (
		<>
			<header>
				<h1>Budgetinator</h1>
				<div className="header-controls">
					<FileSelector
						setFullStatement={setFullStatement}
						setMonthlyStatements={setMonthlyStatements}
						setMonthlyTransactionTotals={setMonthlyTransactionTotals}
					/>
					{fullStatement.length > 0 && (
						<>
							<button
								onClick={() => setShowCategoryManager(!showCategoryManager)}
								className="category-manager-toggle"
							>
								{showCategoryManager ? 'Hide' : 'Manage'} Categories
							</button>
							<button
								onClick={() => setShowLearningDashboard(!showLearningDashboard)}
								className="category-manager-toggle"
							>
								{showLearningDashboard ? 'Hide' : 'Show'} Learning
							</button>
						</>
					)}
					<button
						onClick={() => setShowSettings(!showSettings)}
						className="category-manager-toggle"
					>
						{showSettings ? 'Hide' : 'Show'} Settings
					</button>
				</div>
			</header>

			{showCategoryManager && fullStatement.length > 0 && (
				<CategoryManager
					transactions={fullStatement}
					onTransactionUpdate={handleTransactionUpdate}
					onBulkUpdate={handleBulkTransactionUpdate}
				/>
			)}

			{showLearningDashboard && (
				<LearningDashboard />
			)}

			{showSettings && (
				<Settings />
			)}

			<div className="row">
				<div className="column side">
					<SummaryPanel fullStatement={fullStatement} />
				</div>
				<div className="column main">
					<ChartPanel
						fullStatement={fullStatement}
						monthlyStatements={monthlyStatements}
						monthlyTransactionTotals={monthlyTransactionTotals}
					/>
				</div>
			</div>
		</>
	);
}

export { App };