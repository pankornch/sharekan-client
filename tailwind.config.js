module.exports = {
	purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				main: {
					orange: "#f48945",
					red: "#EF4444",
					blue: "#123AAF",
					light: "#fafafa",
					grey: "#919191",
					dark: "#313337",
				},
			},
			shadow: {
				DEFAULT: "box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.25)",
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: ["active"],
		},
	},
	plugins: [],
	corePlugins: {
		// ...
		container: false,
	},
}
