import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	runner: {
		chromiumArgs: ["--devtools"],
		openDevtools: true,
		startUrls: [
			"https://jrsinclair.com/articles/2023/how-to-consume-a-paginated-api-using-javascript-async-generators/",
			"https://mathjax.github.io/MathJax-demos-web/tex-chtml.html",
		],
	},
	manifest: {
		web_accessible_resources: [
			{ resources: ["page.js"], matches: ["<all_urls>"] }
		]
	}
});
