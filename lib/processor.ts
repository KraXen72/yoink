import { processHTML } from './process-html';
import { processMarkdown } from './process-markdown';
import type { mathJax3Payload } from './mathjax3';

function convertDate(date) {
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth() + 1).toString();
	var dd = date.getDate().toString();
	var mmChars = mm.split('');
	var ddChars = dd.split('');
	return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}

function getSelectionHtml() {
	const sel = window.getSelection();
	if (!sel.rangeCount) return '';
	const container = document.createElement("div");
	for (let i = 0; i < sel.rangeCount; ++i) {
		container.appendChild(sel.getRangeAt(i).cloneContents());
	}
	return container.innerHTML;
}

function getFileName(fileName) {
	var userAgent = window.navigator.userAgent,
		platform = window.navigator.platform, // FIXME
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

	if (windowsPlatforms.indexOf(platform) !== -1) {
		fileName = fileName.replace(':', '').replace(/[/\\?%*|"<>]/g, '-');
	} else {
		fileName = fileName.replace(':', '').replace(/\//g, '-').replace(/\\/g, '-');
	}
	return fileName;
}

export async function process(dom: Document, mjx3Info: mathJax3Payload ) {
	// obsidian stuff
	const vault = "";
	const folder = "Clippings/";

	const meta: Record<string, string | string[]> = {
		title: document.querySelector(`meta[property="og:title"]`)?.getAttribute("content") || document.title,
		source: document.querySelector(`meta[property="og:url"]`)?.getAttribute("content") || document.URL,
		clipped: convertDate(new Date()),
		topics: ""
	}

	const metaSelectors = {
		"description": { qs: `meta[name="description"]`, attr: "content" },
		"subtitle": { qs: `meta[property="og:description"]`, attr: "content" },
		"published": { qs: `meta[property="article:published_time"]`, attr: "content" },
		"modified": { qs: `meta[property="article:modified_time"]`, attr: "content" },
		"author": { qs: 'meta[property="author"]', attr: "content" },
		"tags": { qs: `meta[name="parsely-tags"]`, attr: "content", deli: "," }
	}

	for (const [key, info] of Object.entries(metaSelectors)) {
		const el = document.querySelector(info.qs)
		if (el === null) continue;
		let value: string | string[] = ("attr" in info) ? el.getAttribute(info.attr) : el.textContent
		if ("deli" in info) value = value.split(info.deli)
		if (Array.isArray(meta[key])) {
			//@ts-ignore
			meta[key].push(...(Array.isArray(value) ? value : [value]))
		} else {
			meta[key] ??= value
		}

	}
	meta.tags ??= []
	if (Array.isArray(meta.tags)) meta.tags.push("clippings")
	if (meta.subtitle === meta.description) delete meta.subtitle
	if (meta.topics.toString().trim() === "") delete meta.topics

	console.log('processor', mjx3Info)
	const mjx3Data = mjx3Info && mjx3Info.status === 200 ? mjx3Info.data : []
	const content = await processHTML(dom, mjx3Data)
	// console.log(content)
	// const fileName = getFileName(title);

	const selection = getSelectionHtml();
	const markdownify = selection || content;
	let vaultName = (vault) ? '&vault=' + encodeURIComponent(`${vault}`) : ''

	const markdownBody = processMarkdown(markdownify)

	/* YAML front matter as tags render cleaner with special chars  */
	const fileContent = "---\n"
		+ Object.entries(meta)
			.map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(",")}]` : v}`)
			.join("\n")
		+ '\n---\n\n' + markdownBody

	console.log(fileContent)
	// document.location.href = "obsidian://new?"
	// 	+ "file=" + encodeURIComponent(folder + fileName)
	// 	+ "&content=" + encodeURIComponent(fileContent)
	// 	+ vaultName;
}

