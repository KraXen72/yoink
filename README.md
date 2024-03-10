# yoink - web clipper for obsidian
originally based on [kepano's obsidian web clipper bookmarklet](https://gist.github.com/kepano/90c05f162c37cf730abb8ff027987ca3)  

uses @joplin/turndown, readability and wxt, among others.

work in progress.

## aim
- support most of markdownload's extraction features
  - [x] metadata extraction
  - [ ] image extraction
  - [ ] remote image downloading
  - [x] codeblocks
  - [ ] mathjax v2
  - [ ] katex
- extra features
  - [x] mathjax v3 (WIP)
  - [x] assume codeblock language for syntax highlighting (WIP)
  - [ ] extract content from iframes as well
  - [ ] set image size for obsidian-style images
- likely won't be implemented
  - settings page with a bunch of niche, obsidian-specific features
    - some obsidian-specific settings will be implemented
  - inline editor, like codemirror - we'll see later
