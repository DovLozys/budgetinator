import { getDebits, getCredits } from '../../models/fileParser';
import { modelReducer } from '../../utils/utils';
import { Transaction } from '../../types';

interface SummaryPanelProps {
	fullStatement: Transaction[];
}

function SummaryPanel({ fullStatement }: SummaryPanelProps) {
	return (
		<>
			<h2>Statement summary</h2>
			<p>Total debits: {modelReducer(getDebits, fullStatement)}</p>
			<p>Total credits: {modelReducer(getCredits, fullStatement)}</p>
		</>
	);
}

export { SummaryPanel };