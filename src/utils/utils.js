function getMonthNameFromIndex(index) {
	const date = new Date();
	date.setMonth(index);

	return date.toLocaleString([], {
		month: 'long',
	});
}

// sums up the array returned by the model, rounds to two decimal places
function modelReducer(model, statement) {
	return Math.abs(Math.round(model(statement).reduce((partialSum, amount) => partialSum + amount, 0) * 100) / 100);
}

export { getMonthNameFromIndex, modelReducer };
