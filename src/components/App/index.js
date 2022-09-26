import { useState } from 'react';

import { FileSelector } from '../FileSelector';
import { MonthSelectorBox } from '../MonthSelectorBox';

function App() {
	const [statementFile, setStatementFile] = useState([]);
	const [monthRange, setMonthRange] = useState([0, 0]);

	function getMonthName(index) {
		const date = new Date();
		date.setMonth(index);

		return date.toLocaleString([], {
			month: 'long',
		});
	}

	return (
		<>
			<header>
				<h1>Budgetinator</h1>
				<FileSelector setStatementFile={setStatementFile} />
			</header>
			<div className="row">
				<div className="column side">
					<MonthSelectorBox setMonthRange={setMonthRange} />
				</div>
				<div className="column main">
					<div>
						<h1>Summary for {getMonthName(monthRange[0])} to {getMonthName(monthRange[1])}</h1>
					</div>
					<div>Charts for {getMonthName(monthRange[0])} to {getMonthName(monthRange[1])}</div>
				</div>
			</div>
		</>
	);
}

export { App };
