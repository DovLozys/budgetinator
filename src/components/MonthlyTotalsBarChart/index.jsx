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
  const currencyFormat = {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  };

  function pointClickHandler(point) {
    setCurrentMonth(point.target.data.month);

    const cats = [];
    for (const entry of props.monthlyStatements[point.target.data.monthIndex]
      .entries) {
      const i = cats.findIndex((cat) => {
        return cat.category === entry.Category;
      });

      if (i > -1) {
        cats[i] = {
          ...cats[i],
          totalAmount: cats[i].totalAmount + entry.Amount,
          numberOfTransactions: cats[i].numberOfTransactions + 1,
        };
      } else {
        const obj = {
          category: entry.Category,
          totalAmount: entry.Amount,
          numberOfTransactions: 1,
        };
        cats.push(obj);
      }
    }
    setCategories(cats);

    setPopupVisible(true);
  }

  function hidePopup() {
    setPopupVisible(false);
    setCategories([]);
    setCurrentMonth('');
  }

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
        <h1>
          Month: <span>{currentMonth}</span>
        </h1>
        <h3>Number of unique categories: {categories.length}</h3>
        {categories.map((category) => {
          return (
            <p key={crypto.randomUUID()}>
              {category.category}: {category.numberOfTransactions} transactions,
              at the cost of{' '}
              {new Intl.NumberFormat(currencyFormat).format(
                category.totalAmount
              )}
            </p>
          );
        })}
      </Popup>
    </>
  );
}

export { MonthlyTotalsBarChart };
