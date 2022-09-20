import { useState } from 'react';

import FileSelector from '../FileSelector';

function App() {
	const [categories, setCategories] = useState([]);
	return (
		<>
			<header>
				<h1>Budgetinator</h1>
				<FileSelector setCategories={setCategories}/>
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
			DEBUG: {categories}
		</>
	);
}

export default App;
