import { MonthlySpendingBarChart } from '../MonthlySpendingBarChart';
import { Transaction, MonthlyStatement, MonthlyTransactionTotals } from '../../types';

interface ChartPanelProps {
	fullStatement: Transaction[];
	monthlyStatements: (MonthlyStatement | undefined)[];
	monthlySpendingTotals: MonthlyTransactionTotals[];
}

function ChartPanel(props: ChartPanelProps) {
	if (props.fullStatement.length === 0) {
		return <><h2>Charts</h2><p>Select a statement file up top please.</p></>;
	}

	return (
		<>
			<h2>
				Charts
			</h2>
			<MonthlySpendingBarChart
				monthlyStatements={props.monthlyStatements}
				monthlySpendingTotals={props.monthlySpendingTotals}
			/>
		</>
	);
}

export { ChartPanel };