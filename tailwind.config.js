/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				Dancing: ["Dancing Script", "cursive"],
				Roboto: ["Roboto", "cursive"],
			},
		},
	},
	variants: {
	  extend: {},
	},
	plugins: [],
};
