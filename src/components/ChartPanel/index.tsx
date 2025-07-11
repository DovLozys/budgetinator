import { MonthlyTotalsBarChart } from '../MonthlyTotalsBarChart';
import { CategoryAnalytics } from '../CategoryAnalytics';
import { Transaction, MonthlyStatement, MonthlyTransactionTotals } from '../../types';

interface ChartPanelProps {
	fullStatement: Transaction[];
	monthlyStatements: (MonthlyStatement | undefined)[];
	monthlyTransactionTotals: MonthlyTransactionTotals[];
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
			<MonthlyTotalsBarChart
				monthlyStatements={props.monthlyStatements}
				monthlyTransactionTotals={props.monthlyTransactionTotals}
			/>
			<CategoryAnalytics
				transactions={props.fullStatement}
			/>
		</>
	);
}

export { ChartPanel };