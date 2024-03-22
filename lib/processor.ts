import { processHTML } from '@/lib/process-html';
import { processMarkdown } from '@/lib/process-markdown';
import type { mathJax3Payload } from '@/lib/mathjax3';
import type { protocol } from './types';

const yamlSpecial = [":", "{", "}", "[", "]", ",", "&", "*", "#", "?", "!", "|", "-", "<", ">", "=", "%", "@", "\\", "\n"]

function convertDate(date) {
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth() + 1).toString();
	var dd = date.getDate().toString();
	var mmChars = mm.split('');
	var ddChars = dd.split('');
	return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}

/** Poor man's Object -> YAML converter because i cba to add another dependency */
function stringifyYAMLHeader(obj: Record<string, string | string[] | number>) {
	let yaml = '---\n'
	for (const [k, v] of Object.entries(obj)) {
		let m = `${k}: `
		if (Array.isArray(v)) {
			m += `[${(v as string[]).join(",")}]`
		} else {
			if (typeof v === "string" && yamlSpecial.some(ch => v.includes(ch))) {
				if (v.includes('"') && v.includes("'")) {
					m += `"${v.replaceAll("\"", "\\\"")}"`
				} else {
					m += v.includes('"') ? `'${v}'` : `"${v}"`
				}
			} else {
				m += `${v}`
			}
		}
		yaml += m + "\n"
	} 
	yaml += "---\n\n"
	return yaml
}

// function getFileName(fileName) {
// 	var userAgent = window.navigator.userAgent,
// 		platform = window.navigator.platform, // FIXME
// 		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

// 	if (windowsPlatforms.indexOf(platform) !== -1) {
// 		fileName = fileName.replace(':', '').replace(/[/\\?%*|"<>]/g, '-');
// 	} else {
// 		fileName = fileName.replace(':', '').replace(/\//g, '-').replace(/\\/g, '-');
// 	}
// 	return fileName;
// }
// let vaultName = (vault) ? '&vault=' + encodeURIComponent(`${vault}`) : ''

export async function processContent(dom: Document, mjx3Info: mathJax3Payload ) {
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
	const rewrittenHTML = await processHTML(dom, mjx3Data)
	const resultingMarkdown = processMarkdown(rewrittenHTML)

	/* YAML front matter as tags render cleaner with special chars  */
	const fileContent = stringifyYAMLHeader(meta) + resultingMarkdown
	console.log(fileContent)

	browser.runtime.sendMessage({
		cmd: 'set-codemirror',
		for: 'popup',
		from: 'content',
		type: 'forward',
		data: { content: fileContent }
	} satisfies protocol)

	// document.location.href = "obsidian://new?"
	// 	+ "file=" + encodeURIComponent(folder + fileName)
	// 	+ "&content=" + encodeURIComponent(fileContent)
	// 	+ vaultName;
}

