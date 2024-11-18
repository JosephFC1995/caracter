/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				beige: "#EBE8DC",
				"beige-two": "#D5BFA1",
				gris: "#A3A096",
				brandy: "#B37058",
				cemento: "#737362",
				grafito: "#383833",
			},
			container: {
				center: true,
				padding: {
					DEFAULT: "1rem",
					sm: "2rem",
					md: "2rem",
				},
			},
		},
	},
	plugins: [],
};
