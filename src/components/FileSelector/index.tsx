import { read, utils } from 'xlsx';
import { Transaction, MonthlyStatement, MonthlyTransactionTotals } from '../../types';
import { smartCategorizer } from '../../models/smartCategorizer';

interface FileSelectorProps {
	setFullStatement: (statement: Transaction[]) => void;
	setMonthlyStatements: (statements: (MonthlyStatement | undefined)[]) => void;
	setMonthlyTransactionTotals: (totals: MonthlyTransactionTotals[]) => void;
}

function FileSelector(props: FileSelectorProps) {
	function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const fileContents = event.target!.result;
				const workbook = read(fileContents, { type: 'array' });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const arrayOfRows = utils.sheet_to_json(worksheet) as Transaction[];

				// Apply smart categorization
				const categorizedRows = smartCategorizer.categorizeTransactions(arrayOfRows);

				// populate fullStatement
				props.setFullStatement(categorizedRows);

				// populate monthlyStatements
				const transactionsByMonth: (MonthlyStatement | undefined)[] = [];
				for (let i = 0; i < categorizedRows.length; i++) {
					const date = new Date(categorizedRows[i]['Date']);
					if (transactionsByMonth[date.getMonth()] === undefined) {
						transactionsByMonth[date.getMonth()] = {
							month: date.toLocaleString('default', { month: 'long' }),
							monthIndex: date.getMonth(),
							entries: [categorizedRows[i]]
						};
					} else {
						transactionsByMonth[date.getMonth()]!.entries.push(categorizedRows[i]);
					}
				}
				props.setMonthlyStatements(transactionsByMonth);

				// populate monthlyTransactionTotals from transactionsByMonth
				const totals: MonthlyTransactionTotals[] = [];
				transactionsByMonth.forEach((monthStatement) => {
					if (monthStatement) {
						const data: MonthlyTransactionTotals = {
							month: monthStatement.month,
							credits: monthStatement.entries.reduce((prev, entry) => {
								if (entry.Type === 'CREDIT') return prev;
								return prev + entry.Amount;
							}, 0),
							debits: Math.abs(
								monthStatement.entries.reduce((prev, entry) => {
									if (entry.Type === 'DEBIT') return prev;
									return prev + entry.Amount;
								}, 0)
							),
							monthIndex: monthStatement.monthIndex
						};

						totals.push(data);
					}
				});
				props.setMonthlyTransactionTotals(totals);
			}
			reader.readAsArrayBuffer(event.target.files[0]);
		}
	}

	return (
		<label id="file-selector">Select a statement file:<br />
			<input type="file" onChange={onChangeHandler} />
		</label>
	);
}

export { FileSelector };