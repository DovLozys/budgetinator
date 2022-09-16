function App() {
	return (
		<>
			<header>
				<h1>Budgetinator</h1>
				<form>
					<label for="budget-data-file">Select a file:</label>
					<input type="file" id="budget-data-file" name="budget-data-file" /><br /><br />
					<input type="submit" value="Submit" />
				</form>
			</header>
			<div className="row">
				<div className="column side">
					Month selector
				</div>
				<div className="column main">
					<div>Month text data</div>
					<div>Month charts</div>
				</div>
			</div>
		</>
	);
}

export default App;
