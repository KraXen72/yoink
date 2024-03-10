import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	runner: {
		chromiumArgs: ["--devtools"],
		openDevtools: true,
		startUrls: [
			"https://jrsinclair.com/articles/2023/how-to-consume-a-paginated-api-using-javascript-async-generators/",
			"https://mathjax.github.io/MathJax-demos-web/tex-chtml.html",
			"file:///D:/coding/%23sandbox/test%20pages%20for%20yoink/delft%20edx2.html",
			"https://sixthform.info/katex/examples/centraliser.html",
			"https://www.theverge.com/2022/10/28/23428132/elon-musk-twitter-acquisition-problems-speech-moderation",
			"https://zealot.hu/absolem/",
			"file:///D:/coding/%23sandbox/test%20pages%20for%20yoink/verge-stripped.html"
		],
	},
	manifest: {
		web_accessible_resources: [
			{ resources: ["page.js"], matches: ["<all_urls>"] }
		]
	}
});
