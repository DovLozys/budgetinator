function getMonthNameFromIndex(index) {
	const date = new Date();
	date.setMonth(index);

	return date.toLocaleString([], {
		month: 'long',
	});
}

export { getMonthNameFromIndex };
