import { useState } from 'react';

import Chart, {
	Series,
	Label,
	Connector,
	Legend
} from 'devextreme-react/chart';
import { Popup, Position } from 'devextreme-react/popup';

function ChartPanel(props) {
	const [popupVisible, setPopupVisible] = useState(false);
	const [currentMonth, setCurrentMonth] = useState();

	if (props.statementFile.length === 0) {
		return <><h2>Charts</h2><p>Select a statement file up top please.</p></>
	}

	function pointClickHandler(info) {
		setPopupVisible(true);
		setCurrentMonth(props.monthlyStatements[info.target.data.monthIndex].month);
	}

	function hidePopup() {
		setPopupVisible(false);
		setCurrentMonth();
	}

	return (
		<>
			<h2>
				Charts
			</h2>
			<Chart
				title="Monthly debits"
				dataSource={props.monthlyTotals}
				onPointClick={pointClickHandler}
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
			<Popup
				visible={popupVisible}
				onHiding={hidePopup}
				dragEnabled={false}
				hideOnOutsideClick={true}
				title={`Stats for ${currentMonth}`}
				width={300}
				height={280}
			>
				<Position
					at="center"
					my="center"
				/>
				<p>
					Month:
					<span> {currentMonth}</span>
				</p>
			</Popup>
		</>
	)
}

export { ChartPanel };
