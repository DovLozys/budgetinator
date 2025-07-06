interface MonthSelectorPanelProps {
	setMonthRange: (range: [number, number]) => void;
}

function MonthSelectorPanel({ setMonthRange }: MonthSelectorPanelProps) {
	function onChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
		const options = event.target.selectedOptions;
		if (options.length < 1) return;
		setMonthRange([ Number(options[0].value), Number(options[options.length - 1].value) ]);
	}

	return (
		<label>
			Select a range:<br />
			<select onChange={onChangeHandler} size={12} multiple>
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
		</label>
	);
}

export { MonthSelectorPanel };