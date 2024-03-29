import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	runner: {
		chromiumProfile: 'C:\\Users\\Nex\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1',	
		startUrls: [
			"https://jrsinclair.com/articles/2023/how-to-consume-a-paginated-api-using-javascript-async-generators/",
			"https://mathjax.github.io/MathJax-demos-web/tex-chtml.html",
			"file:///D:/coding/%23sandbox/test%20pages%20for%20yoink/delft%20edx2.html",
			"https://sixthform.info/katex/examples/centraliser.html",
			"file:///D:/coding/%23sandbox/test%20pages%20for%20yoink/delft%20edx2-iframe.html",
			"https://zealot.hu/absolem/",
			"file:///D:/coding/%23sandbox/test%20pages%20for%20yoink/verge-stripped.html",
			"https://learnxinyminutes.com/docs/sql/",
			"https://referaty.aktuality.sk/jozef-gregor-tajovsky-statky-zmatky/referat-6627",
			"https://www.zones.sk/studentske-prace/gramatika/5465-slovotvorne-postupy-odvodzovanie-skladanie-skracovanie/",
			"https://romgrk.com/posts/optimizing-javascript#5-avoid-cache-misses"
		],
	},
	manifest: {
		web_accessible_resources: [
			{ resources: ["page.js"], matches: ["<all_urls>"] }
		]
	}
});
