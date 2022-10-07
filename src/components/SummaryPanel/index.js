import { getDebits, getCredits } from '../../models/fileParser';
import { modelReducer } from '../../utils/utils';

function SummaryPanel({ statementFile }) {
	return (
		<>
			<h2>Statement summary</h2>
			<p>Total debits: {modelReducer(getDebits, statementFile)}</p>
			<p>Total credits: {modelReducer(getCredits, statementFile)}</p>
		</>
	)
}

export { SummaryPanel };
