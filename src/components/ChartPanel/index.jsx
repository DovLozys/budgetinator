import { MonthlyTotalsBarChart } from '../MonthlyTotalsBarChart';

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
      <MonthlyTotalsBarChart
        monthlyStatements={props.monthlyStatements}
        monthlyTransactionTotals={props.monthlyTransactionTotals}
      />
    </>
  );
}

export { ChartPanel };
