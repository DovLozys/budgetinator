import { read, utils } from 'xlsx';

function FileSelector(props) {
    function onChangeHandler(event) {
        event.preventDefault();
        
        if (event.target.files) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContents = event.target.result;
                const workbook = read(fileContents, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const arrayOfRows = utils.sheet_to_json(worksheet);
                
                // populate statementFile
                props.setStatementFile(arrayOfRows);
                
                // populate monthlyStatements
                const transactionsByMonth = [];
				for (let i = 0; i < arrayOfRows.length; i++) {
                    const date = new Date(arrayOfRows[i]['Date']);
                    if (transactionsByMonth[date.getMonth()] === undefined) {
                        transactionsByMonth[date.getMonth()] = {
                            month: date.getMonth(),
                            entries: [arrayOfRows[i]]
                        }
                    } else {
                        transactionsByMonth[date.getMonth()].entries.push(arrayOfRows[i])
                    }
				}
                props.setMonthlyStatements(transactionsByMonth);

                // TODO: populate monthlyTotals using transactionsByMonth
                const totals = [];

            }
            reader.readAsArrayBuffer(event.target.files[0]);
        }
    }

    return (
        <label id="file-selector">Select a statement file: <br />
            <input type="file" onChange={onChangeHandler} />
        </label>
    );
}

export { FileSelector };
