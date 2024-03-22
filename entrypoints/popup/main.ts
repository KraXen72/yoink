import { EditorView, keymap, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { markdown } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { syntaxHighlighting, indentOnInput, bracketMatching } from "@codemirror/language";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { oneDarkHighlightStyle, oneDarkTheme } from "@codemirror/theme-one-dark";
import { wrappedLineIndent } from 'codemirror-wrapped-line-indent';

import type { protocol } from '@/lib/types';

// The Markdown parser will dynamically load parsers
// for code blocks, using @codemirror/language-data to
// look up the appropriate dynamic import.
let view = new EditorView({
	doc: "\n".repeat(20),
	extensions: [
		// modified basicSetup sans line numbers & other useless stuff
		highlightSpecialChars(),
		history(),
		drawSelection(),
		dropCursor(),
		indentOnInput(),
		oneDarkTheme,
		syntaxHighlighting(oneDarkHighlightStyle, {fallback: true}),
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
	view.state.update({ changes: { from: 0, to: view.state.doc.length, insert: val }})
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
