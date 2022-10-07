import PieChart, {
	Legend,
	Series,
	Tooltip,
	Label,
	Connector
} from 'devextreme-react/pie-chart';
import Chart, {
	// Label,
	// Legend,
	// Series
} from 'devextreme-react/chart';

import { getDebits, getCredits } from '../../models/fileParser';
import { modelReducer } from '../../utils/utils';

function ChartPanel({ statementFile, monthlyStatements, monthlyTotals }) {
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
		<div>
			<h2>
				Charts
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
			<br /><br />
			<Chart
				title="Monthly debits"
				dataSource={monthlyTotals}
				id="chart"
			>
				<Series type="bar">
					<Label visible={true}>
						<Connector visible={true} />
					</Label>
				</Series>
				<Legend
					visible={false}
				/>
			</Chart>
		</div>
	)
}

export { ChartPanel };
