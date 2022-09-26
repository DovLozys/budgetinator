import { useState } from 'react';

import { FileSelector } from '../FileSelector';
import { MonthSelectorBox } from '../MonthSelectorBox';

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
					<MonthSelectorBox />
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
