import { useState } from 'react';

import Chart, {
  Series,
  Label,
  Legend,
  CommonSeriesSettings,
} from 'devextreme-react/chart';
import { Popup, Position } from 'devextreme-react/popup';

function MonthlyTotalsBarChart(props) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');
  const [categories, setCategories] = useState([]);

  function pointClickHandler(point) {
    setCurrentMonth(point.target.data.month);
    // get transactions for the month that what was clicked on
    // construct array of objects to store different categories for that month (`categories` state)
    // if arr.some((row) => row.check.stuff(category?))
    // true: add .Amount to a total for that category, noOfTx++
    // false: push an object for that category
    // obj structure could be:
    // {category: 'Electronics', totalAmount: 10, numberOfTransactions: 1}
    for (const entry of props.monthlyStatements[point.target.data.monthIndex]
      .entries) {
      const catsCopy = [...categories];
      const i = catsCopy.findIndex((cat) => cat.category === entry.Category);

      if (i > -1) {
        console.log('cat found');
      } else {
        console.log('cat not found');
      }

      setCategories(catsCopy);
    }

    console.log(
      'Number of transactions for current month: ',
      props.monthlyStatements[point.target.data.monthIndex].entries.length
    );

    console.log(
      'First category: ',
      props.monthlyStatements[point.target.data.monthIndex].entries[0].Category
    );

    setPopupVisible(true);
  }

  function hidePopup() {
    setPopupVisible(false);
    setCategories([]);
    setCurrentMonth('');
  }

  const currencyFormat = {
    style: 'currency',
    currency: 'GBP',
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
          hoverMode="allArgumentPoints"
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

export { MonthlyTotalsBarChart };
