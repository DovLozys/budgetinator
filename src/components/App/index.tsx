import { useState } from 'react';

import { ChartPanel } from '../ChartPanel';
import { FileSelector } from '../FileSelector';
import { SummaryPanel } from '../SummaryPanel';

import 'devextreme/dist/css/dx.light.css';

import { Transaction, MonthlyStatement, MonthlyTransactionTotals } from '../../types';

function App() {
	const [fullStatement, setFullStatement] = useState<Transaction[]>([]);
	const [monthlyStatements, setMonthlyStatements] = useState<(MonthlyStatement | undefined)[]>([]);
	const [monthlyTransactionTotals, setMonthlyTransactionTotals] = useState<MonthlyTransactionTotals[]>([]);

	return (
		<>
			<header>
				<h1>Budgetinator</h1>
				<FileSelector
					setFullStatement={setFullStatement}
					setMonthlyStatements={setMonthlyStatements}
					setMonthlyTransactionTotals={setMonthlyTransactionTotals}
				/>
			</header>
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