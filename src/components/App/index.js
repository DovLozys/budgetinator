import { useState } from 'react';

import { ChartPanel } from '../ChartPanel';
import { FileSelector } from '../FileSelector';
import { SummaryPanel } from '../SummaryPanel';

import 'devextreme/dist/css/dx.light.css';

function App() {
	const [statementFile, setStatementFile] = useState([]);
	const [monthlyStatements, setMonthlyStatements] = useState([]);
	const [monthlyTotals, setMonthlyTotals] = useState([]);

	return (
		<>
			<header>
				<h1>Budgetinator</h1>
				<FileSelector
					setStatementFile={setStatementFile}
					setMonthlyStatements={setMonthlyStatements}
					setMonthlyTotals={setMonthlyTotals}
				/>
			</header>
			<div className="row">
				<div className="column side">
					<SummaryPanel statementFile={statementFile} />
				</div>
				<div className="column main">
					<ChartPanel
						statementFile={statementFile}
						monthlyStatements={monthlyStatements}
						monthlyTotals={monthlyTotals}
					/>
				</div>
			</div>
		</>
	);
}

export { App };
