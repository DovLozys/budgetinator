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
				props.setStatementFile(arrayOfRows);
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
