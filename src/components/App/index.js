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
import { getMonthNameFromIndex, modelReducer } from '../../utils/utils';

import 'devextreme/dist/css/dx.light.css';

function App() {
	const [statementFile, setStatementFile] = useState([]);
	const [monthRange, setMonthRange] = useState([0, 0]);

	const isSelectionMultiple = monthRange[0] < monthRange[1];
	const dataSource = [
		{
			type: 'credit',
			val: modelReducer(getCredits, statementFile),
		},
		{
			type: 'debit',
			val: modelReducer(getDebits, statementFile),
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
							Summary for {getMonthNameFromIndex(monthRange[0])}
							{isSelectionMultiple && " to " + getMonthNameFromIndex(monthRange[1])}
						</h1>
						<p>Total debits: {modelReducer(getDebits, statementFile)}</p>
						<p>Total credits: {modelReducer(getCredits, statementFile)}</p>
					</div>
					<div>
						<h2>
							Charts for {getMonthNameFromIndex(monthRange[0])}
							{isSelectionMultiple && " to " + getMonthNameFromIndex(monthRange[1])}
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
