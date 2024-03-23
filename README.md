# yoink - web clipper for obsidian
uses [@joplin/turndown](https://github.com/laurent22/joplin/tree/dev/packages/turndown), [readability](https://github.com/mozilla/readability) and [wxt](https://github.com/wxt-dev/wxt), among others.

originally based on [kepano's obsidian web clipper bookmarklet](https://gist.github.com/kepano/90c05f162c37cf730abb8ff027987ca3)  

work in progress.

## aim
- support most of markdownload's extraction features
  - [x] metadata extraction
  - [ ] image extraction
  - [ ] remote image downloading
  - [x] codeblocks
  - [x] mathjax v2
  - [x] katex
- extra features
  - [x] typescript
  - [x] manifest v3
  - [x] mathjax v3
  - [x] mathjax v2 type `math/asciimath`
  - [x] assume codeblock language for syntax highlighting
  - [x] frontmatter highlighting in popup
  - [x] extract content from iframes 
  - [ ] set image size for obsidian-style images
- likely won't be implemented
  - bloated and full-width settings page

## features / internals
- custom lightweight HTMLRewriter - modify or replace dom nodes before converting them to markdown based on a querySelector

## contributing
Have [git](https://git-scm.com/downloads), [nodejs](https://nodejs.org/enhttps://pnpm.io/installation) and [pnpm](https://pnpm.io/installation) (`npm i -g`) installed.
1. `git clone https://github.com/KraXen72/yoink`
2. `cd yoink`
3. `pnpm i`
4. `pnpm dev`
- It will new chrome/firefox window with some sample sites for testing and the extension loaded. Live reload is on: if you make a change, the sites refresh themselves.
- If you edit the `iframe.content.ts`, a manual refresh with `F5` or the button might be necessary
- If you don't have firefox or chrome installed, please install one of them or change the browser path in `wxt.config.ts` according to the [docs](https://wxt.dev/guide/development.html#configure-browser-startup) to your browser path.

## site-specific fixes
If yoink does not work on your favorite site, open an issue!  
However, some sites are broken, because of how readability.js or turndown handle them.  
If you confirm this is the case or are told so in the issue, please open a pull request with a site-specific fix.  
It's pretty simple!

> [!NOTE]  
> If you do not have any typescript experience or are simply unwilling to open a pull request, your site-specific rule will be considered, but is not guaranteed to be implemented!  
> There are simply too may sites for one person to maintain the support for. I will primarily fix sites I use or sites that are easy enough to fix. For this reason, I created a simple way for you to fix your site!

1. follow the steps in [contributing](#contributing)
2. go to [process-html.ts](./lib/process-html.ts)
3. see, if somebody already wrote a rule for your site. 
   - if yes, try modifying their rule or create a new rule below it
   - if not, create a new rule at the bottom of the page
4. creating a HTMLRewriter rule: (example below)  
```ts
rewriter.addRule('change_spans_to_divs', { // first argument is rule name
	selector: `span`, // css selector to modify 
	// element, dom (document)
	rewrite: (el, dom) => {
		// some logic 
		// - you can modify the dom directly with document methods like appendChild, etc
		// - you can return an element which will be used as a replacement for the 'el' element
		// - you can use the 'elem' helper function to easily create a new element
		//     - the second parameter is exactly the same as things on document.createElement, apart from 'class', which can take in a string or an array of classes
		const wrap = elem('div', {
			innerHTML: el.innerHTML,
			class: 'my-cool-class' // or ['myclass1', 'myclass2']
		})
		return wrap
	}
})
```
Feel free to ask for help in your pull request comments, or look at how other rules are implemented.  
More info: [CSS Selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors)
