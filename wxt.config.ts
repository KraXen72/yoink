import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	runner: {
		chromiumArgs: ["--devtools"],
		openDevtools: true,
		startUrls: [
			"https://mathjax.github.io/MathJax-demos-web/tex-chtml.html"
		],
	},
	manifest: {
		web_accessible_resources: [
			{ resources: ["page.js"], matches: ["<all_urls>"] }
		]
	}
});
