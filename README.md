# yoink - web clipper for obsidian
originally based on [kepano's obsidian web clipper bookmarklet](https://gist.github.com/kepano/90c05f162c37cf730abb8ff027987ca3)  

uses [@joplin/turndown](https://github.com/laurent22/joplin/tree/dev/packages/turndown), [readability](https://github.com/mozilla/readability) and [wxt](https://github.com/wxt-dev/wxt), among others.

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
  - [x] mathjax v3
  - [x] mathjax v2 type `math/asciimath`
  - [x] assume codeblock language for syntax highlighting
  - [ ] extract content from iframes as well
  - [ ] set image size for obsidian-style images
- likely won't be implemented
  - settings page with a bunch of niche, obsidian-specific features
    - some obsidian-specific settings will be implemented
  - inline editor, like codemirror - we'll see later

## features / internals
- custom lightweight HTMLRewriter - modify or replace dom nodes before converting them to markdown based on a querySelector
  - this allows anyone to easily contribute a site-specific fix for their favorite site
