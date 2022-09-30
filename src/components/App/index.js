import { useState } from 'react';

import { ChartPanel } from '../ChartPanel';
import { FileSelector } from '../FileSelector';
import { MonthSelectorPanel } from '../MonthSelectorPanel';
import { SummaryPanel } from '../SummaryPanel';

import 'devextreme/dist/css/dx.light.css';

function App() {
	const [statementFile, setStatementFile] = useState([]);
	const [monthRange, setMonthRange] = useState([0, 0]);

	return (
		<>
			<header>
				<h1>Budgetinator</h1>
				<FileSelector setStatementFile={setStatementFile} />
			</header>
			<div className="row">
				<div className="column side">
					<MonthSelectorPanel setMonthRange={setMonthRange} />
				</div>
				<div className="column main">
					<SummaryPanel statementFile={statementFile} monthRange={monthRange} />
					<ChartPanel statementFile={statementFile} monthRange={monthRange} />
				</div>
			</div>
		</>
	);
}

export { App };
