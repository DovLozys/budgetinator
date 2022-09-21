function getCategories(arrayOfRows) {
	let arrayOfCategories = [];
	for (let i = 0; i < arrayOfRows.length; i++) {
		if (!arrayOfCategories.includes(arrayOfRows[i]['Category'])) {
			arrayOfCategories.push(arrayOfRows[i]['Category']);
		}
	}
	return arrayOfCategories;
}

function getMonths(arrayOfRows) {
	let arrayOfMonths = [];
	//TODO: month filtering I guess
	console.log(arrayOfMonths);
	//return arrayOfMonths;
}

export { getCategories };
