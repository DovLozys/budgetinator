import PieChart, {
	Legend,
	Series,
	Tooltip,
	Label,
	Connector
} from 'devextreme-react/pie-chart';

import { getDebits, getCredits } from '../../models/fileParser';
import { getMonthNameFromIndex, modelReducer } from '../../utils/utils';

function ChartPanel({ statementFile, monthRange }) {
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
	)
}

export { ChartPanel };
