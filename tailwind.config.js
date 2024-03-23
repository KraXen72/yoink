/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entrypoints/**/*.{html,ts}', './components/**/*.ts'],
  theme: {
    extend: {
			colors: {
				bbg: '#282c34',
				bbg2: '#21252b',
				hlbg: '#2c313a',
				btext: '#abb2bf',
				toolbg: '#353a42',
				sel: '#3E4451',
				'od-cyan': '#56b6c2'
			}
		},
  },
  plugins: [],
};