import { useState } from 'react';

function MonthSelectorBox() {
	const [monthRange, setMonthRange] = useState([0, 0]);

	function onChangeHandler(event) {
		const options = event.target.selectedOptions;
		if (options.length === 1) {
			setMonthRange([options[0].value, options[0].value]);
		} else {
			setMonthRange([options[0].value, options[options.length - 1].value]);
		}
	}

	return (
		<label>
			Select a range:<br />
			<select onChange={onChangeHandler} size="12" multiple>
				<option value="0">January</option>
				<option value="1">February</option>
				<option value="2">March</option>
				<option value="3">April</option>
				<option value="4">May</option>
				<option value="5">June</option>
				<option value="6">July</option>
				<option value="7">August</option>
				<option value="8">September</option>
				<option value="9">October</option>
				<option value="10">November</option>
				<option value="11">December</option>
			</select>
			DEBUG: {monthRange}
		</label>
	);
}

export { MonthSelectorBox };
