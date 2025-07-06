import { useState } from 'react';

import Chart, {
  Series,
  Label,
  Legend,
  CommonSeriesSettings,
} from 'devextreme-react/chart';
import { Popup, Position } from 'devextreme-react/popup';

import { MonthlyStatement, MonthlyTransactionTotals } from '../../types';

interface MonthlyTotalsBarChartProps {
  monthlyStatements: (MonthlyStatement | undefined)[];
  monthlyTransactionTotals: MonthlyTransactionTotals[];
}

interface CategoryData {
  category: string;
  totalAmount: number;
  numberOfTransactions: number;
}

function MonthlyTotalsBarChart(props: MonthlyTotalsBarChartProps) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');
  const [categories, setCategories] = useState<CategoryData[]>([]);
  
  const currencyFormat = {
    style: 'currency' as const,
    currency: 'GBP',
    maximumFractionDigits: 0,
  };

  function pointClickHandler(point: any) {
    setCurrentMonth(point.target.data.month);

    const cats: CategoryData[] = [];
    const monthStatement = props.monthlyStatements[point.target.data.monthIndex];
    
    if (monthStatement) {
      for (const entry of monthStatement.entries) {
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
          const obj: CategoryData = {
            category: entry.Category,
            totalAmount: entry.Amount,
            numberOfTransactions: 1,
          };
          cats.push(obj);
        }
      }
    }
    
    cats.sort((a, b) => b.numberOfTransactions - a.numberOfTransactions);
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
        />
        <Series valueField="debits" name="Outgoing" />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />
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
              {category.numberOfTransactions} transactions in{' '}
              {category.category}. Total value:{' '}
              {new Intl.NumberFormat('en-GB', currencyFormat).format(
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