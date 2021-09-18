const dateFormatter = (d: Date | number | string) => {
	const date = new Date(d)
	const [formatDate, formatTime, timezone] = new Intl.DateTimeFormat("de-DE", {
		dateStyle: "short",
		timeStyle: "long",
	})
		.format(date)
		.replace(",", "")
		.replaceAll(".", "/")
		.split(" ")

	return {
		date: formatDate,
		time: formatTime,
		timezone,
		dateTime: `${formatDate} ${formatTime}`,
	}
}

export default dateFormatter
