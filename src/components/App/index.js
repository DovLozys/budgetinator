import { useState } from 'react';
import PieChart, {
	Legend,
	Series,
	Tooltip,
	Label,
	Connector
} from 'devextreme-react/pie-chart';

import { FileSelector } from '../FileSelector';
import { MonthSelectorPanel } from '../MonthSelectorPanel';

import { getDebits, getCredits } from '../../models/fileParser';

import 'devextreme/dist/css/dx.light.css';

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

	// sums up the array returned by the model, rounds to two decimal places
	function reducer(model) {
		return Math.abs(Math.round(model(statementFile).reduce((partialSum, amount) => partialSum + amount, 0) * 100) / 100);
	}

	const isSelectionMultiple = monthRange[0] < monthRange[1];
	const dataSource = [
		{
			type: 'credit',
			val: reducer(getCredits),
		},
		{
			type: 'debit',
			val: reducer(getDebits),
		},
	];

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
					<div>
						<h1>
							Summary for {getMonthName(monthRange[0])}
							{isSelectionMultiple && " to " + getMonthName(monthRange[1])}
						</h1>
						<p>Total debits: {reducer(getDebits)}</p>
						<p>Total credits: {reducer(getCredits)}</p>
					</div>
					<div>
						<h2>
							Charts for {getMonthName(monthRange[0])}
							{isSelectionMultiple && " to " + getMonthName(monthRange[1])}
						</h2>
						<PieChart
							id="pie"
							type="pie"
							title="CREDIT/DEBIT ratio"
							palette="Soft Pastel"
							dataSource={dataSource}
						>
							<Series argumentField="type">
								<Label visible={true}>
									<Connector visible={true} />
								</Label>
							</Series>
							<Legend
								margin={0}
								verticalAlignment="top"
								horizontalAlignment="right"
							/>
							<Tooltip enabled={true} />
						</PieChart>
					</div>
				</div>
			</div>
		</>
	);
}

export { App };
