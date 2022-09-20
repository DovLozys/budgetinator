import { read, utils } from 'xlsx';

function FileSelector(props) {
	function getCategories(rowArray) {
		let listOfCategories = [];
		for (let i = 0; i < rowArray.length; i++) {
			if (!listOfCategories.includes(rowArray[i]['Category'])) {
				listOfCategories.push(rowArray[i]['Category']);
			}
		}
		return listOfCategories;
	}

	function onChangeHandler(event) {
		event.preventDefault();
		if (event.target.files) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const fileContents = event.target.result;
				const workbook = read(fileContents, { type: "array" });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const rowArray = utils.sheet_to_json(worksheet);
				props.setCategories(getCategories(rowArray));
			}
			reader.readAsArrayBuffer(event.target.files[0]);
		}
	}

	return (
		<form>
			<label htmlFor="budget-data-file">Select a file: </label>
			<input
				type="file"
				id="budget-data-file"
				name="budget-data-file"
				onChange={onChangeHandler}
			/>
		</form>
	);
}

export default FileSelector;
