import { useState } from 'react';
import { FileSelector } from '../FileSelector';

function App() {
	const [statementFile, setStatementFile] = useState([]);
	return (
		<>
			<header>
				<h1>Budgetinator</h1>
				<FileSelector setStatementFile={setStatementFile}/>
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
			DEBUG: {statementFile.length}
		</>
	);
}

export { App };
