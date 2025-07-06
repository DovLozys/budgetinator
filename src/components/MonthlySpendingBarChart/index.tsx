import { useState } from 'react';

import Chart, {
	Series,
	Label,
	Connector,
	Legend
} from 'devextreme-react/chart';
import { Popup, Position } from 'devextreme-react/popup';

import { MonthlyStatement, MonthlyTransactionTotals } from '../../types';

interface MonthlySpendingBarChartProps {
	monthlyStatements: (MonthlyStatement | undefined)[];
	monthlySpendingTotals: MonthlyTransactionTotals[];
}

function MonthlySpendingBarChart(props: MonthlySpendingBarChartProps) {
	const [popupVisible, setPopupVisible] = useState(false);
	const [currentMonth, setCurrentMonth] = useState('');

	function pointClickHandler(info: any) {
		setPopupVisible(true);
		const data = info.target.data as MonthlyTransactionTotals;
		const monthStatement = props.monthlyStatements[data.monthIndex];
		if (monthStatement) {
			setCurrentMonth(monthStatement.month);
		}
	}

	function hidePopup() {
		setPopupVisible(false);
		setCurrentMonth('');
	}

	return (
		<>
			<Chart
				title="Monthly debits"
				dataSource={props.monthlySpendingTotals}
				onPointClick={pointClickHandler}
				id="chart"
			>
				<Series valueField="debits" argumentField="month" type="bar">
					<Label visible={true}>
						<Connector visible={true} />
					</Label>
				</Series>
				<Legend visible={false} />
			</Chart>
			<Popup
				visible={popupVisible}
				onHiding={hidePopup}
				dragEnabled={false}
				hideOnOutsideClick={true}
				title={`Stats for ${currentMonth}`}
			>
				<Position at="center" my="center" />
				<p>Month: <span>{currentMonth}</span></p>
			</Popup>
		</>
	);
}

export { MonthlySpendingBarChart };