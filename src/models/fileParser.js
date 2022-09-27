function getCategories(arrayOfRows) {
	let arrayOfCategories = [];
	for (let i = 0; i < arrayOfRows.length; i++) {
		if (!arrayOfCategories.includes(arrayOfRows[i]['Category'])) {
			arrayOfCategories.push(arrayOfRows[i]['Category']);
		}
	}
	return arrayOfCategories;
}

function getExpenses(arrayOfRows) {
	let arrayOfExpenses = [];
	for (let i = 0; i < arrayOfRows.length; i++) {
		if (arrayOfRows[i]['Type'] === 'DEBIT') {
			arrayOfExpenses.push(arrayOfRows[i]['Amount']);
		}
	}
	return arrayOfExpenses;
}

function getIncomes(arrayOfRows) {
	let arrayOfIncomes = [];
	for (let i = 0; i < arrayOfRows.length; i++) {
		if (arrayOfRows[i]['Type'] === 'CREDIT') {
			arrayOfIncomes.push(arrayOfRows[i]['Amount']);
		}
	}
	return arrayOfIncomes;
}

function getMonths(arrayOfRows) {
	let arrayOfMonths = [];
	//TODO: month filtering I guess
	console.log(arrayOfMonths);
	//return arrayOfMonths;
}

export { getCategories, getExpenses, getIncomes };
