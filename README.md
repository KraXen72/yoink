# yoink - web clipper for obsidian
based on [kepano's obsidian web clipper bookmarklet](https://gist.github.com/kepano/90c05f162c37cf730abb8ff027987ca3)

## planned features
- [ ] assume codeblock language
- [ ] mathjax v2 and v3 support

## current status
indefinite hiatus.
mathjax v3 destructively modifies the dom when rendering, and the only way to get the original tex commands is to run some function on the MathJax global object in the original page scope, which would (likely?) require me to inject a script tag into every page.
