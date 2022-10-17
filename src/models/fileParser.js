function getCategories(arrayOfRows) {
	let arrayOfCategories = [];
	for (let i = 0; i < arrayOfRows.length; i++) {
		if (!arrayOfCategories.includes(arrayOfRows[i]['Category'])) {
			arrayOfCategories.push(arrayOfRows[i]['Category']);
		}
	}

	return arrayOfCategories;
}

function getDebits(arrayOfRows) {
	let arrayOfDebits = [];
	for (let i = 0; i < arrayOfRows.length; i++) {
		if (arrayOfRows[i]['Type'] === 'DEBIT') {
			arrayOfDebits.push(arrayOfRows[i]['Amount']);
		}
	}

	return arrayOfDebits;
}

function getCredits(arrayOfRows) {
	let arrayOfCredits = [];
	for (let i = 0; i < arrayOfRows.length; i++) {
		if (arrayOfRows[i]['Type'] === 'CREDIT') {
			arrayOfCredits.push(arrayOfRows[i]['Amount']);
		}
	}

	return arrayOfCredits;
}

/*
TODO:
	getCategories - gets all available categories from a statement (leisure, bills...)
	getTransactionsInCategory - gets transactions in a specific category
*/

export { getCategories, getDebits, getCredits };
