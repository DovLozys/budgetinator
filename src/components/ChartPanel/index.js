import Chart, {
	Series,
	Label,
	Connector,
	Legend
} from 'devextreme-react/chart';

function ChartPanel(props) {
	return (
		<div>
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
		</div>
	)
}

export { ChartPanel };
