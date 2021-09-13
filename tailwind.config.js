module.exports = {
	purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				main: {
					orange: "#f48945",
					red: "#EF4444",
					blue: "#0040ff",
					light: "#fafafa",
					grey: "#919191",
					dark: "#313337",
				},
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: ["active"],
		},
	},
	plugins: [],
}
