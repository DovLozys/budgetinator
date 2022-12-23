import { useState } from 'react';

import Chart, {
  Series,
  Label,
  Legend,
  CommonSeriesSettings,
} from 'devextreme-react/chart';
import { Popup, Position } from 'devextreme-react/popup';

function MonthlySpendingBarChart(props) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');

  function pointClickHandler(info) {
    setPopupVisible(true);
    setCurrentMonth(info.target.data.month);
  }

  function hidePopup() {
    setPopupVisible(false);
    setCurrentMonth('');
  }

  const currencyFormat = {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  };

  return (
    <>
      <Chart
        id="chart"
        title="Monthly cash flow"
        dataSource={props.monthlyTransactionTotals}
        onPointClick={pointClickHandler}
      >
        <CommonSeriesSettings
          argumentField="month"
          type="bar"
          hoverMoode="allArgumentPoints"
          selectionMode="allArgumentPoints"
        >
          <Label visible={true} format={currencyFormat} />
        </CommonSeriesSettings>

        <Series
          argumentField="month"
          valueField="credits"
          name="Incoming"
        ></Series>
        <Series valueField="debits" name="Outgoing"></Series>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        ></Legend>
      </Chart>
      <Popup
        visible={popupVisible}
        onHiding={hidePopup}
        dragEnabled={false}
        hideOnOutsideClick={true}
        title={`Stats for ${currentMonth}`}
      >
        <Position at="center" my="center" />
        <p>
          Month: <span>{currentMonth}</span>
        </p>
      </Popup>
    </>
  );
}

export { MonthlySpendingBarChart };
