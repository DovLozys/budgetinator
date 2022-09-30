import { getDebits, getCredits } from '../../models/fileParser';
import { getMonthNameFromIndex, modelReducer } from '../../utils/utils';

function SummaryPanel({ statementFile, monthRange }) {
	const isSelectionMultiple = monthRange[0] < monthRange[1];

	return (
		<div>
			<h1>
				Summary for {getMonthNameFromIndex(monthRange[0])}
				{isSelectionMultiple && " to " + getMonthNameFromIndex(monthRange[1])}
			</h1>
			<p>Total debits: {modelReducer(getDebits, statementFile)}</p>
			<p>Total credits: {modelReducer(getCredits, statementFile)}</p>
		</div>
	)
}

export { SummaryPanel };
