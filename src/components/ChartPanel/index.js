import { MonthlyBarChart } from '../MonthlyBarChart';

function ChartPanel(props) {
	if (props.statementFile.length === 0) {
		return <><h2>Charts</h2><p>Select a statement file up top please.</p></>;
	}

	return (
		<>
			<h2>
				Charts
			</h2>
			<MonthlyBarChart
				monthlyStatements={props.monthlyStatements}
				monthlyTotals={props.monthlyTotals}
			/>
		</>
	);
}

export { ChartPanel };
