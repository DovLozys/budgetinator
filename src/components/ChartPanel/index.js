import Chart, {
	Series,
	Label,
	Connector,
	Legend
} from 'devextreme-react/chart';

function ChartPanel(props) {
	if (props.statementFile.length === 0) {
		return <><h2>Charts</h2><p>Select a statement file up top please.</p></>
	}

	return (
		<>
			<h2>
				Charts
			</h2>
			<Chart
				title="Monthly debits"
				dataSource={props.monthlyTotals}
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
		</>
	)
}

export { ChartPanel };
