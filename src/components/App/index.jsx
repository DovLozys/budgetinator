import { useState } from 'react';

import { ChartPanel } from '../ChartPanel';
import { FileSelector } from '../FileSelector';
import { SummaryPanel } from '../SummaryPanel';

import 'devextreme/dist/css/dx.light.css';

function App() {
  const [fullStatement, setFullStatement] = useState([]);
  const [monthlyStatements, setMonthlyStatements] = useState([]);
  const [monthlyTransactionTotals, setMonthlyTransactionTotals] = useState([]);

  return (
    <>
      <header>
        <h1>Budgetinator</h1>
        <FileSelector
          setFullStatement={setFullStatement}
          setMonthlyStatements={setMonthlyStatements}
          setMonthlyTransactionTotals={setMonthlyTransactionTotals}
        />
      </header>
      <div className="row">
        <div className="column side">
          <SummaryPanel fullStatement={fullStatement} />
        </div>
        <div className="column main">
          <ChartPanel
            fullStatement={fullStatement}
            monthlyStatements={monthlyStatements}
            monthlyTransactionTotals={monthlyTransactionTotals}
          />
        </div>
      </div>
    </>
  );
}

export { App };
