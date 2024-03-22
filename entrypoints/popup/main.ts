import { EditorView, keymap, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { markdown } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { syntaxHighlighting, indentOnInput, bracketMatching } from "@codemirror/language";
import { materialDarkTheme, materialDarkHighlightStyle } from "cm6-theme-material-dark";
import { wrappedLineIndent } from 'codemirror-wrapped-line-indent';

import type { protocol } from '@/lib/types';

// The Markdown parser will dynamically load parsers
// for code blocks, using @codemirror/language-data to
// look up the appropriate dynamic import.
let view = new EditorView({
	doc: "\n".repeat(20),
	extensions: [
		// modified basicSetup sans line numbers & other useless stuff
		materialDarkTheme, // custom theme
		syntaxHighlighting(materialDarkHighlightStyle, {fallback: true}),
		highlightSpecialChars(),
		history(),
		drawSelection(),
		dropCursor(),
		indentOnInput(),
		bracketMatching(),
		closeBrackets(),
		highlightActiveLine(),
		autocompletion(),
		keymap.of([
			indentWithTab,
			...closeBracketsKeymap,
			...defaultKeymap,
			...historyKeymap,
			...completionKeymap,
		]),
		EditorView.lineWrapping,
		wrappedLineIndent,
		markdown({ codeLanguages: languages }),
	],
	parent: document.getElementById("cm-wrapper"),
})

function setContent(val: string) {
	view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: val }})
}

async function trigger() {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true })
	for (const tab of tabs) {
		if (!tab.id) continue;
		await browser.tabs.sendMessage(tab.id, { cmd: "process", for: 'content', from: 'popup' } satisfies protocol);
	}
}

document.getElementById("process-btn").addEventListener("click", trigger)
document.addEventListener("DOMContentLoaded", trigger)

browser.runtime.onMessage.addListener((request: protocol) => {
	if (request?.for !== 'popup') return;
	if (request?.cmd === "set-codemirror" && typeof request?.data?.content === 'string') {
		setContent(request.data.content)
	}
	console.log('recieved:', request)
	// view.state.update({ changes: { 
	// 	to: view.state.doc.length, 
	// 	from: view.state.doc.length, 
	// 	insert: JSON.stringify(request) + "\n" 
	// }})
})
