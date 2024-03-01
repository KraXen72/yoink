import Turndown from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const turndownService = new Turndown({
	headingStyle: 'atx',
	hr: '---',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced',
	emDelimiter: '*',
})
turndownService.use(gfm)

function majaxScriptBlockType(node) {
  if (node.nodeName !== 'SCRIPT') return null;

  const a = node.getAttribute('type');
  if (!a || a.indexOf('math/tex') < 0) return null;

  return a.indexOf('display') >= 0 ? 'block' : 'inline';
}

turndownService.addRule("mathjaxRendered", {
  filter: function (node) {
    return node.nodeName === 'SPAN' && node.getAttribute('class') === 'MathJax';
  },

  replacement: function (content, node, options) {
    return '';
  }
})

turndownService.addRule("mathjaxScriptInline", {
  filter: function (node) {
    return majaxScriptBlockType(node) === 'inline';
  },

  escapeContent: function() {
    // We want the raw unescaped content since this is what Katex will need to render
    // If we escape, it will double the \\ in particular.
    return false;
  },

  replacement: function (content, node, options) {
    return '$' + content + '$';
  }
})

turndownService.addRule("mathjaxScriptBlock", {
  filter: function (node) {
    return majaxScriptBlockType(node) === 'block';
  },

  escapeContent: function() {
    return false;
  },

  replacement: function (content, node, options) {
    return '$$\n' + content + '\n$$';
  }
})

// doesen't preserve mathjax stuff


export default turndownService;