import FileSelector from '../FileSelector';

function App() {
	return (
		<>
			<header>
				<h1>Budgetinator</h1>
				<FileSelector />
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
