import { getDebits, getCredits } from '../../models/fileParser';
import { modelReducer } from '../../utils/utils';

function SummaryPanel({ fullStatement }) {
  return (
    <>
      <h2>Statement summary</h2>
      <p>Total debits: {modelReducer(getDebits, fullStatement)}</p>
      <p>Total credits: {modelReducer(getCredits, fullStatement)}</p>
    </>
  );
}

export { SummaryPanel };
