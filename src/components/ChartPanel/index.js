import { MonthlySpendingBarChart } from '../MonthlySpendingBarChart';

function ChartPanel(props) {
  if (props.fullStatement.length === 0) {
    return (
      <>
        <h2>Charts</h2>
        <p>Select a statement file up top please.</p>
      </>
    );
  }

  return (
    <>
      <h2>Charts</h2>
      <MonthlySpendingBarChart
        monthlyStatements={props.monthlyStatements}
        monthlySpendingTotals={props.monthlySpendingTotals}
      />
    </>
  );
}

export { ChartPanel };
