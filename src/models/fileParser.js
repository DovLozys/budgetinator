function getCategories(arrayOfRows) {
	let listOfCategories = [];
	for (let i = 0; i < arrayOfRows.length; i++) {
		if (!listOfCategories.includes(arrayOfRows[i]['Category'])) {
			listOfCategories.push(arrayOfRows[i]['Category']);
		}
	}
	return listOfCategories;
}

export { getCategories };
