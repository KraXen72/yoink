(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all5) => {
    for (var name2 in all5)
      __defProp(target, name2, { get: all5[name2], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/.pnpm/@mozilla+readability@0.5.0/node_modules/@mozilla/readability/Readability.js
  var require_Readability = __commonJS({
    "node_modules/.pnpm/@mozilla+readability@0.5.0/node_modules/@mozilla/readability/Readability.js"(exports, module) {
      function Readability2(doc, options) {
        if (options && options.documentElement) {
          doc = options;
          options = arguments[2];
        } else if (!doc || !doc.documentElement) {
          throw new Error("First argument to Readability constructor should be a document object.");
        }
        options = options || {};
        this._doc = doc;
        this._docJSDOMParser = this._doc.firstChild.__JSDOMParser__;
        this._articleTitle = null;
        this._articleByline = null;
        this._articleDir = null;
        this._articleSiteName = null;
        this._attempts = [];
        this._debug = !!options.debug;
        this._maxElemsToParse = options.maxElemsToParse || this.DEFAULT_MAX_ELEMS_TO_PARSE;
        this._nbTopCandidates = options.nbTopCandidates || this.DEFAULT_N_TOP_CANDIDATES;
        this._charThreshold = options.charThreshold || this.DEFAULT_CHAR_THRESHOLD;
        this._classesToPreserve = this.CLASSES_TO_PRESERVE.concat(options.classesToPreserve || []);
        this._keepClasses = !!options.keepClasses;
        this._serializer = options.serializer || function(el) {
          return el.innerHTML;
        };
        this._disableJSONLD = !!options.disableJSONLD;
        this._allowedVideoRegex = options.allowedVideoRegex || this.REGEXPS.videos;
        this._flags = this.FLAG_STRIP_UNLIKELYS | this.FLAG_WEIGHT_CLASSES | this.FLAG_CLEAN_CONDITIONALLY;
        if (this._debug) {
          let logNode = function(node) {
            if (node.nodeType == node.TEXT_NODE) {
              return `${node.nodeName} ("${node.textContent}")`;
            }
            let attrPairs = Array.from(node.attributes || [], function(attr) {
              return `${attr.name}="${attr.value}"`;
            }).join(" ");
            return `<${node.localName} ${attrPairs}>`;
          };
          this.log = function() {
            if (typeof console !== "undefined") {
              let args = Array.from(arguments, (arg) => {
                if (arg && arg.nodeType == this.ELEMENT_NODE) {
                  return logNode(arg);
                }
                return arg;
              });
              args.unshift("Reader: (Readability)");
              console.log.apply(console, args);
            } else if (typeof dump !== "undefined") {
              var msg = Array.prototype.map.call(arguments, function(x) {
                return x && x.nodeName ? logNode(x) : x;
              }).join(" ");
              dump("Reader: (Readability) " + msg + "\n");
            }
          };
        } else {
          this.log = function() {
          };
        }
      }
      Readability2.prototype = {
        FLAG_STRIP_UNLIKELYS: 1,
        FLAG_WEIGHT_CLASSES: 2,
        FLAG_CLEAN_CONDITIONALLY: 4,
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        ELEMENT_NODE: 1,
        TEXT_NODE: 3,
        // Max number of nodes supported by this parser. Default: 0 (no limit)
        DEFAULT_MAX_ELEMS_TO_PARSE: 0,
        // The number of top candidates to consider when analysing how
        // tight the competition is among candidates.
        DEFAULT_N_TOP_CANDIDATES: 5,
        // Element tags to score by default.
        DEFAULT_TAGS_TO_SCORE: "section,h2,h3,h4,h5,h6,p,td,pre".toUpperCase().split(","),
        // The default number of chars an article must have in order to return a result
        DEFAULT_CHAR_THRESHOLD: 500,
        // All of the regular expressions in use within readability.
        // Defined up here so we don't instantiate them repeatedly in loops.
        REGEXPS: {
          // NOTE: These two regular expressions are duplicated in
          // Readability-readerable.js. Please keep both copies in sync.
          unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
          okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i,
          positive: /article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i,
          negative: /-ad-|hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|foot|footer|footnote|gdpr|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|tool|widget/i,
          extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single|utility/i,
          byline: /byline|author|dateline|writtenby|p-author/i,
          replaceFonts: /<(\/?)font[^>]*>/gi,
          normalize: /\s{2,}/g,
          videos: /\/\/(www\.)?((dailymotion|youtube|youtube-nocookie|player\.vimeo|v\.qq)\.com|(archive|upload\.wikimedia)\.org|player\.twitch\.tv)/i,
          shareElements: /(\b|_)(share|sharedaddy)(\b|_)/i,
          nextLink: /(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i,
          prevLink: /(prev|earl|old|new|<|«)/i,
          tokenize: /\W+/g,
          whitespace: /^\s*$/,
          hasContent: /\S$/,
          hashUrl: /^#.+/,
          srcsetUrl: /(\S+)(\s+[\d.]+[xw])?(\s*(?:,|$))/g,
          b64DataUrl: /^data:\s*([^\s;,]+)\s*;\s*base64\s*,/i,
          // Commas as used in Latin, Sindhi, Chinese and various other scripts.
          // see: https://en.wikipedia.org/wiki/Comma#Comma_variants
          commas: /\u002C|\u060C|\uFE50|\uFE10|\uFE11|\u2E41|\u2E34|\u2E32|\uFF0C/g,
          // See: https://schema.org/Article
          jsonLdArticleTypes: /^Article|AdvertiserContentArticle|NewsArticle|AnalysisNewsArticle|AskPublicNewsArticle|BackgroundNewsArticle|OpinionNewsArticle|ReportageNewsArticle|ReviewNewsArticle|Report|SatiricalArticle|ScholarlyArticle|MedicalScholarlyArticle|SocialMediaPosting|BlogPosting|LiveBlogPosting|DiscussionForumPosting|TechArticle|APIReference$/
        },
        UNLIKELY_ROLES: ["menu", "menubar", "complementary", "navigation", "alert", "alertdialog", "dialog"],
        DIV_TO_P_ELEMS: /* @__PURE__ */ new Set(["BLOCKQUOTE", "DL", "DIV", "IMG", "OL", "P", "PRE", "TABLE", "UL"]),
        ALTER_TO_DIV_EXCEPTIONS: ["DIV", "ARTICLE", "SECTION", "P"],
        PRESENTATIONAL_ATTRIBUTES: ["align", "background", "bgcolor", "border", "cellpadding", "cellspacing", "frame", "hspace", "rules", "style", "valign", "vspace"],
        DEPRECATED_SIZE_ATTRIBUTE_ELEMS: ["TABLE", "TH", "TD", "HR", "PRE"],
        // The commented out elements qualify as phrasing content but tend to be
        // removed by readability when put into paragraphs, so we ignore them here.
        PHRASING_ELEMS: [
          // "CANVAS", "IFRAME", "SVG", "VIDEO",
          "ABBR",
          "AUDIO",
          "B",
          "BDO",
          "BR",
          "BUTTON",
          "CITE",
          "CODE",
          "DATA",
          "DATALIST",
          "DFN",
          "EM",
          "EMBED",
          "I",
          "IMG",
          "INPUT",
          "KBD",
          "LABEL",
          "MARK",
          "MATH",
          "METER",
          "NOSCRIPT",
          "OBJECT",
          "OUTPUT",
          "PROGRESS",
          "Q",
          "RUBY",
          "SAMP",
          "SCRIPT",
          "SELECT",
          "SMALL",
          "SPAN",
          "STRONG",
          "SUB",
          "SUP",
          "TEXTAREA",
          "TIME",
          "VAR",
          "WBR"
        ],
        // These are the classes that readability sets itself.
        CLASSES_TO_PRESERVE: ["page"],
        // These are the list of HTML entities that need to be escaped.
        HTML_ESCAPE_MAP: {
          "lt": "<",
          "gt": ">",
          "amp": "&",
          "quot": '"',
          "apos": "'"
        },
        /**
         * Run any post-process modifications to article content as necessary.
         *
         * @param Element
         * @return void
        **/
        _postProcessContent: function(articleContent) {
          this._fixRelativeUris(articleContent);
          this._simplifyNestedElements(articleContent);
          if (!this._keepClasses) {
            this._cleanClasses(articleContent);
          }
        },
        /**
         * Iterates over a NodeList, calls `filterFn` for each node and removes node
         * if function returned `true`.
         *
         * If function is not passed, removes all the nodes in node list.
         *
         * @param NodeList nodeList The nodes to operate on
         * @param Function filterFn the function to use as a filter
         * @return void
         */
        _removeNodes: function(nodeList, filterFn) {
          if (this._docJSDOMParser && nodeList._isLiveNodeList) {
            throw new Error("Do not pass live node lists to _removeNodes");
          }
          for (var i = nodeList.length - 1; i >= 0; i--) {
            var node = nodeList[i];
            var parentNode = node.parentNode;
            if (parentNode) {
              if (!filterFn || filterFn.call(this, node, i, nodeList)) {
                parentNode.removeChild(node);
              }
            }
          }
        },
        /**
         * Iterates over a NodeList, and calls _setNodeTag for each node.
         *
         * @param NodeList nodeList The nodes to operate on
         * @param String newTagName the new tag name to use
         * @return void
         */
        _replaceNodeTags: function(nodeList, newTagName) {
          if (this._docJSDOMParser && nodeList._isLiveNodeList) {
            throw new Error("Do not pass live node lists to _replaceNodeTags");
          }
          for (const node of nodeList) {
            this._setNodeTag(node, newTagName);
          }
        },
        /**
         * Iterate over a NodeList, which doesn't natively fully implement the Array
         * interface.
         *
         * For convenience, the current object context is applied to the provided
         * iterate function.
         *
         * @param  NodeList nodeList The NodeList.
         * @param  Function fn       The iterate function.
         * @return void
         */
        _forEachNode: function(nodeList, fn) {
          Array.prototype.forEach.call(nodeList, fn, this);
        },
        /**
         * Iterate over a NodeList, and return the first node that passes
         * the supplied test function
         *
         * For convenience, the current object context is applied to the provided
         * test function.
         *
         * @param  NodeList nodeList The NodeList.
         * @param  Function fn       The test function.
         * @return void
         */
        _findNode: function(nodeList, fn) {
          return Array.prototype.find.call(nodeList, fn, this);
        },
        /**
         * Iterate over a NodeList, return true if any of the provided iterate
         * function calls returns true, false otherwise.
         *
         * For convenience, the current object context is applied to the
         * provided iterate function.
         *
         * @param  NodeList nodeList The NodeList.
         * @param  Function fn       The iterate function.
         * @return Boolean
         */
        _someNode: function(nodeList, fn) {
          return Array.prototype.some.call(nodeList, fn, this);
        },
        /**
         * Iterate over a NodeList, return true if all of the provided iterate
         * function calls return true, false otherwise.
         *
         * For convenience, the current object context is applied to the
         * provided iterate function.
         *
         * @param  NodeList nodeList The NodeList.
         * @param  Function fn       The iterate function.
         * @return Boolean
         */
        _everyNode: function(nodeList, fn) {
          return Array.prototype.every.call(nodeList, fn, this);
        },
        /**
         * Concat all nodelists passed as arguments.
         *
         * @return ...NodeList
         * @return Array
         */
        _concatNodeLists: function() {
          var slice = Array.prototype.slice;
          var args = slice.call(arguments);
          var nodeLists = args.map(function(list) {
            return slice.call(list);
          });
          return Array.prototype.concat.apply([], nodeLists);
        },
        _getAllNodesWithTag: function(node, tagNames) {
          if (node.querySelectorAll) {
            return node.querySelectorAll(tagNames.join(","));
          }
          return [].concat.apply([], tagNames.map(function(tag) {
            var collection = node.getElementsByTagName(tag);
            return Array.isArray(collection) ? collection : Array.from(collection);
          }));
        },
        /**
         * Removes the class="" attribute from every element in the given
         * subtree, except those that match CLASSES_TO_PRESERVE and
         * the classesToPreserve array from the options object.
         *
         * @param Element
         * @return void
         */
        _cleanClasses: function(node) {
          var classesToPreserve = this._classesToPreserve;
          var className2 = (node.getAttribute("class") || "").split(/\s+/).filter(function(cls) {
            return classesToPreserve.indexOf(cls) != -1;
          }).join(" ");
          if (className2) {
            node.setAttribute("class", className2);
          } else {
            node.removeAttribute("class");
          }
          for (node = node.firstElementChild; node; node = node.nextElementSibling) {
            this._cleanClasses(node);
          }
        },
        /**
         * Converts each <a> and <img> uri in the given element to an absolute URI,
         * ignoring #ref URIs.
         *
         * @param Element
         * @return void
         */
        _fixRelativeUris: function(articleContent) {
          var baseURI = this._doc.baseURI;
          var documentURI = this._doc.documentURI;
          function toAbsoluteURI(uri) {
            if (baseURI == documentURI && uri.charAt(0) == "#") {
              return uri;
            }
            try {
              return new URL(uri, baseURI).href;
            } catch (ex) {
            }
            return uri;
          }
          var links = this._getAllNodesWithTag(articleContent, ["a"]);
          this._forEachNode(links, function(link) {
            var href = link.getAttribute("href");
            if (href) {
              if (href.indexOf("javascript:") === 0) {
                if (link.childNodes.length === 1 && link.childNodes[0].nodeType === this.TEXT_NODE) {
                  var text3 = this._doc.createTextNode(link.textContent);
                  link.parentNode.replaceChild(text3, link);
                } else {
                  var container = this._doc.createElement("span");
                  while (link.firstChild) {
                    container.appendChild(link.firstChild);
                  }
                  link.parentNode.replaceChild(container, link);
                }
              } else {
                link.setAttribute("href", toAbsoluteURI(href));
              }
            }
          });
          var medias = this._getAllNodesWithTag(articleContent, [
            "img",
            "picture",
            "figure",
            "video",
            "audio",
            "source"
          ]);
          this._forEachNode(medias, function(media) {
            var src = media.getAttribute("src");
            var poster = media.getAttribute("poster");
            var srcset = media.getAttribute("srcset");
            if (src) {
              media.setAttribute("src", toAbsoluteURI(src));
            }
            if (poster) {
              media.setAttribute("poster", toAbsoluteURI(poster));
            }
            if (srcset) {
              var newSrcset = srcset.replace(this.REGEXPS.srcsetUrl, function(_, p1, p2, p3) {
                return toAbsoluteURI(p1) + (p2 || "") + p3;
              });
              media.setAttribute("srcset", newSrcset);
            }
          });
        },
        _simplifyNestedElements: function(articleContent) {
          var node = articleContent;
          while (node) {
            if (node.parentNode && ["DIV", "SECTION"].includes(node.tagName) && !(node.id && node.id.startsWith("readability"))) {
              if (this._isElementWithoutContent(node)) {
                node = this._removeAndGetNext(node);
                continue;
              } else if (this._hasSingleTagInsideElement(node, "DIV") || this._hasSingleTagInsideElement(node, "SECTION")) {
                var child = node.children[0];
                for (var i = 0; i < node.attributes.length; i++) {
                  child.setAttribute(node.attributes[i].name, node.attributes[i].value);
                }
                node.parentNode.replaceChild(child, node);
                node = child;
                continue;
              }
            }
            node = this._getNextNode(node);
          }
        },
        /**
         * Get the article title as an H1.
         *
         * @return string
         **/
        _getArticleTitle: function() {
          var doc = this._doc;
          var curTitle = "";
          var origTitle = "";
          try {
            curTitle = origTitle = doc.title.trim();
            if (typeof curTitle !== "string")
              curTitle = origTitle = this._getInnerText(doc.getElementsByTagName("title")[0]);
          } catch (e) {
          }
          var titleHadHierarchicalSeparators = false;
          function wordCount(str) {
            return str.split(/\s+/).length;
          }
          if (/ [\|\-\\\/>»] /.test(curTitle)) {
            titleHadHierarchicalSeparators = / [\\\/>»] /.test(curTitle);
            curTitle = origTitle.replace(/(.*)[\|\-\\\/>»] .*/gi, "$1");
            if (wordCount(curTitle) < 3)
              curTitle = origTitle.replace(/[^\|\-\\\/>»]*[\|\-\\\/>»](.*)/gi, "$1");
          } else if (curTitle.indexOf(": ") !== -1) {
            var headings = this._concatNodeLists(
              doc.getElementsByTagName("h1"),
              doc.getElementsByTagName("h2")
            );
            var trimmedTitle = curTitle.trim();
            var match = this._someNode(headings, function(heading) {
              return heading.textContent.trim() === trimmedTitle;
            });
            if (!match) {
              curTitle = origTitle.substring(origTitle.lastIndexOf(":") + 1);
              if (wordCount(curTitle) < 3) {
                curTitle = origTitle.substring(origTitle.indexOf(":") + 1);
              } else if (wordCount(origTitle.substr(0, origTitle.indexOf(":"))) > 5) {
                curTitle = origTitle;
              }
            }
          } else if (curTitle.length > 150 || curTitle.length < 15) {
            var hOnes = doc.getElementsByTagName("h1");
            if (hOnes.length === 1)
              curTitle = this._getInnerText(hOnes[0]);
          }
          curTitle = curTitle.trim().replace(this.REGEXPS.normalize, " ");
          var curTitleWordCount = wordCount(curTitle);
          if (curTitleWordCount <= 4 && (!titleHadHierarchicalSeparators || curTitleWordCount != wordCount(origTitle.replace(/[\|\-\\\/>»]+/g, "")) - 1)) {
            curTitle = origTitle;
          }
          return curTitle;
        },
        /**
         * Prepare the HTML document for readability to scrape it.
         * This includes things like stripping javascript, CSS, and handling terrible markup.
         *
         * @return void
         **/
        _prepDocument: function() {
          var doc = this._doc;
          this._removeNodes(this._getAllNodesWithTag(doc, ["style"]));
          if (doc.body) {
            this._replaceBrs(doc.body);
          }
          this._replaceNodeTags(this._getAllNodesWithTag(doc, ["font"]), "SPAN");
        },
        /**
         * Finds the next node, starting from the given node, and ignoring
         * whitespace in between. If the given node is an element, the same node is
         * returned.
         */
        _nextNode: function(node) {
          var next2 = node;
          while (next2 && next2.nodeType != this.ELEMENT_NODE && this.REGEXPS.whitespace.test(next2.textContent)) {
            next2 = next2.nextSibling;
          }
          return next2;
        },
        /**
         * Replaces 2 or more successive <br> elements with a single <p>.
         * Whitespace between <br> elements are ignored. For example:
         *   <div>foo<br>bar<br> <br><br>abc</div>
         * will become:
         *   <div>foo<br>bar<p>abc</p></div>
         */
        _replaceBrs: function(elem) {
          this._forEachNode(this._getAllNodesWithTag(elem, ["br"]), function(br) {
            var next2 = br.nextSibling;
            var replaced = false;
            while ((next2 = this._nextNode(next2)) && next2.tagName == "BR") {
              replaced = true;
              var brSibling = next2.nextSibling;
              next2.parentNode.removeChild(next2);
              next2 = brSibling;
            }
            if (replaced) {
              var p2 = this._doc.createElement("p");
              br.parentNode.replaceChild(p2, br);
              next2 = p2.nextSibling;
              while (next2) {
                if (next2.tagName == "BR") {
                  var nextElem = this._nextNode(next2.nextSibling);
                  if (nextElem && nextElem.tagName == "BR")
                    break;
                }
                if (!this._isPhrasingContent(next2))
                  break;
                var sibling = next2.nextSibling;
                p2.appendChild(next2);
                next2 = sibling;
              }
              while (p2.lastChild && this._isWhitespace(p2.lastChild)) {
                p2.removeChild(p2.lastChild);
              }
              if (p2.parentNode.tagName === "P")
                this._setNodeTag(p2.parentNode, "DIV");
            }
          });
        },
        _setNodeTag: function(node, tag) {
          this.log("_setNodeTag", node, tag);
          if (this._docJSDOMParser) {
            node.localName = tag.toLowerCase();
            node.tagName = tag.toUpperCase();
            return node;
          }
          var replacement = node.ownerDocument.createElement(tag);
          while (node.firstChild) {
            replacement.appendChild(node.firstChild);
          }
          node.parentNode.replaceChild(replacement, node);
          if (node.readability)
            replacement.readability = node.readability;
          for (var i = 0; i < node.attributes.length; i++) {
            try {
              replacement.setAttribute(node.attributes[i].name, node.attributes[i].value);
            } catch (ex) {
            }
          }
          return replacement;
        },
        /**
         * Prepare the article node for display. Clean out any inline styles,
         * iframes, forms, strip extraneous <p> tags, etc.
         *
         * @param Element
         * @return void
         **/
        _prepArticle: function(articleContent) {
          this._cleanStyles(articleContent);
          this._markDataTables(articleContent);
          this._fixLazyImages(articleContent);
          this._cleanConditionally(articleContent, "form");
          this._cleanConditionally(articleContent, "fieldset");
          this._clean(articleContent, "object");
          this._clean(articleContent, "embed");
          this._clean(articleContent, "footer");
          this._clean(articleContent, "link");
          this._clean(articleContent, "aside");
          var shareElementThreshold = this.DEFAULT_CHAR_THRESHOLD;
          this._forEachNode(articleContent.children, function(topCandidate) {
            this._cleanMatchedNodes(topCandidate, function(node, matchString) {
              return this.REGEXPS.shareElements.test(matchString) && node.textContent.length < shareElementThreshold;
            });
          });
          this._clean(articleContent, "iframe");
          this._clean(articleContent, "input");
          this._clean(articleContent, "textarea");
          this._clean(articleContent, "select");
          this._clean(articleContent, "button");
          this._cleanHeaders(articleContent);
          this._cleanConditionally(articleContent, "table");
          this._cleanConditionally(articleContent, "ul");
          this._cleanConditionally(articleContent, "div");
          this._replaceNodeTags(this._getAllNodesWithTag(articleContent, ["h1"]), "h2");
          this._removeNodes(this._getAllNodesWithTag(articleContent, ["p"]), function(paragraph) {
            var imgCount = paragraph.getElementsByTagName("img").length;
            var embedCount = paragraph.getElementsByTagName("embed").length;
            var objectCount = paragraph.getElementsByTagName("object").length;
            var iframeCount = paragraph.getElementsByTagName("iframe").length;
            var totalCount = imgCount + embedCount + objectCount + iframeCount;
            return totalCount === 0 && !this._getInnerText(paragraph, false);
          });
          this._forEachNode(this._getAllNodesWithTag(articleContent, ["br"]), function(br) {
            var next2 = this._nextNode(br.nextSibling);
            if (next2 && next2.tagName == "P")
              br.parentNode.removeChild(br);
          });
          this._forEachNode(this._getAllNodesWithTag(articleContent, ["table"]), function(table) {
            var tbody3 = this._hasSingleTagInsideElement(table, "TBODY") ? table.firstElementChild : table;
            if (this._hasSingleTagInsideElement(tbody3, "TR")) {
              var row = tbody3.firstElementChild;
              if (this._hasSingleTagInsideElement(row, "TD")) {
                var cell2 = row.firstElementChild;
                cell2 = this._setNodeTag(cell2, this._everyNode(cell2.childNodes, this._isPhrasingContent) ? "P" : "DIV");
                table.parentNode.replaceChild(cell2, table);
              }
            }
          });
        },
        /**
         * Initialize a node with the readability object. Also checks the
         * className/id for special names to add to its score.
         *
         * @param Element
         * @return void
        **/
        _initializeNode: function(node) {
          node.readability = { "contentScore": 0 };
          switch (node.tagName) {
            case "DIV":
              node.readability.contentScore += 5;
              break;
            case "PRE":
            case "TD":
            case "BLOCKQUOTE":
              node.readability.contentScore += 3;
              break;
            case "ADDRESS":
            case "OL":
            case "UL":
            case "DL":
            case "DD":
            case "DT":
            case "LI":
            case "FORM":
              node.readability.contentScore -= 3;
              break;
            case "H1":
            case "H2":
            case "H3":
            case "H4":
            case "H5":
            case "H6":
            case "TH":
              node.readability.contentScore -= 5;
              break;
          }
          node.readability.contentScore += this._getClassWeight(node);
        },
        _removeAndGetNext: function(node) {
          var nextNode = this._getNextNode(node, true);
          node.parentNode.removeChild(node);
          return nextNode;
        },
        /**
         * Traverse the DOM from node to node, starting at the node passed in.
         * Pass true for the second parameter to indicate this node itself
         * (and its kids) are going away, and we want the next node over.
         *
         * Calling this in a loop will traverse the DOM depth-first.
         */
        _getNextNode: function(node, ignoreSelfAndKids) {
          if (!ignoreSelfAndKids && node.firstElementChild) {
            return node.firstElementChild;
          }
          if (node.nextElementSibling) {
            return node.nextElementSibling;
          }
          do {
            node = node.parentNode;
          } while (node && !node.nextElementSibling);
          return node && node.nextElementSibling;
        },
        // compares second text to first one
        // 1 = same text, 0 = completely different text
        // works the way that it splits both texts into words and then finds words that are unique in second text
        // the result is given by the lower length of unique parts
        _textSimilarity: function(textA, textB) {
          var tokensA = textA.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);
          var tokensB = textB.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);
          if (!tokensA.length || !tokensB.length) {
            return 0;
          }
          var uniqTokensB = tokensB.filter((token) => !tokensA.includes(token));
          var distanceB = uniqTokensB.join(" ").length / tokensB.join(" ").length;
          return 1 - distanceB;
        },
        _checkByline: function(node, matchString) {
          if (this._articleByline) {
            return false;
          }
          if (node.getAttribute !== void 0) {
            var rel = node.getAttribute("rel");
            var itemprop = node.getAttribute("itemprop");
          }
          if ((rel === "author" || itemprop && itemprop.indexOf("author") !== -1 || this.REGEXPS.byline.test(matchString)) && this._isValidByline(node.textContent)) {
            this._articleByline = node.textContent.trim();
            return true;
          }
          return false;
        },
        _getNodeAncestors: function(node, maxDepth) {
          maxDepth = maxDepth || 0;
          var i = 0, ancestors = [];
          while (node.parentNode) {
            ancestors.push(node.parentNode);
            if (maxDepth && ++i === maxDepth)
              break;
            node = node.parentNode;
          }
          return ancestors;
        },
        /***
         * grabArticle - Using a variety of metrics (content score, classname, element types), find the content that is
         *         most likely to be the stuff a user wants to read. Then return it wrapped up in a div.
         *
         * @param page a document to run upon. Needs to be a full document, complete with body.
         * @return Element
        **/
        _grabArticle: function(page) {
          this.log("**** grabArticle ****");
          var doc = this._doc;
          var isPaging = page !== null;
          page = page ? page : this._doc.body;
          if (!page) {
            this.log("No body found in document. Abort.");
            return null;
          }
          var pageCacheHtml = page.innerHTML;
          while (true) {
            this.log("Starting grabArticle loop");
            var stripUnlikelyCandidates = this._flagIsActive(this.FLAG_STRIP_UNLIKELYS);
            var elementsToScore = [];
            var node = this._doc.documentElement;
            let shouldRemoveTitleHeader = true;
            while (node) {
              if (node.tagName === "HTML") {
                this._articleLang = node.getAttribute("lang");
              }
              var matchString = node.className + " " + node.id;
              if (!this._isProbablyVisible(node)) {
                this.log("Removing hidden node - " + matchString);
                node = this._removeAndGetNext(node);
                continue;
              }
              if (node.getAttribute("aria-modal") == "true" && node.getAttribute("role") == "dialog") {
                node = this._removeAndGetNext(node);
                continue;
              }
              if (this._checkByline(node, matchString)) {
                node = this._removeAndGetNext(node);
                continue;
              }
              if (shouldRemoveTitleHeader && this._headerDuplicatesTitle(node)) {
                this.log("Removing header: ", node.textContent.trim(), this._articleTitle.trim());
                shouldRemoveTitleHeader = false;
                node = this._removeAndGetNext(node);
                continue;
              }
              if (stripUnlikelyCandidates) {
                if (this.REGEXPS.unlikelyCandidates.test(matchString) && !this.REGEXPS.okMaybeItsACandidate.test(matchString) && !this._hasAncestorTag(node, "table") && !this._hasAncestorTag(node, "code") && node.tagName !== "BODY" && node.tagName !== "A") {
                  this.log("Removing unlikely candidate - " + matchString);
                  node = this._removeAndGetNext(node);
                  continue;
                }
                if (this.UNLIKELY_ROLES.includes(node.getAttribute("role"))) {
                  this.log("Removing content with role " + node.getAttribute("role") + " - " + matchString);
                  node = this._removeAndGetNext(node);
                  continue;
                }
              }
              if ((node.tagName === "DIV" || node.tagName === "SECTION" || node.tagName === "HEADER" || node.tagName === "H1" || node.tagName === "H2" || node.tagName === "H3" || node.tagName === "H4" || node.tagName === "H5" || node.tagName === "H6") && this._isElementWithoutContent(node)) {
                node = this._removeAndGetNext(node);
                continue;
              }
              if (this.DEFAULT_TAGS_TO_SCORE.indexOf(node.tagName) !== -1) {
                elementsToScore.push(node);
              }
              if (node.tagName === "DIV") {
                var p2 = null;
                var childNode = node.firstChild;
                while (childNode) {
                  var nextSibling = childNode.nextSibling;
                  if (this._isPhrasingContent(childNode)) {
                    if (p2 !== null) {
                      p2.appendChild(childNode);
                    } else if (!this._isWhitespace(childNode)) {
                      p2 = doc.createElement("p");
                      node.replaceChild(p2, childNode);
                      p2.appendChild(childNode);
                    }
                  } else if (p2 !== null) {
                    while (p2.lastChild && this._isWhitespace(p2.lastChild)) {
                      p2.removeChild(p2.lastChild);
                    }
                    p2 = null;
                  }
                  childNode = nextSibling;
                }
                if (this._hasSingleTagInsideElement(node, "P") && this._getLinkDensity(node) < 0.25) {
                  var newNode = node.children[0];
                  node.parentNode.replaceChild(newNode, node);
                  node = newNode;
                  elementsToScore.push(node);
                } else if (!this._hasChildBlockElement(node)) {
                  node = this._setNodeTag(node, "P");
                  elementsToScore.push(node);
                }
              }
              node = this._getNextNode(node);
            }
            var candidates = [];
            this._forEachNode(elementsToScore, function(elementToScore) {
              if (!elementToScore.parentNode || typeof elementToScore.parentNode.tagName === "undefined")
                return;
              var innerText = this._getInnerText(elementToScore);
              if (innerText.length < 25)
                return;
              var ancestors2 = this._getNodeAncestors(elementToScore, 5);
              if (ancestors2.length === 0)
                return;
              var contentScore = 0;
              contentScore += 1;
              contentScore += innerText.split(this.REGEXPS.commas).length;
              contentScore += Math.min(Math.floor(innerText.length / 100), 3);
              this._forEachNode(ancestors2, function(ancestor, level) {
                if (!ancestor.tagName || !ancestor.parentNode || typeof ancestor.parentNode.tagName === "undefined")
                  return;
                if (typeof ancestor.readability === "undefined") {
                  this._initializeNode(ancestor);
                  candidates.push(ancestor);
                }
                if (level === 0)
                  var scoreDivider = 1;
                else if (level === 1)
                  scoreDivider = 2;
                else
                  scoreDivider = level * 3;
                ancestor.readability.contentScore += contentScore / scoreDivider;
              });
            });
            var topCandidates = [];
            for (var c = 0, cl = candidates.length; c < cl; c += 1) {
              var candidate = candidates[c];
              var candidateScore = candidate.readability.contentScore * (1 - this._getLinkDensity(candidate));
              candidate.readability.contentScore = candidateScore;
              this.log("Candidate:", candidate, "with score " + candidateScore);
              for (var t = 0; t < this._nbTopCandidates; t++) {
                var aTopCandidate = topCandidates[t];
                if (!aTopCandidate || candidateScore > aTopCandidate.readability.contentScore) {
                  topCandidates.splice(t, 0, candidate);
                  if (topCandidates.length > this._nbTopCandidates)
                    topCandidates.pop();
                  break;
                }
              }
            }
            var topCandidate = topCandidates[0] || null;
            var neededToCreateTopCandidate = false;
            var parentOfTopCandidate;
            if (topCandidate === null || topCandidate.tagName === "BODY") {
              topCandidate = doc.createElement("DIV");
              neededToCreateTopCandidate = true;
              while (page.firstChild) {
                this.log("Moving child out:", page.firstChild);
                topCandidate.appendChild(page.firstChild);
              }
              page.appendChild(topCandidate);
              this._initializeNode(topCandidate);
            } else if (topCandidate) {
              var alternativeCandidateAncestors = [];
              for (var i = 1; i < topCandidates.length; i++) {
                if (topCandidates[i].readability.contentScore / topCandidate.readability.contentScore >= 0.75) {
                  alternativeCandidateAncestors.push(this._getNodeAncestors(topCandidates[i]));
                }
              }
              var MINIMUM_TOPCANDIDATES = 3;
              if (alternativeCandidateAncestors.length >= MINIMUM_TOPCANDIDATES) {
                parentOfTopCandidate = topCandidate.parentNode;
                while (parentOfTopCandidate.tagName !== "BODY") {
                  var listsContainingThisAncestor = 0;
                  for (var ancestorIndex = 0; ancestorIndex < alternativeCandidateAncestors.length && listsContainingThisAncestor < MINIMUM_TOPCANDIDATES; ancestorIndex++) {
                    listsContainingThisAncestor += Number(alternativeCandidateAncestors[ancestorIndex].includes(parentOfTopCandidate));
                  }
                  if (listsContainingThisAncestor >= MINIMUM_TOPCANDIDATES) {
                    topCandidate = parentOfTopCandidate;
                    break;
                  }
                  parentOfTopCandidate = parentOfTopCandidate.parentNode;
                }
              }
              if (!topCandidate.readability) {
                this._initializeNode(topCandidate);
              }
              parentOfTopCandidate = topCandidate.parentNode;
              var lastScore = topCandidate.readability.contentScore;
              var scoreThreshold = lastScore / 3;
              while (parentOfTopCandidate.tagName !== "BODY") {
                if (!parentOfTopCandidate.readability) {
                  parentOfTopCandidate = parentOfTopCandidate.parentNode;
                  continue;
                }
                var parentScore = parentOfTopCandidate.readability.contentScore;
                if (parentScore < scoreThreshold)
                  break;
                if (parentScore > lastScore) {
                  topCandidate = parentOfTopCandidate;
                  break;
                }
                lastScore = parentOfTopCandidate.readability.contentScore;
                parentOfTopCandidate = parentOfTopCandidate.parentNode;
              }
              parentOfTopCandidate = topCandidate.parentNode;
              while (parentOfTopCandidate.tagName != "BODY" && parentOfTopCandidate.children.length == 1) {
                topCandidate = parentOfTopCandidate;
                parentOfTopCandidate = topCandidate.parentNode;
              }
              if (!topCandidate.readability) {
                this._initializeNode(topCandidate);
              }
            }
            var articleContent = doc.createElement("DIV");
            if (isPaging)
              articleContent.id = "readability-content";
            var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2);
            parentOfTopCandidate = topCandidate.parentNode;
            var siblings2 = parentOfTopCandidate.children;
            for (var s2 = 0, sl = siblings2.length; s2 < sl; s2++) {
              var sibling = siblings2[s2];
              var append = false;
              this.log("Looking at sibling node:", sibling, sibling.readability ? "with score " + sibling.readability.contentScore : "");
              this.log("Sibling has score", sibling.readability ? sibling.readability.contentScore : "Unknown");
              if (sibling === topCandidate) {
                append = true;
              } else {
                var contentBonus = 0;
                if (sibling.className === topCandidate.className && topCandidate.className !== "")
                  contentBonus += topCandidate.readability.contentScore * 0.2;
                if (sibling.readability && sibling.readability.contentScore + contentBonus >= siblingScoreThreshold) {
                  append = true;
                } else if (sibling.nodeName === "P") {
                  var linkDensity = this._getLinkDensity(sibling);
                  var nodeContent = this._getInnerText(sibling);
                  var nodeLength = nodeContent.length;
                  if (nodeLength > 80 && linkDensity < 0.25) {
                    append = true;
                  } else if (nodeLength < 80 && nodeLength > 0 && linkDensity === 0 && nodeContent.search(/\.( |$)/) !== -1) {
                    append = true;
                  }
                }
              }
              if (append) {
                this.log("Appending node:", sibling);
                if (this.ALTER_TO_DIV_EXCEPTIONS.indexOf(sibling.nodeName) === -1) {
                  this.log("Altering sibling:", sibling, "to div.");
                  sibling = this._setNodeTag(sibling, "DIV");
                }
                articleContent.appendChild(sibling);
                siblings2 = parentOfTopCandidate.children;
                s2 -= 1;
                sl -= 1;
              }
            }
            if (this._debug)
              this.log("Article content pre-prep: " + articleContent.innerHTML);
            this._prepArticle(articleContent);
            if (this._debug)
              this.log("Article content post-prep: " + articleContent.innerHTML);
            if (neededToCreateTopCandidate) {
              topCandidate.id = "readability-page-1";
              topCandidate.className = "page";
            } else {
              var div = doc.createElement("DIV");
              div.id = "readability-page-1";
              div.className = "page";
              while (articleContent.firstChild) {
                div.appendChild(articleContent.firstChild);
              }
              articleContent.appendChild(div);
            }
            if (this._debug)
              this.log("Article content after paging: " + articleContent.innerHTML);
            var parseSuccessful = true;
            var textLength = this._getInnerText(articleContent, true).length;
            if (textLength < this._charThreshold) {
              parseSuccessful = false;
              page.innerHTML = pageCacheHtml;
              if (this._flagIsActive(this.FLAG_STRIP_UNLIKELYS)) {
                this._removeFlag(this.FLAG_STRIP_UNLIKELYS);
                this._attempts.push({ articleContent, textLength });
              } else if (this._flagIsActive(this.FLAG_WEIGHT_CLASSES)) {
                this._removeFlag(this.FLAG_WEIGHT_CLASSES);
                this._attempts.push({ articleContent, textLength });
              } else if (this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY)) {
                this._removeFlag(this.FLAG_CLEAN_CONDITIONALLY);
                this._attempts.push({ articleContent, textLength });
              } else {
                this._attempts.push({ articleContent, textLength });
                this._attempts.sort(function(a, b) {
                  return b.textLength - a.textLength;
                });
                if (!this._attempts[0].textLength) {
                  return null;
                }
                articleContent = this._attempts[0].articleContent;
                parseSuccessful = true;
              }
            }
            if (parseSuccessful) {
              var ancestors = [parentOfTopCandidate, topCandidate].concat(this._getNodeAncestors(parentOfTopCandidate));
              this._someNode(ancestors, function(ancestor) {
                if (!ancestor.tagName)
                  return false;
                var articleDir = ancestor.getAttribute("dir");
                if (articleDir) {
                  this._articleDir = articleDir;
                  return true;
                }
                return false;
              });
              return articleContent;
            }
          }
        },
        /**
         * Check whether the input string could be a byline.
         * This verifies that the input is a string, and that the length
         * is less than 100 chars.
         *
         * @param possibleByline {string} - a string to check whether its a byline.
         * @return Boolean - whether the input string is a byline.
         */
        _isValidByline: function(byline) {
          if (typeof byline == "string" || byline instanceof String) {
            byline = byline.trim();
            return byline.length > 0 && byline.length < 100;
          }
          return false;
        },
        /**
         * Converts some of the common HTML entities in string to their corresponding characters.
         *
         * @param str {string} - a string to unescape.
         * @return string without HTML entity.
         */
        _unescapeHtmlEntities: function(str) {
          if (!str) {
            return str;
          }
          var htmlEscapeMap = this.HTML_ESCAPE_MAP;
          return str.replace(/&(quot|amp|apos|lt|gt);/g, function(_, tag) {
            return htmlEscapeMap[tag];
          }).replace(/&#(?:x([0-9a-z]{1,4})|([0-9]{1,4}));/gi, function(_, hex, numStr) {
            var num = parseInt(hex || numStr, hex ? 16 : 10);
            return String.fromCharCode(num);
          });
        },
        /**
         * Try to extract metadata from JSON-LD object.
         * For now, only Schema.org objects of type Article or its subtypes are supported.
         * @return Object with any metadata that could be extracted (possibly none)
         */
        _getJSONLD: function(doc) {
          var scripts = this._getAllNodesWithTag(doc, ["script"]);
          var metadata;
          this._forEachNode(scripts, function(jsonLdElement) {
            if (!metadata && jsonLdElement.getAttribute("type") === "application/ld+json") {
              try {
                var content = jsonLdElement.textContent.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, "");
                var parsed = JSON.parse(content);
                if (!parsed["@context"] || !parsed["@context"].match(/^https?\:\/\/schema\.org$/)) {
                  return;
                }
                if (!parsed["@type"] && Array.isArray(parsed["@graph"])) {
                  parsed = parsed["@graph"].find(function(it) {
                    return (it["@type"] || "").match(
                      this.REGEXPS.jsonLdArticleTypes
                    );
                  });
                }
                if (!parsed || !parsed["@type"] || !parsed["@type"].match(this.REGEXPS.jsonLdArticleTypes)) {
                  return;
                }
                metadata = {};
                if (typeof parsed.name === "string" && typeof parsed.headline === "string" && parsed.name !== parsed.headline) {
                  var title = this._getArticleTitle();
                  var nameMatches = this._textSimilarity(parsed.name, title) > 0.75;
                  var headlineMatches = this._textSimilarity(parsed.headline, title) > 0.75;
                  if (headlineMatches && !nameMatches) {
                    metadata.title = parsed.headline;
                  } else {
                    metadata.title = parsed.name;
                  }
                } else if (typeof parsed.name === "string") {
                  metadata.title = parsed.name.trim();
                } else if (typeof parsed.headline === "string") {
                  metadata.title = parsed.headline.trim();
                }
                if (parsed.author) {
                  if (typeof parsed.author.name === "string") {
                    metadata.byline = parsed.author.name.trim();
                  } else if (Array.isArray(parsed.author) && parsed.author[0] && typeof parsed.author[0].name === "string") {
                    metadata.byline = parsed.author.filter(function(author) {
                      return author && typeof author.name === "string";
                    }).map(function(author) {
                      return author.name.trim();
                    }).join(", ");
                  }
                }
                if (typeof parsed.description === "string") {
                  metadata.excerpt = parsed.description.trim();
                }
                if (parsed.publisher && typeof parsed.publisher.name === "string") {
                  metadata.siteName = parsed.publisher.name.trim();
                }
                if (typeof parsed.datePublished === "string") {
                  metadata.datePublished = parsed.datePublished.trim();
                }
                return;
              } catch (err) {
                this.log(err.message);
              }
            }
          });
          return metadata ? metadata : {};
        },
        /**
         * Attempts to get excerpt and byline metadata for the article.
         *
         * @param {Object} jsonld — object containing any metadata that
         * could be extracted from JSON-LD object.
         *
         * @return Object with optional "excerpt" and "byline" properties
         */
        _getArticleMetadata: function(jsonld) {
          var metadata = {};
          var values = {};
          var metaElements = this._doc.getElementsByTagName("meta");
          var propertyPattern = /\s*(article|dc|dcterm|og|twitter)\s*:\s*(author|creator|description|published_time|title|site_name)\s*/gi;
          var namePattern = /^\s*(?:(dc|dcterm|og|twitter|weibo:(article|webpage))\s*[\.:]\s*)?(author|creator|description|title|site_name)\s*$/i;
          this._forEachNode(metaElements, function(element3) {
            var elementName = element3.getAttribute("name");
            var elementProperty = element3.getAttribute("property");
            var content = element3.getAttribute("content");
            if (!content) {
              return;
            }
            var matches2 = null;
            var name2 = null;
            if (elementProperty) {
              matches2 = elementProperty.match(propertyPattern);
              if (matches2) {
                name2 = matches2[0].toLowerCase().replace(/\s/g, "");
                values[name2] = content.trim();
              }
            }
            if (!matches2 && elementName && namePattern.test(elementName)) {
              name2 = elementName;
              if (content) {
                name2 = name2.toLowerCase().replace(/\s/g, "").replace(/\./g, ":");
                values[name2] = content.trim();
              }
            }
          });
          metadata.title = jsonld.title || values["dc:title"] || values["dcterm:title"] || values["og:title"] || values["weibo:article:title"] || values["weibo:webpage:title"] || values["title"] || values["twitter:title"];
          if (!metadata.title) {
            metadata.title = this._getArticleTitle();
          }
          metadata.byline = jsonld.byline || values["dc:creator"] || values["dcterm:creator"] || values["author"];
          metadata.excerpt = jsonld.excerpt || values["dc:description"] || values["dcterm:description"] || values["og:description"] || values["weibo:article:description"] || values["weibo:webpage:description"] || values["description"] || values["twitter:description"];
          metadata.siteName = jsonld.siteName || values["og:site_name"];
          metadata.publishedTime = jsonld.datePublished || values["article:published_time"] || null;
          metadata.title = this._unescapeHtmlEntities(metadata.title);
          metadata.byline = this._unescapeHtmlEntities(metadata.byline);
          metadata.excerpt = this._unescapeHtmlEntities(metadata.excerpt);
          metadata.siteName = this._unescapeHtmlEntities(metadata.siteName);
          metadata.publishedTime = this._unescapeHtmlEntities(metadata.publishedTime);
          return metadata;
        },
        /**
         * Check if node is image, or if node contains exactly only one image
         * whether as a direct child or as its descendants.
         *
         * @param Element
        **/
        _isSingleImage: function(node) {
          if (node.tagName === "IMG") {
            return true;
          }
          if (node.children.length !== 1 || node.textContent.trim() !== "") {
            return false;
          }
          return this._isSingleImage(node.children[0]);
        },
        /**
         * Find all <noscript> that are located after <img> nodes, and which contain only one
         * <img> element. Replace the first image with the image from inside the <noscript> tag,
         * and remove the <noscript> tag. This improves the quality of the images we use on
         * some sites (e.g. Medium).
         *
         * @param Element
        **/
        _unwrapNoscriptImages: function(doc) {
          var imgs = Array.from(doc.getElementsByTagName("img"));
          this._forEachNode(imgs, function(img) {
            for (var i = 0; i < img.attributes.length; i++) {
              var attr = img.attributes[i];
              switch (attr.name) {
                case "src":
                case "srcset":
                case "data-src":
                case "data-srcset":
                  return;
              }
              if (/\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
                return;
              }
            }
            img.parentNode.removeChild(img);
          });
          var noscripts = Array.from(doc.getElementsByTagName("noscript"));
          this._forEachNode(noscripts, function(noscript) {
            var tmp = doc.createElement("div");
            tmp.innerHTML = noscript.innerHTML;
            if (!this._isSingleImage(tmp)) {
              return;
            }
            var prevElement = noscript.previousElementSibling;
            if (prevElement && this._isSingleImage(prevElement)) {
              var prevImg = prevElement;
              if (prevImg.tagName !== "IMG") {
                prevImg = prevElement.getElementsByTagName("img")[0];
              }
              var newImg = tmp.getElementsByTagName("img")[0];
              for (var i = 0; i < prevImg.attributes.length; i++) {
                var attr = prevImg.attributes[i];
                if (attr.value === "") {
                  continue;
                }
                if (attr.name === "src" || attr.name === "srcset" || /\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
                  if (newImg.getAttribute(attr.name) === attr.value) {
                    continue;
                  }
                  var attrName = attr.name;
                  if (newImg.hasAttribute(attrName)) {
                    attrName = "data-old-" + attrName;
                  }
                  newImg.setAttribute(attrName, attr.value);
                }
              }
              noscript.parentNode.replaceChild(tmp.firstElementChild, prevElement);
            }
          });
        },
        /**
         * Removes script tags from the document.
         *
         * @param Element
        **/
        _removeScripts: function(doc) {
          this._removeNodes(this._getAllNodesWithTag(doc, ["script", "noscript"]));
        },
        /**
         * Check if this node has only whitespace and a single element with given tag
         * Returns false if the DIV node contains non-empty text nodes
         * or if it contains no element with given tag or more than 1 element.
         *
         * @param Element
         * @param string tag of child element
        **/
        _hasSingleTagInsideElement: function(element3, tag) {
          if (element3.children.length != 1 || element3.children[0].tagName !== tag) {
            return false;
          }
          return !this._someNode(element3.childNodes, function(node) {
            return node.nodeType === this.TEXT_NODE && this.REGEXPS.hasContent.test(node.textContent);
          });
        },
        _isElementWithoutContent: function(node) {
          return node.nodeType === this.ELEMENT_NODE && node.textContent.trim().length == 0 && (node.children.length == 0 || node.children.length == node.getElementsByTagName("br").length + node.getElementsByTagName("hr").length);
        },
        /**
         * Determine whether element has any children block level elements.
         *
         * @param Element
         */
        _hasChildBlockElement: function(element3) {
          return this._someNode(element3.childNodes, function(node) {
            return this.DIV_TO_P_ELEMS.has(node.tagName) || this._hasChildBlockElement(node);
          });
        },
        /***
         * Determine if a node qualifies as phrasing content.
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content
        **/
        _isPhrasingContent: function(node) {
          return node.nodeType === this.TEXT_NODE || this.PHRASING_ELEMS.indexOf(node.tagName) !== -1 || (node.tagName === "A" || node.tagName === "DEL" || node.tagName === "INS") && this._everyNode(node.childNodes, this._isPhrasingContent);
        },
        _isWhitespace: function(node) {
          return node.nodeType === this.TEXT_NODE && node.textContent.trim().length === 0 || node.nodeType === this.ELEMENT_NODE && node.tagName === "BR";
        },
        /**
         * Get the inner text of a node - cross browser compatibly.
         * This also strips out any excess whitespace to be found.
         *
         * @param Element
         * @param Boolean normalizeSpaces (default: true)
         * @return string
        **/
        _getInnerText: function(e, normalizeSpaces) {
          normalizeSpaces = typeof normalizeSpaces === "undefined" ? true : normalizeSpaces;
          var textContent = e.textContent.trim();
          if (normalizeSpaces) {
            return textContent.replace(this.REGEXPS.normalize, " ");
          }
          return textContent;
        },
        /**
         * Get the number of times a string s appears in the node e.
         *
         * @param Element
         * @param string - what to split on. Default is ","
         * @return number (integer)
        **/
        _getCharCount: function(e, s2) {
          s2 = s2 || ",";
          return this._getInnerText(e).split(s2).length - 1;
        },
        /**
         * Remove the style attribute on every e and under.
         * TODO: Test if getElementsByTagName(*) is faster.
         *
         * @param Element
         * @return void
        **/
        _cleanStyles: function(e) {
          if (!e || e.tagName.toLowerCase() === "svg")
            return;
          for (var i = 0; i < this.PRESENTATIONAL_ATTRIBUTES.length; i++) {
            e.removeAttribute(this.PRESENTATIONAL_ATTRIBUTES[i]);
          }
          if (this.DEPRECATED_SIZE_ATTRIBUTE_ELEMS.indexOf(e.tagName) !== -1) {
            e.removeAttribute("width");
            e.removeAttribute("height");
          }
          var cur = e.firstElementChild;
          while (cur !== null) {
            this._cleanStyles(cur);
            cur = cur.nextElementSibling;
          }
        },
        /**
         * Get the density of links as a percentage of the content
         * This is the amount of text that is inside a link divided by the total text in the node.
         *
         * @param Element
         * @return number (float)
        **/
        _getLinkDensity: function(element3) {
          var textLength = this._getInnerText(element3).length;
          if (textLength === 0)
            return 0;
          var linkLength = 0;
          this._forEachNode(element3.getElementsByTagName("a"), function(linkNode) {
            var href = linkNode.getAttribute("href");
            var coefficient = href && this.REGEXPS.hashUrl.test(href) ? 0.3 : 1;
            linkLength += this._getInnerText(linkNode).length * coefficient;
          });
          return linkLength / textLength;
        },
        /**
         * Get an elements class/id weight. Uses regular expressions to tell if this
         * element looks good or bad.
         *
         * @param Element
         * @return number (Integer)
        **/
        _getClassWeight: function(e) {
          if (!this._flagIsActive(this.FLAG_WEIGHT_CLASSES))
            return 0;
          var weight = 0;
          if (typeof e.className === "string" && e.className !== "") {
            if (this.REGEXPS.negative.test(e.className))
              weight -= 25;
            if (this.REGEXPS.positive.test(e.className))
              weight += 25;
          }
          if (typeof e.id === "string" && e.id !== "") {
            if (this.REGEXPS.negative.test(e.id))
              weight -= 25;
            if (this.REGEXPS.positive.test(e.id))
              weight += 25;
          }
          return weight;
        },
        /**
         * Clean a node of all elements of type "tag".
         * (Unless it's a youtube/vimeo video. People love movies.)
         *
         * @param Element
         * @param string tag to clean
         * @return void
         **/
        _clean: function(e, tag) {
          var isEmbed = ["object", "embed", "iframe"].indexOf(tag) !== -1;
          this._removeNodes(this._getAllNodesWithTag(e, [tag]), function(element3) {
            if (isEmbed) {
              for (var i = 0; i < element3.attributes.length; i++) {
                if (this._allowedVideoRegex.test(element3.attributes[i].value)) {
                  return false;
                }
              }
              if (element3.tagName === "object" && this._allowedVideoRegex.test(element3.innerHTML)) {
                return false;
              }
            }
            return true;
          });
        },
        /**
         * Check if a given node has one of its ancestor tag name matching the
         * provided one.
         * @param  HTMLElement node
         * @param  String      tagName
         * @param  Number      maxDepth
         * @param  Function    filterFn a filter to invoke to determine whether this node 'counts'
         * @return Boolean
         */
        _hasAncestorTag: function(node, tagName, maxDepth, filterFn) {
          maxDepth = maxDepth || 3;
          tagName = tagName.toUpperCase();
          var depth = 0;
          while (node.parentNode) {
            if (maxDepth > 0 && depth > maxDepth)
              return false;
            if (node.parentNode.tagName === tagName && (!filterFn || filterFn(node.parentNode)))
              return true;
            node = node.parentNode;
            depth++;
          }
          return false;
        },
        /**
         * Return an object indicating how many rows and columns this table has.
         */
        _getRowAndColumnCount: function(table) {
          var rows = 0;
          var columns = 0;
          var trs = table.getElementsByTagName("tr");
          for (var i = 0; i < trs.length; i++) {
            var rowspan = trs[i].getAttribute("rowspan") || 0;
            if (rowspan) {
              rowspan = parseInt(rowspan, 10);
            }
            rows += rowspan || 1;
            var columnsInThisRow = 0;
            var cells2 = trs[i].getElementsByTagName("td");
            for (var j = 0; j < cells2.length; j++) {
              var colspan = cells2[j].getAttribute("colspan") || 0;
              if (colspan) {
                colspan = parseInt(colspan, 10);
              }
              columnsInThisRow += colspan || 1;
            }
            columns = Math.max(columns, columnsInThisRow);
          }
          return { rows, columns };
        },
        /**
         * Look for 'data' (as opposed to 'layout') tables, for which we use
         * similar checks as
         * https://searchfox.org/mozilla-central/rev/f82d5c549f046cb64ce5602bfd894b7ae807c8f8/accessible/generic/TableAccessible.cpp#19
         */
        _markDataTables: function(root5) {
          var tables2 = root5.getElementsByTagName("table");
          for (var i = 0; i < tables2.length; i++) {
            var table = tables2[i];
            var role = table.getAttribute("role");
            if (role == "presentation") {
              table._readabilityDataTable = false;
              continue;
            }
            var datatable = table.getAttribute("datatable");
            if (datatable == "0") {
              table._readabilityDataTable = false;
              continue;
            }
            var summary = table.getAttribute("summary");
            if (summary) {
              table._readabilityDataTable = true;
              continue;
            }
            var caption = table.getElementsByTagName("caption")[0];
            if (caption && caption.childNodes.length > 0) {
              table._readabilityDataTable = true;
              continue;
            }
            var dataTableDescendants = ["col", "colgroup", "tfoot", "thead", "th"];
            var descendantExists = function(tag) {
              return !!table.getElementsByTagName(tag)[0];
            };
            if (dataTableDescendants.some(descendantExists)) {
              this.log("Data table because found data-y descendant");
              table._readabilityDataTable = true;
              continue;
            }
            if (table.getElementsByTagName("table")[0]) {
              table._readabilityDataTable = false;
              continue;
            }
            var sizeInfo = this._getRowAndColumnCount(table);
            if (sizeInfo.rows >= 10 || sizeInfo.columns > 4) {
              table._readabilityDataTable = true;
              continue;
            }
            table._readabilityDataTable = sizeInfo.rows * sizeInfo.columns > 10;
          }
        },
        /* convert images and figures that have properties like data-src into images that can be loaded without JS */
        _fixLazyImages: function(root5) {
          this._forEachNode(this._getAllNodesWithTag(root5, ["img", "picture", "figure"]), function(elem) {
            if (elem.src && this.REGEXPS.b64DataUrl.test(elem.src)) {
              var parts = this.REGEXPS.b64DataUrl.exec(elem.src);
              if (parts[1] === "image/svg+xml") {
                return;
              }
              var srcCouldBeRemoved = false;
              for (var i = 0; i < elem.attributes.length; i++) {
                var attr = elem.attributes[i];
                if (attr.name === "src") {
                  continue;
                }
                if (/\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
                  srcCouldBeRemoved = true;
                  break;
                }
              }
              if (srcCouldBeRemoved) {
                var b64starts = elem.src.search(/base64\s*/i) + 7;
                var b64length = elem.src.length - b64starts;
                if (b64length < 133) {
                  elem.removeAttribute("src");
                }
              }
            }
            if ((elem.src || elem.srcset && elem.srcset != "null") && elem.className.toLowerCase().indexOf("lazy") === -1) {
              return;
            }
            for (var j = 0; j < elem.attributes.length; j++) {
              attr = elem.attributes[j];
              if (attr.name === "src" || attr.name === "srcset" || attr.name === "alt") {
                continue;
              }
              var copyTo = null;
              if (/\.(jpg|jpeg|png|webp)\s+\d/.test(attr.value)) {
                copyTo = "srcset";
              } else if (/^\s*\S+\.(jpg|jpeg|png|webp)\S*\s*$/.test(attr.value)) {
                copyTo = "src";
              }
              if (copyTo) {
                if (elem.tagName === "IMG" || elem.tagName === "PICTURE") {
                  elem.setAttribute(copyTo, attr.value);
                } else if (elem.tagName === "FIGURE" && !this._getAllNodesWithTag(elem, ["img", "picture"]).length) {
                  var img = this._doc.createElement("img");
                  img.setAttribute(copyTo, attr.value);
                  elem.appendChild(img);
                }
              }
            }
          });
        },
        _getTextDensity: function(e, tags) {
          var textLength = this._getInnerText(e, true).length;
          if (textLength === 0) {
            return 0;
          }
          var childrenLength = 0;
          var children = this._getAllNodesWithTag(e, tags);
          this._forEachNode(children, (child) => childrenLength += this._getInnerText(child, true).length);
          return childrenLength / textLength;
        },
        /**
         * Clean an element of all tags of type "tag" if they look fishy.
         * "Fishy" is an algorithm based on content length, classnames, link density, number of images & embeds, etc.
         *
         * @return void
         **/
        _cleanConditionally: function(e, tag) {
          if (!this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY))
            return;
          this._removeNodes(this._getAllNodesWithTag(e, [tag]), function(node) {
            var isDataTable = function(t) {
              return t._readabilityDataTable;
            };
            var isList = tag === "ul" || tag === "ol";
            if (!isList) {
              var listLength = 0;
              var listNodes = this._getAllNodesWithTag(node, ["ul", "ol"]);
              this._forEachNode(listNodes, (list) => listLength += this._getInnerText(list).length);
              isList = listLength / this._getInnerText(node).length > 0.9;
            }
            if (tag === "table" && isDataTable(node)) {
              return false;
            }
            if (this._hasAncestorTag(node, "table", -1, isDataTable)) {
              return false;
            }
            if (this._hasAncestorTag(node, "code")) {
              return false;
            }
            var weight = this._getClassWeight(node);
            this.log("Cleaning Conditionally", node);
            var contentScore = 0;
            if (weight + contentScore < 0) {
              return true;
            }
            if (this._getCharCount(node, ",") < 10) {
              var p2 = node.getElementsByTagName("p").length;
              var img = node.getElementsByTagName("img").length;
              var li2 = node.getElementsByTagName("li").length - 100;
              var input = node.getElementsByTagName("input").length;
              var headingDensity = this._getTextDensity(node, ["h1", "h2", "h3", "h4", "h5", "h6"]);
              var embedCount = 0;
              var embeds = this._getAllNodesWithTag(node, ["object", "embed", "iframe"]);
              for (var i = 0; i < embeds.length; i++) {
                for (var j = 0; j < embeds[i].attributes.length; j++) {
                  if (this._allowedVideoRegex.test(embeds[i].attributes[j].value)) {
                    return false;
                  }
                }
                if (embeds[i].tagName === "object" && this._allowedVideoRegex.test(embeds[i].innerHTML)) {
                  return false;
                }
                embedCount++;
              }
              var linkDensity = this._getLinkDensity(node);
              var contentLength = this._getInnerText(node).length;
              var haveToRemove = img > 1 && p2 / img < 0.5 && !this._hasAncestorTag(node, "figure") || !isList && li2 > p2 || input > Math.floor(p2 / 3) || !isList && headingDensity < 0.9 && contentLength < 25 && (img === 0 || img > 2) && !this._hasAncestorTag(node, "figure") || !isList && weight < 25 && linkDensity > 0.2 || weight >= 25 && linkDensity > 0.5 || (embedCount === 1 && contentLength < 75 || embedCount > 1);
              if (isList && haveToRemove) {
                for (var x = 0; x < node.children.length; x++) {
                  let child = node.children[x];
                  if (child.children.length > 1) {
                    return haveToRemove;
                  }
                }
                let li_count = node.getElementsByTagName("li").length;
                if (img == li_count) {
                  return false;
                }
              }
              return haveToRemove;
            }
            return false;
          });
        },
        /**
         * Clean out elements that match the specified conditions
         *
         * @param Element
         * @param Function determines whether a node should be removed
         * @return void
         **/
        _cleanMatchedNodes: function(e, filter) {
          var endOfSearchMarkerNode = this._getNextNode(e, true);
          var next2 = this._getNextNode(e);
          while (next2 && next2 != endOfSearchMarkerNode) {
            if (filter.call(this, next2, next2.className + " " + next2.id)) {
              next2 = this._removeAndGetNext(next2);
            } else {
              next2 = this._getNextNode(next2);
            }
          }
        },
        /**
         * Clean out spurious headers from an Element.
         *
         * @param Element
         * @return void
        **/
        _cleanHeaders: function(e) {
          let headingNodes = this._getAllNodesWithTag(e, ["h1", "h2"]);
          this._removeNodes(headingNodes, function(node) {
            let shouldRemove = this._getClassWeight(node) < 0;
            if (shouldRemove) {
              this.log("Removing header with low class weight:", node);
            }
            return shouldRemove;
          });
        },
        /**
         * Check if this node is an H1 or H2 element whose content is mostly
         * the same as the article title.
         *
         * @param Element  the node to check.
         * @return boolean indicating whether this is a title-like header.
         */
        _headerDuplicatesTitle: function(node) {
          if (node.tagName != "H1" && node.tagName != "H2") {
            return false;
          }
          var heading = this._getInnerText(node, false);
          this.log("Evaluating similarity of header:", heading, this._articleTitle);
          return this._textSimilarity(this._articleTitle, heading) > 0.75;
        },
        _flagIsActive: function(flag) {
          return (this._flags & flag) > 0;
        },
        _removeFlag: function(flag) {
          this._flags = this._flags & ~flag;
        },
        _isProbablyVisible: function(node) {
          return (!node.style || node.style.display != "none") && (!node.style || node.style.visibility != "hidden") && !node.hasAttribute("hidden") && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || node.className && node.className.indexOf && node.className.indexOf("fallback-image") !== -1);
        },
        /**
         * Runs readability.
         *
         * Workflow:
         *  1. Prep the document by removing script tags, css, etc.
         *  2. Build readability's DOM tree.
         *  3. Grab the article content from the current dom tree.
         *  4. Replace the current DOM tree with the new one.
         *  5. Read peacefully.
         *
         * @return void
         **/
        parse: function() {
          if (this._maxElemsToParse > 0) {
            var numTags = this._doc.getElementsByTagName("*").length;
            if (numTags > this._maxElemsToParse) {
              throw new Error("Aborting parsing document; " + numTags + " elements found");
            }
          }
          this._unwrapNoscriptImages(this._doc);
          var jsonLd = this._disableJSONLD ? {} : this._getJSONLD(this._doc);
          this._removeScripts(this._doc);
          this._prepDocument();
          var metadata = this._getArticleMetadata(jsonLd);
          this._articleTitle = metadata.title;
          var articleContent = this._grabArticle();
          if (!articleContent)
            return null;
          this.log("Grabbed: " + articleContent.innerHTML);
          this._postProcessContent(articleContent);
          if (!metadata.excerpt) {
            var paragraphs = articleContent.getElementsByTagName("p");
            if (paragraphs.length > 0) {
              metadata.excerpt = paragraphs[0].textContent.trim();
            }
          }
          var textContent = articleContent.textContent;
          return {
            title: this._articleTitle,
            byline: metadata.byline || this._articleByline,
            dir: this._articleDir,
            lang: this._articleLang,
            content: this._serializer(articleContent),
            textContent,
            length: textContent.length,
            excerpt: metadata.excerpt,
            siteName: metadata.siteName || this._articleSiteName,
            publishedTime: metadata.publishedTime
          };
        }
      };
      if (typeof module === "object") {
        module.exports = Readability2;
      }
    }
  });

  // node_modules/.pnpm/@mozilla+readability@0.5.0/node_modules/@mozilla/readability/Readability-readerable.js
  var require_Readability_readerable = __commonJS({
    "node_modules/.pnpm/@mozilla+readability@0.5.0/node_modules/@mozilla/readability/Readability-readerable.js"(exports, module) {
      var REGEXPS = {
        // NOTE: These two regular expressions are duplicated in
        // Readability.js. Please keep both copies in sync.
        unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
        okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i
      };
      function isNodeVisible(node) {
        return (!node.style || node.style.display != "none") && !node.hasAttribute("hidden") && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || node.className && node.className.indexOf && node.className.indexOf("fallback-image") !== -1);
      }
      function isProbablyReaderable(doc, options = {}) {
        if (typeof options == "function") {
          options = { visibilityChecker: options };
        }
        var defaultOptions = { minScore: 20, minContentLength: 140, visibilityChecker: isNodeVisible };
        options = Object.assign(defaultOptions, options);
        var nodes = doc.querySelectorAll("p, pre, article");
        var brNodes = doc.querySelectorAll("div > br");
        if (brNodes.length) {
          var set = new Set(nodes);
          [].forEach.call(brNodes, function(node) {
            set.add(node.parentNode);
          });
          nodes = Array.from(set);
        }
        var score = 0;
        return [].some.call(nodes, function(node) {
          if (!options.visibilityChecker(node)) {
            return false;
          }
          var matchString = node.className + " " + node.id;
          if (REGEXPS.unlikelyCandidates.test(matchString) && !REGEXPS.okMaybeItsACandidate.test(matchString)) {
            return false;
          }
          if (node.matches("li p")) {
            return false;
          }
          var textContentLength = node.textContent.trim().length;
          if (textContentLength < options.minContentLength) {
            return false;
          }
          score += Math.sqrt(textContentLength - options.minContentLength);
          if (score > options.minScore) {
            return true;
          }
          return false;
        });
      }
      if (typeof module === "object") {
        module.exports = isProbablyReaderable;
      }
    }
  });

  // node_modules/.pnpm/@mozilla+readability@0.5.0/node_modules/@mozilla/readability/index.js
  var require_readability = __commonJS({
    "node_modules/.pnpm/@mozilla+readability@0.5.0/node_modules/@mozilla/readability/index.js"(exports, module) {
      var Readability2 = require_Readability();
      var isProbablyReaderable = require_Readability_readerable();
      module.exports = {
        Readability: Readability2,
        isProbablyReaderable
      };
    }
  });

  // node_modules/.pnpm/extend@3.0.2/node_modules/extend/index.js
  var require_extend = __commonJS({
    "node_modules/.pnpm/extend@3.0.2/node_modules/extend/index.js"(exports, module) {
      "use strict";
      var hasOwn = Object.prototype.hasOwnProperty;
      var toStr = Object.prototype.toString;
      var defineProperty = Object.defineProperty;
      var gOPD = Object.getOwnPropertyDescriptor;
      var isArray = function isArray2(arr) {
        if (typeof Array.isArray === "function") {
          return Array.isArray(arr);
        }
        return toStr.call(arr) === "[object Array]";
      };
      var isPlainObject2 = function isPlainObject3(obj) {
        if (!obj || toStr.call(obj) !== "[object Object]") {
          return false;
        }
        var hasOwnConstructor = hasOwn.call(obj, "constructor");
        var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
        if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
          return false;
        }
        var key2;
        for (key2 in obj) {
        }
        return typeof key2 === "undefined" || hasOwn.call(obj, key2);
      };
      var setProperty = function setProperty2(target, options) {
        if (defineProperty && options.name === "__proto__") {
          defineProperty(target, options.name, {
            enumerable: true,
            configurable: true,
            value: options.newValue,
            writable: true
          });
        } else {
          target[options.name] = options.newValue;
        }
      };
      var getProperty = function getProperty2(obj, name2) {
        if (name2 === "__proto__") {
          if (!hasOwn.call(obj, name2)) {
            return void 0;
          } else if (gOPD) {
            return gOPD(obj, name2).value;
          }
        }
        return obj[name2];
      };
      module.exports = function extend3() {
        var options, name2, src, copy, copyIsArray, clone;
        var target = arguments[0];
        var i = 1;
        var length = arguments.length;
        var deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[1] || {};
          i = 2;
        }
        if (target == null || typeof target !== "object" && typeof target !== "function") {
          target = {};
        }
        for (; i < length; ++i) {
          options = arguments[i];
          if (options != null) {
            for (name2 in options) {
              src = getProperty(target, name2);
              copy = getProperty(options, name2);
              if (target !== copy) {
                if (deep && copy && (isPlainObject2(copy) || (copyIsArray = isArray(copy)))) {
                  if (copyIsArray) {
                    copyIsArray = false;
                    clone = src && isArray(src) ? src : [];
                  } else {
                    clone = src && isPlainObject2(src) ? src : {};
                  }
                  setProperty(target, { name: name2, newValue: extend3(deep, clone, copy) });
                } else if (typeof copy !== "undefined") {
                  setProperty(target, { name: name2, newValue: copy });
                }
              }
            }
          }
        }
        return target;
      };
    }
  });

  // node_modules/.pnpm/boolbase@1.0.0/node_modules/boolbase/index.js
  var require_boolbase = __commonJS({
    "node_modules/.pnpm/boolbase@1.0.0/node_modules/boolbase/index.js"(exports, module) {
      module.exports = {
        trueFunc: function trueFunc() {
          return true;
        },
        falseFunc: function falseFunc() {
          return false;
        }
      };
    }
  });

  // src/process-html.ts
  var import_readability = __toESM(require_readability());

  // node_modules/.pnpm/bail@2.0.2/node_modules/bail/index.js
  function bail(error) {
    if (error) {
      throw error;
    }
  }

  // node_modules/.pnpm/unified@11.0.4/node_modules/unified/lib/index.js
  var import_extend = __toESM(require_extend(), 1);

  // node_modules/.pnpm/devlop@1.1.0/node_modules/devlop/lib/default.js
  function ok() {
  }
  function unreachable() {
  }

  // node_modules/.pnpm/is-plain-obj@4.1.0/node_modules/is-plain-obj/index.js
  function isPlainObject(value) {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
  }

  // node_modules/.pnpm/trough@2.2.0/node_modules/trough/lib/index.js
  function trough() {
    const fns = [];
    const pipeline = { run, use };
    return pipeline;
    function run(...values) {
      let middlewareIndex = -1;
      const callback = values.pop();
      if (typeof callback !== "function") {
        throw new TypeError("Expected function as last argument, not " + callback);
      }
      next2(null, ...values);
      function next2(error, ...output) {
        const fn = fns[++middlewareIndex];
        let index2 = -1;
        if (error) {
          callback(error);
          return;
        }
        while (++index2 < values.length) {
          if (output[index2] === null || output[index2] === void 0) {
            output[index2] = values[index2];
          }
        }
        values = output;
        if (fn) {
          wrap(fn, next2)(...output);
        } else {
          callback(null, ...output);
        }
      }
    }
    function use(middelware) {
      if (typeof middelware !== "function") {
        throw new TypeError(
          "Expected `middelware` to be a function, not " + middelware
        );
      }
      fns.push(middelware);
      return pipeline;
    }
  }
  function wrap(middleware, callback) {
    let called;
    return wrapped;
    function wrapped(...parameters) {
      const fnExpectsCallback = middleware.length > parameters.length;
      let result;
      if (fnExpectsCallback) {
        parameters.push(done);
      }
      try {
        result = middleware.apply(this, parameters);
      } catch (error) {
        const exception = (
          /** @type {Error} */
          error
        );
        if (fnExpectsCallback && called) {
          throw exception;
        }
        return done(exception);
      }
      if (!fnExpectsCallback) {
        if (result && result.then && typeof result.then === "function") {
          result.then(then, done);
        } else if (result instanceof Error) {
          done(result);
        } else {
          then(result);
        }
      }
    }
    function done(error, ...output) {
      if (!called) {
        called = true;
        callback(error, ...output);
      }
    }
    function then(value) {
      done(null, value);
    }
  }

  // node_modules/.pnpm/unist-util-stringify-position@4.0.0/node_modules/unist-util-stringify-position/lib/index.js
  function stringifyPosition(value) {
    if (!value || typeof value !== "object") {
      return "";
    }
    if ("position" in value || "type" in value) {
      return position(value.position);
    }
    if ("start" in value || "end" in value) {
      return position(value);
    }
    if ("line" in value || "column" in value) {
      return point(value);
    }
    return "";
  }
  function point(point2) {
    return index(point2 && point2.line) + ":" + index(point2 && point2.column);
  }
  function position(pos) {
    return point(pos && pos.start) + "-" + point(pos && pos.end);
  }
  function index(value) {
    return value && typeof value === "number" ? value : 1;
  }

  // node_modules/.pnpm/vfile-message@4.0.2/node_modules/vfile-message/lib/index.js
  var VFileMessage = class extends Error {
    /**
     * Create a message for `reason`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {Options | null | undefined} [options]
     * @returns
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns
     *   Instance of `VFileMessage`.
     */
    // eslint-disable-next-line complexity
    constructor(causeOrReason, optionsOrParentOrPlace, origin) {
      super();
      if (typeof optionsOrParentOrPlace === "string") {
        origin = optionsOrParentOrPlace;
        optionsOrParentOrPlace = void 0;
      }
      let reason = "";
      let options = {};
      let legacyCause = false;
      if (optionsOrParentOrPlace) {
        if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
          options = { place: optionsOrParentOrPlace };
        } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
          options = { place: optionsOrParentOrPlace };
        } else if ("type" in optionsOrParentOrPlace) {
          options = {
            ancestors: [optionsOrParentOrPlace],
            place: optionsOrParentOrPlace.position
          };
        } else {
          options = { ...optionsOrParentOrPlace };
        }
      }
      if (typeof causeOrReason === "string") {
        reason = causeOrReason;
      } else if (!options.cause && causeOrReason) {
        legacyCause = true;
        reason = causeOrReason.message;
        options.cause = causeOrReason;
      }
      if (!options.ruleId && !options.source && typeof origin === "string") {
        const index2 = origin.indexOf(":");
        if (index2 === -1) {
          options.ruleId = origin;
        } else {
          options.source = origin.slice(0, index2);
          options.ruleId = origin.slice(index2 + 1);
        }
      }
      if (!options.place && options.ancestors && options.ancestors) {
        const parent = options.ancestors[options.ancestors.length - 1];
        if (parent) {
          options.place = parent.position;
        }
      }
      const start = options.place && "start" in options.place ? options.place.start : options.place;
      this.ancestors = options.ancestors || void 0;
      this.cause = options.cause || void 0;
      this.column = start ? start.column : void 0;
      this.fatal = void 0;
      this.file;
      this.message = reason;
      this.line = start ? start.line : void 0;
      this.name = stringifyPosition(options.place) || "1:1";
      this.place = options.place || void 0;
      this.reason = this.message;
      this.ruleId = options.ruleId || void 0;
      this.source = options.source || void 0;
      this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
      this.actual;
      this.expected;
      this.note;
      this.url;
    }
  };
  VFileMessage.prototype.file = "";
  VFileMessage.prototype.name = "";
  VFileMessage.prototype.reason = "";
  VFileMessage.prototype.message = "";
  VFileMessage.prototype.stack = "";
  VFileMessage.prototype.column = void 0;
  VFileMessage.prototype.line = void 0;
  VFileMessage.prototype.ancestors = void 0;
  VFileMessage.prototype.cause = void 0;
  VFileMessage.prototype.fatal = void 0;
  VFileMessage.prototype.place = void 0;
  VFileMessage.prototype.ruleId = void 0;
  VFileMessage.prototype.source = void 0;

  // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/minpath.browser.js
  var path = { basename, dirname, extname, join, sep: "/" };
  function basename(path2, ext) {
    if (ext !== void 0 && typeof ext !== "string") {
      throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path2);
    let start = 0;
    let end = -1;
    let index2 = path2.length;
    let seenNonSlash;
    if (ext === void 0 || ext.length === 0 || ext.length > path2.length) {
      while (index2--) {
        if (path2.codePointAt(index2) === 47) {
          if (seenNonSlash) {
            start = index2 + 1;
            break;
          }
        } else if (end < 0) {
          seenNonSlash = true;
          end = index2 + 1;
        }
      }
      return end < 0 ? "" : path2.slice(start, end);
    }
    if (ext === path2) {
      return "";
    }
    let firstNonSlashEnd = -1;
    let extIndex = ext.length - 1;
    while (index2--) {
      if (path2.codePointAt(index2) === 47) {
        if (seenNonSlash) {
          start = index2 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd < 0) {
          seenNonSlash = true;
          firstNonSlashEnd = index2 + 1;
        }
        if (extIndex > -1) {
          if (path2.codePointAt(index2) === ext.codePointAt(extIndex--)) {
            if (extIndex < 0) {
              end = index2;
            }
          } else {
            extIndex = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) {
      end = firstNonSlashEnd;
    } else if (end < 0) {
      end = path2.length;
    }
    return path2.slice(start, end);
  }
  function dirname(path2) {
    assertPath(path2);
    if (path2.length === 0) {
      return ".";
    }
    let end = -1;
    let index2 = path2.length;
    let unmatchedSlash;
    while (--index2) {
      if (path2.codePointAt(index2) === 47) {
        if (unmatchedSlash) {
          end = index2;
          break;
        }
      } else if (!unmatchedSlash) {
        unmatchedSlash = true;
      }
    }
    return end < 0 ? path2.codePointAt(0) === 47 ? "/" : "." : end === 1 && path2.codePointAt(0) === 47 ? "//" : path2.slice(0, end);
  }
  function extname(path2) {
    assertPath(path2);
    let index2 = path2.length;
    let end = -1;
    let startPart = 0;
    let startDot = -1;
    let preDotState = 0;
    let unmatchedSlash;
    while (index2--) {
      const code = path2.codePointAt(index2);
      if (code === 47) {
        if (unmatchedSlash) {
          startPart = index2 + 1;
          break;
        }
        continue;
      }
      if (end < 0) {
        unmatchedSlash = true;
        end = index2 + 1;
      }
      if (code === 46) {
        if (startDot < 0) {
          startDot = index2;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot > -1) {
        preDotState = -1;
      }
    }
    if (startDot < 0 || end < 0 || // We saw a non-dot character immediately before the dot.
    preDotState === 0 || // The (right-most) trimmed path component is exactly `..`.
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path2.slice(startDot, end);
  }
  function join(...segments) {
    let index2 = -1;
    let joined;
    while (++index2 < segments.length) {
      assertPath(segments[index2]);
      if (segments[index2]) {
        joined = joined === void 0 ? segments[index2] : joined + "/" + segments[index2];
      }
    }
    return joined === void 0 ? "." : normalize(joined);
  }
  function normalize(path2) {
    assertPath(path2);
    const absolute = path2.codePointAt(0) === 47;
    let value = normalizeString(path2, !absolute);
    if (value.length === 0 && !absolute) {
      value = ".";
    }
    if (value.length > 0 && path2.codePointAt(path2.length - 1) === 47) {
      value += "/";
    }
    return absolute ? "/" + value : value;
  }
  function normalizeString(path2, allowAboveRoot) {
    let result = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let index2 = -1;
    let code;
    let lastSlashIndex;
    while (++index2 <= path2.length) {
      if (index2 < path2.length) {
        code = path2.codePointAt(index2);
      } else if (code === 47) {
        break;
      } else {
        code = 47;
      }
      if (code === 47) {
        if (lastSlash === index2 - 1 || dots === 1) {
        } else if (lastSlash !== index2 - 1 && dots === 2) {
          if (result.length < 2 || lastSegmentLength !== 2 || result.codePointAt(result.length - 1) !== 46 || result.codePointAt(result.length - 2) !== 46) {
            if (result.length > 2) {
              lastSlashIndex = result.lastIndexOf("/");
              if (lastSlashIndex !== result.length - 1) {
                if (lastSlashIndex < 0) {
                  result = "";
                  lastSegmentLength = 0;
                } else {
                  result = result.slice(0, lastSlashIndex);
                  lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
                }
                lastSlash = index2;
                dots = 0;
                continue;
              }
            } else if (result.length > 0) {
              result = "";
              lastSegmentLength = 0;
              lastSlash = index2;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            result = result.length > 0 ? result + "/.." : "..";
            lastSegmentLength = 2;
          }
        } else {
          if (result.length > 0) {
            result += "/" + path2.slice(lastSlash + 1, index2);
          } else {
            result = path2.slice(lastSlash + 1, index2);
          }
          lastSegmentLength = index2 - lastSlash - 1;
        }
        lastSlash = index2;
        dots = 0;
      } else if (code === 46 && dots > -1) {
        dots++;
      } else {
        dots = -1;
      }
    }
    return result;
  }
  function assertPath(path2) {
    if (typeof path2 !== "string") {
      throw new TypeError(
        "Path must be a string. Received " + JSON.stringify(path2)
      );
    }
  }

  // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/minproc.browser.js
  var proc = { cwd };
  function cwd() {
    return "/";
  }

  // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/minurl.shared.js
  function isUrl(fileUrlOrPath) {
    return Boolean(
      fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && // @ts-expect-error: indexing is fine.
      fileUrlOrPath.auth === void 0
    );
  }

  // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/minurl.browser.js
  function urlToPath(path2) {
    if (typeof path2 === "string") {
      path2 = new URL(path2);
    } else if (!isUrl(path2)) {
      const error = new TypeError(
        'The "path" argument must be of type string or an instance of URL. Received `' + path2 + "`"
      );
      error.code = "ERR_INVALID_ARG_TYPE";
      throw error;
    }
    if (path2.protocol !== "file:") {
      const error = new TypeError("The URL must be of scheme file");
      error.code = "ERR_INVALID_URL_SCHEME";
      throw error;
    }
    return getPathFromURLPosix(path2);
  }
  function getPathFromURLPosix(url) {
    if (url.hostname !== "") {
      const error = new TypeError(
        'File URL host must be "localhost" or empty on darwin'
      );
      error.code = "ERR_INVALID_FILE_URL_HOST";
      throw error;
    }
    const pathname = url.pathname;
    let index2 = -1;
    while (++index2 < pathname.length) {
      if (pathname.codePointAt(index2) === 37 && pathname.codePointAt(index2 + 1) === 50) {
        const third = pathname.codePointAt(index2 + 2);
        if (third === 70 || third === 102) {
          const error = new TypeError(
            "File URL path must not include encoded / characters"
          );
          error.code = "ERR_INVALID_FILE_URL_PATH";
          throw error;
        }
      }
    }
    return decodeURIComponent(pathname);
  }

  // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/index.js
  var order = (
    /** @type {const} */
    [
      "history",
      "path",
      "basename",
      "stem",
      "extname",
      "dirname"
    ]
  );
  var VFile = class {
    /**
     * Create a new virtual file.
     *
     * `options` is treated as:
     *
     * *   `string` or `Uint8Array` — `{value: options}`
     * *   `URL` — `{path: options}`
     * *   `VFile` — shallow copies its data over to the new file
     * *   `object` — all fields are shallow copied over to the new file
     *
     * Path related fields are set in the following order (least specific to
     * most specific): `history`, `path`, `basename`, `stem`, `extname`,
     * `dirname`.
     *
     * You cannot set `dirname` or `extname` without setting either `history`,
     * `path`, `basename`, or `stem` too.
     *
     * @param {Compatible | null | undefined} [value]
     *   File value.
     * @returns
     *   New instance.
     */
    constructor(value) {
      let options;
      if (!value) {
        options = {};
      } else if (isUrl(value)) {
        options = { path: value };
      } else if (typeof value === "string" || isUint8Array(value)) {
        options = { value };
      } else {
        options = value;
      }
      this.cwd = proc.cwd();
      this.data = {};
      this.history = [];
      this.messages = [];
      this.value;
      this.map;
      this.result;
      this.stored;
      let index2 = -1;
      while (++index2 < order.length) {
        const prop2 = order[index2];
        if (prop2 in options && options[prop2] !== void 0 && options[prop2] !== null) {
          this[prop2] = prop2 === "history" ? [...options[prop2]] : options[prop2];
        }
      }
      let prop;
      for (prop in options) {
        if (!order.includes(prop)) {
          this[prop] = options[prop];
        }
      }
    }
    /**
     * Get the basename (including extname) (example: `'index.min.js'`).
     *
     * @returns {string | undefined}
     *   Basename.
     */
    get basename() {
      return typeof this.path === "string" ? path.basename(this.path) : void 0;
    }
    /**
     * Set basename (including extname) (`'index.min.js'`).
     *
     * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
     * on windows).
     * Cannot be nullified (use `file.path = file.dirname` instead).
     *
     * @param {string} basename
     *   Basename.
     * @returns {undefined}
     *   Nothing.
     */
    set basename(basename2) {
      assertNonEmpty(basename2, "basename");
      assertPart(basename2, "basename");
      this.path = path.join(this.dirname || "", basename2);
    }
    /**
     * Get the parent path (example: `'~'`).
     *
     * @returns {string | undefined}
     *   Dirname.
     */
    get dirname() {
      return typeof this.path === "string" ? path.dirname(this.path) : void 0;
    }
    /**
     * Set the parent path (example: `'~'`).
     *
     * Cannot be set if there’s no `path` yet.
     *
     * @param {string | undefined} dirname
     *   Dirname.
     * @returns {undefined}
     *   Nothing.
     */
    set dirname(dirname2) {
      assertPath2(this.basename, "dirname");
      this.path = path.join(dirname2 || "", this.basename);
    }
    /**
     * Get the extname (including dot) (example: `'.js'`).
     *
     * @returns {string | undefined}
     *   Extname.
     */
    get extname() {
      return typeof this.path === "string" ? path.extname(this.path) : void 0;
    }
    /**
     * Set the extname (including dot) (example: `'.js'`).
     *
     * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
     * on windows).
     * Cannot be set if there’s no `path` yet.
     *
     * @param {string | undefined} extname
     *   Extname.
     * @returns {undefined}
     *   Nothing.
     */
    set extname(extname2) {
      assertPart(extname2, "extname");
      assertPath2(this.dirname, "extname");
      if (extname2) {
        if (extname2.codePointAt(0) !== 46) {
          throw new Error("`extname` must start with `.`");
        }
        if (extname2.includes(".", 1)) {
          throw new Error("`extname` cannot contain multiple dots");
        }
      }
      this.path = path.join(this.dirname, this.stem + (extname2 || ""));
    }
    /**
     * Get the full path (example: `'~/index.min.js'`).
     *
     * @returns {string}
     *   Path.
     */
    get path() {
      return this.history[this.history.length - 1];
    }
    /**
     * Set the full path (example: `'~/index.min.js'`).
     *
     * Cannot be nullified.
     * You can set a file URL (a `URL` object with a `file:` protocol) which will
     * be turned into a path with `url.fileURLToPath`.
     *
     * @param {URL | string} path
     *   Path.
     * @returns {undefined}
     *   Nothing.
     */
    set path(path2) {
      if (isUrl(path2)) {
        path2 = urlToPath(path2);
      }
      assertNonEmpty(path2, "path");
      if (this.path !== path2) {
        this.history.push(path2);
      }
    }
    /**
     * Get the stem (basename w/o extname) (example: `'index.min'`).
     *
     * @returns {string | undefined}
     *   Stem.
     */
    get stem() {
      return typeof this.path === "string" ? path.basename(this.path, this.extname) : void 0;
    }
    /**
     * Set the stem (basename w/o extname) (example: `'index.min'`).
     *
     * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
     * on windows).
     * Cannot be nullified (use `file.path = file.dirname` instead).
     *
     * @param {string} stem
     *   Stem.
     * @returns {undefined}
     *   Nothing.
     */
    set stem(stem) {
      assertNonEmpty(stem, "stem");
      assertPart(stem, "stem");
      this.path = path.join(this.dirname || "", stem + (this.extname || ""));
    }
    // Normal prototypal methods.
    /**
     * Create a fatal message for `reason` associated with the file.
     *
     * The `fatal` field of the message is set to `true` (error; file not usable)
     * and the `file` field is set to the current file path.
     * The message is added to the `messages` field on `file`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {MessageOptions | null | undefined} [options]
     * @returns {never}
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns {never}
     *   Never.
     * @throws {VFileMessage}
     *   Message.
     */
    fail(causeOrReason, optionsOrParentOrPlace, origin) {
      const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
      message.fatal = true;
      throw message;
    }
    /**
     * Create an info message for `reason` associated with the file.
     *
     * The `fatal` field of the message is set to `undefined` (info; change
     * likely not needed) and the `file` field is set to the current file path.
     * The message is added to the `messages` field on `file`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {MessageOptions | null | undefined} [options]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns {VFileMessage}
     *   Message.
     */
    info(causeOrReason, optionsOrParentOrPlace, origin) {
      const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
      message.fatal = void 0;
      return message;
    }
    /**
     * Create a message for `reason` associated with the file.
     *
     * The `fatal` field of the message is set to `false` (warning; change may be
     * needed) and the `file` field is set to the current file path.
     * The message is added to the `messages` field on `file`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {MessageOptions | null | undefined} [options]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns {VFileMessage}
     *   Message.
     */
    message(causeOrReason, optionsOrParentOrPlace, origin) {
      const message = new VFileMessage(
        // @ts-expect-error: the overloads are fine.
        causeOrReason,
        optionsOrParentOrPlace,
        origin
      );
      if (this.path) {
        message.name = this.path + ":" + message.name;
        message.file = this.path;
      }
      message.fatal = false;
      this.messages.push(message);
      return message;
    }
    /**
     * Serialize the file.
     *
     * > **Note**: which encodings are supported depends on the engine.
     * > For info on Node.js, see:
     * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
     *
     * @param {string | null | undefined} [encoding='utf8']
     *   Character encoding to understand `value` as when it’s a `Uint8Array`
     *   (default: `'utf-8'`).
     * @returns {string}
     *   Serialized file.
     */
    toString(encoding) {
      if (this.value === void 0) {
        return "";
      }
      if (typeof this.value === "string") {
        return this.value;
      }
      const decoder = new TextDecoder(encoding || void 0);
      return decoder.decode(this.value);
    }
  };
  function assertPart(part, name2) {
    if (part && part.includes(path.sep)) {
      throw new Error(
        "`" + name2 + "` cannot be a path: did not expect `" + path.sep + "`"
      );
    }
  }
  function assertNonEmpty(part, name2) {
    if (!part) {
      throw new Error("`" + name2 + "` cannot be empty");
    }
  }
  function assertPath2(path2, name2) {
    if (!path2) {
      throw new Error("Setting `" + name2 + "` requires `path` to be set too");
    }
  }
  function isUint8Array(value) {
    return Boolean(
      value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
    );
  }

  // node_modules/.pnpm/unified@11.0.4/node_modules/unified/lib/callable-instance.js
  var CallableInstance = (
    /**
     * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
     */
    /** @type {unknown} */
    /**
     * @this {Function}
     * @param {string | symbol} property
     * @returns {(...parameters: Array<unknown>) => unknown}
     */
    function(property) {
      const self = this;
      const constr = self.constructor;
      const proto = (
        /** @type {Record<string | symbol, Function>} */
        // Prototypes do exist.
        // type-coverage:ignore-next-line
        constr.prototype
      );
      const func = proto[property];
      const apply = function() {
        return func.apply(apply, arguments);
      };
      Object.setPrototypeOf(apply, proto);
      const names = Object.getOwnPropertyNames(func);
      for (const p2 of names) {
        const descriptor = Object.getOwnPropertyDescriptor(func, p2);
        if (descriptor)
          Object.defineProperty(apply, p2, descriptor);
      }
      return apply;
    }
  );

  // node_modules/.pnpm/unified@11.0.4/node_modules/unified/lib/index.js
  var own = {}.hasOwnProperty;
  var Processor = class _Processor extends CallableInstance {
    /**
     * Create a processor.
     */
    constructor() {
      super("copy");
      this.Compiler = void 0;
      this.Parser = void 0;
      this.attachers = [];
      this.compiler = void 0;
      this.freezeIndex = -1;
      this.frozen = void 0;
      this.namespace = {};
      this.parser = void 0;
      this.transformers = trough();
    }
    /**
     * Copy a processor.
     *
     * @deprecated
     *   This is a private internal method and should not be used.
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *   New *unfrozen* processor ({@link Processor `Processor`}) that is
     *   configured to work the same as its ancestor.
     *   When the descendant processor is configured in the future it does not
     *   affect the ancestral processor.
     */
    copy() {
      const destination = (
        /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
        new _Processor()
      );
      let index2 = -1;
      while (++index2 < this.attachers.length) {
        const attacher = this.attachers[index2];
        destination.use(...attacher);
      }
      destination.data((0, import_extend.default)(true, {}, this.namespace));
      return destination;
    }
    /**
     * Configure the processor with info available to all plugins.
     * Information is stored in an object.
     *
     * Typically, options can be given to a specific plugin, but sometimes it
     * makes sense to have information shared with several plugins.
     * For example, a list of HTML elements that are self-closing, which is
     * needed during all phases.
     *
     * > 👉 **Note**: setting information cannot occur on *frozen* processors.
     * > Call the processor first to create a new unfrozen processor.
     *
     * > 👉 **Note**: to register custom data in TypeScript, augment the
     * > {@link Data `Data`} interface.
     *
     * @example
     *   This example show how to get and set info:
     *
     *   ```js
     *   import {unified} from 'unified'
     *
     *   const processor = unified().data('alpha', 'bravo')
     *
     *   processor.data('alpha') // => 'bravo'
     *
     *   processor.data() // => {alpha: 'bravo'}
     *
     *   processor.data({charlie: 'delta'})
     *
     *   processor.data() // => {charlie: 'delta'}
     *   ```
     *
     * @template {keyof Data} Key
     *
     * @overload
     * @returns {Data}
     *
     * @overload
     * @param {Data} dataset
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @overload
     * @param {Key} key
     * @returns {Data[Key]}
     *
     * @overload
     * @param {Key} key
     * @param {Data[Key]} value
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @param {Data | Key} [key]
     *   Key to get or set, or entire dataset to set, or nothing to get the
     *   entire dataset (optional).
     * @param {Data[Key]} [value]
     *   Value to set (optional).
     * @returns {unknown}
     *   The current processor when setting, the value at `key` when getting, or
     *   the entire dataset when getting without key.
     */
    data(key2, value) {
      if (typeof key2 === "string") {
        if (arguments.length === 2) {
          assertUnfrozen("data", this.frozen);
          this.namespace[key2] = value;
          return this;
        }
        return own.call(this.namespace, key2) && this.namespace[key2] || void 0;
      }
      if (key2) {
        assertUnfrozen("data", this.frozen);
        this.namespace = key2;
        return this;
      }
      return this.namespace;
    }
    /**
     * Freeze a processor.
     *
     * Frozen processors are meant to be extended and not to be configured
     * directly.
     *
     * When a processor is frozen it cannot be unfrozen.
     * New processors working the same way can be created by calling the
     * processor.
     *
     * It’s possible to freeze processors explicitly by calling `.freeze()`.
     * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
     * `.stringify()`, `.process()`, or `.processSync()` are called.
     *
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *   The current processor.
     */
    freeze() {
      if (this.frozen) {
        return this;
      }
      const self = (
        /** @type {Processor} */
        /** @type {unknown} */
        this
      );
      while (++this.freezeIndex < this.attachers.length) {
        const [attacher, ...options] = this.attachers[this.freezeIndex];
        if (options[0] === false) {
          continue;
        }
        if (options[0] === true) {
          options[0] = void 0;
        }
        const transformer = attacher.call(self, ...options);
        if (typeof transformer === "function") {
          this.transformers.use(transformer);
        }
      }
      this.frozen = true;
      this.freezeIndex = Number.POSITIVE_INFINITY;
      return this;
    }
    /**
     * Parse text to a syntax tree.
     *
     * > 👉 **Note**: `parse` freezes the processor if not already *frozen*.
     *
     * > 👉 **Note**: `parse` performs the parse phase, not the run phase or other
     * > phases.
     *
     * @param {Compatible | undefined} [file]
     *   file to parse (optional); typically `string` or `VFile`; any value
     *   accepted as `x` in `new VFile(x)`.
     * @returns {ParseTree extends undefined ? Node : ParseTree}
     *   Syntax tree representing `file`.
     */
    parse(file) {
      this.freeze();
      const realFile = vfile(file);
      const parser = this.parser || this.Parser;
      assertParser("parse", parser);
      return parser(String(realFile), realFile);
    }
    /**
     * Process the given file as configured on the processor.
     *
     * > 👉 **Note**: `process` freezes the processor if not already *frozen*.
     *
     * > 👉 **Note**: `process` performs the parse, run, and stringify phases.
     *
     * @overload
     * @param {Compatible | undefined} file
     * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
     * @returns {undefined}
     *
     * @overload
     * @param {Compatible | undefined} [file]
     * @returns {Promise<VFileWithOutput<CompileResult>>}
     *
     * @param {Compatible | undefined} [file]
     *   File (optional); typically `string` or `VFile`]; any value accepted as
     *   `x` in `new VFile(x)`.
     * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
     *   Callback (optional).
     * @returns {Promise<VFile> | undefined}
     *   Nothing if `done` is given.
     *   Otherwise a promise, rejected with a fatal error or resolved with the
     *   processed file.
     *
     *   The parsed, transformed, and compiled value is available at
     *   `file.value` (see note).
     *
     *   > 👉 **Note**: unified typically compiles by serializing: most
     *   > compilers return `string` (or `Uint8Array`).
     *   > Some compilers, such as the one configured with
     *   > [`rehype-react`][rehype-react], return other values (in this case, a
     *   > React tree).
     *   > If you’re using a compiler that doesn’t serialize, expect different
     *   > result values.
     *   >
     *   > To register custom results in TypeScript, add them to
     *   > {@link CompileResultMap `CompileResultMap`}.
     *
     *   [rehype-react]: https://github.com/rehypejs/rehype-react
     */
    process(file, done) {
      const self = this;
      this.freeze();
      assertParser("process", this.parser || this.Parser);
      assertCompiler("process", this.compiler || this.Compiler);
      return done ? executor(void 0, done) : new Promise(executor);
      function executor(resolve, reject) {
        const realFile = vfile(file);
        const parseTree = (
          /** @type {HeadTree extends undefined ? Node : HeadTree} */
          /** @type {unknown} */
          self.parse(realFile)
        );
        self.run(parseTree, realFile, function(error, tree, file2) {
          if (error || !tree || !file2) {
            return realDone(error);
          }
          const compileTree = (
            /** @type {CompileTree extends undefined ? Node : CompileTree} */
            /** @type {unknown} */
            tree
          );
          const compileResult = self.stringify(compileTree, file2);
          if (looksLikeAValue(compileResult)) {
            file2.value = compileResult;
          } else {
            file2.result = compileResult;
          }
          realDone(
            error,
            /** @type {VFileWithOutput<CompileResult>} */
            file2
          );
        });
        function realDone(error, file2) {
          if (error || !file2) {
            reject(error);
          } else if (resolve) {
            resolve(file2);
          } else {
            ok(done, "`done` is defined if `resolve` is not");
            done(void 0, file2);
          }
        }
      }
    }
    /**
     * Process the given file as configured on the processor.
     *
     * An error is thrown if asynchronous transforms are configured.
     *
     * > 👉 **Note**: `processSync` freezes the processor if not already *frozen*.
     *
     * > 👉 **Note**: `processSync` performs the parse, run, and stringify phases.
     *
     * @param {Compatible | undefined} [file]
     *   File (optional); typically `string` or `VFile`; any value accepted as
     *   `x` in `new VFile(x)`.
     * @returns {VFileWithOutput<CompileResult>}
     *   The processed file.
     *
     *   The parsed, transformed, and compiled value is available at
     *   `file.value` (see note).
     *
     *   > 👉 **Note**: unified typically compiles by serializing: most
     *   > compilers return `string` (or `Uint8Array`).
     *   > Some compilers, such as the one configured with
     *   > [`rehype-react`][rehype-react], return other values (in this case, a
     *   > React tree).
     *   > If you’re using a compiler that doesn’t serialize, expect different
     *   > result values.
     *   >
     *   > To register custom results in TypeScript, add them to
     *   > {@link CompileResultMap `CompileResultMap`}.
     *
     *   [rehype-react]: https://github.com/rehypejs/rehype-react
     */
    processSync(file) {
      let complete = false;
      let result;
      this.freeze();
      assertParser("processSync", this.parser || this.Parser);
      assertCompiler("processSync", this.compiler || this.Compiler);
      this.process(file, realDone);
      assertDone("processSync", "process", complete);
      ok(result, "we either bailed on an error or have a tree");
      return result;
      function realDone(error, file2) {
        complete = true;
        bail(error);
        result = file2;
      }
    }
    /**
     * Run *transformers* on a syntax tree.
     *
     * > 👉 **Note**: `run` freezes the processor if not already *frozen*.
     *
     * > 👉 **Note**: `run` performs the run phase, not other phases.
     *
     * @overload
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
     * @returns {undefined}
     *
     * @overload
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     * @param {Compatible | undefined} file
     * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
     * @returns {undefined}
     *
     * @overload
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     * @param {Compatible | undefined} [file]
     * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
     *
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     *   Tree to transform and inspect.
     * @param {(
     *   RunCallback<TailTree extends undefined ? Node : TailTree> |
     *   Compatible
     * )} [file]
     *   File associated with `node` (optional); any value accepted as `x` in
     *   `new VFile(x)`.
     * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
     *   Callback (optional).
     * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
     *   Nothing if `done` is given.
     *   Otherwise, a promise rejected with a fatal error or resolved with the
     *   transformed tree.
     */
    run(tree, file, done) {
      assertNode(tree);
      this.freeze();
      const transformers = this.transformers;
      if (!done && typeof file === "function") {
        done = file;
        file = void 0;
      }
      return done ? executor(void 0, done) : new Promise(executor);
      function executor(resolve, reject) {
        ok(
          typeof file !== "function",
          "`file` can\u2019t be a `done` anymore, we checked"
        );
        const realFile = vfile(file);
        transformers.run(tree, realFile, realDone);
        function realDone(error, outputTree, file2) {
          const resultingTree = (
            /** @type {TailTree extends undefined ? Node : TailTree} */
            outputTree || tree
          );
          if (error) {
            reject(error);
          } else if (resolve) {
            resolve(resultingTree);
          } else {
            ok(done, "`done` is defined if `resolve` is not");
            done(void 0, resultingTree, file2);
          }
        }
      }
    }
    /**
     * Run *transformers* on a syntax tree.
     *
     * An error is thrown if asynchronous transforms are configured.
     *
     * > 👉 **Note**: `runSync` freezes the processor if not already *frozen*.
     *
     * > 👉 **Note**: `runSync` performs the run phase, not other phases.
     *
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     *   Tree to transform and inspect.
     * @param {Compatible | undefined} [file]
     *   File associated with `node` (optional); any value accepted as `x` in
     *   `new VFile(x)`.
     * @returns {TailTree extends undefined ? Node : TailTree}
     *   Transformed tree.
     */
    runSync(tree, file) {
      let complete = false;
      let result;
      this.run(tree, file, realDone);
      assertDone("runSync", "run", complete);
      ok(result, "we either bailed on an error or have a tree");
      return result;
      function realDone(error, tree2) {
        bail(error);
        result = tree2;
        complete = true;
      }
    }
    /**
     * Compile a syntax tree.
     *
     * > 👉 **Note**: `stringify` freezes the processor if not already *frozen*.
     *
     * > 👉 **Note**: `stringify` performs the stringify phase, not the run phase
     * > or other phases.
     *
     * @param {CompileTree extends undefined ? Node : CompileTree} tree
     *   Tree to compile.
     * @param {Compatible | undefined} [file]
     *   File associated with `node` (optional); any value accepted as `x` in
     *   `new VFile(x)`.
     * @returns {CompileResult extends undefined ? Value : CompileResult}
     *   Textual representation of the tree (see note).
     *
     *   > 👉 **Note**: unified typically compiles by serializing: most compilers
     *   > return `string` (or `Uint8Array`).
     *   > Some compilers, such as the one configured with
     *   > [`rehype-react`][rehype-react], return other values (in this case, a
     *   > React tree).
     *   > If you’re using a compiler that doesn’t serialize, expect different
     *   > result values.
     *   >
     *   > To register custom results in TypeScript, add them to
     *   > {@link CompileResultMap `CompileResultMap`}.
     *
     *   [rehype-react]: https://github.com/rehypejs/rehype-react
     */
    stringify(tree, file) {
      this.freeze();
      const realFile = vfile(file);
      const compiler = this.compiler || this.Compiler;
      assertCompiler("stringify", compiler);
      assertNode(tree);
      return compiler(tree, realFile);
    }
    /**
     * Configure the processor to use a plugin, a list of usable values, or a
     * preset.
     *
     * If the processor is already using a plugin, the previous plugin
     * configuration is changed based on the options that are passed in.
     * In other words, the plugin is not added a second time.
     *
     * > 👉 **Note**: `use` cannot be called on *frozen* processors.
     * > Call the processor first to create a new unfrozen processor.
     *
     * @example
     *   There are many ways to pass plugins to `.use()`.
     *   This example gives an overview:
     *
     *   ```js
     *   import {unified} from 'unified'
     *
     *   unified()
     *     // Plugin with options:
     *     .use(pluginA, {x: true, y: true})
     *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
     *     .use(pluginA, {y: false, z: true})
     *     // Plugins:
     *     .use([pluginB, pluginC])
     *     // Two plugins, the second with options:
     *     .use([pluginD, [pluginE, {}]])
     *     // Preset with plugins and settings:
     *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
     *     // Settings only:
     *     .use({settings: {position: false}})
     *   ```
     *
     * @template {Array<unknown>} [Parameters=[]]
     * @template {Node | string | undefined} [Input=undefined]
     * @template [Output=Input]
     *
     * @overload
     * @param {Preset | null | undefined} [preset]
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @overload
     * @param {PluggableList} list
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @overload
     * @param {Plugin<Parameters, Input, Output>} plugin
     * @param {...(Parameters | [boolean])} parameters
     * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
     *
     * @param {PluggableList | Plugin | Preset | null | undefined} value
     *   Usable value.
     * @param {...unknown} parameters
     *   Parameters, when a plugin is given as a usable value.
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *   Current processor.
     */
    use(value, ...parameters) {
      const attachers = this.attachers;
      const namespace = this.namespace;
      assertUnfrozen("use", this.frozen);
      if (value === null || value === void 0) {
      } else if (typeof value === "function") {
        addPlugin(value, parameters);
      } else if (typeof value === "object") {
        if (Array.isArray(value)) {
          addList(value);
        } else {
          addPreset(value);
        }
      } else {
        throw new TypeError("Expected usable value, not `" + value + "`");
      }
      return this;
      function add2(value2) {
        if (typeof value2 === "function") {
          addPlugin(value2, []);
        } else if (typeof value2 === "object") {
          if (Array.isArray(value2)) {
            const [plugin, ...parameters2] = (
              /** @type {PluginTuple<Array<unknown>>} */
              value2
            );
            addPlugin(plugin, parameters2);
          } else {
            addPreset(value2);
          }
        } else {
          throw new TypeError("Expected usable value, not `" + value2 + "`");
        }
      }
      function addPreset(result) {
        if (!("plugins" in result) && !("settings" in result)) {
          throw new Error(
            "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
          );
        }
        addList(result.plugins);
        if (result.settings) {
          namespace.settings = (0, import_extend.default)(true, namespace.settings, result.settings);
        }
      }
      function addList(plugins) {
        let index2 = -1;
        if (plugins === null || plugins === void 0) {
        } else if (Array.isArray(plugins)) {
          while (++index2 < plugins.length) {
            const thing = plugins[index2];
            add2(thing);
          }
        } else {
          throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
        }
      }
      function addPlugin(plugin, parameters2) {
        let index2 = -1;
        let entryIndex = -1;
        while (++index2 < attachers.length) {
          if (attachers[index2][0] === plugin) {
            entryIndex = index2;
            break;
          }
        }
        if (entryIndex === -1) {
          attachers.push([plugin, ...parameters2]);
        } else if (parameters2.length > 0) {
          let [primary, ...rest] = parameters2;
          const currentPrimary = attachers[entryIndex][1];
          if (isPlainObject(currentPrimary) && isPlainObject(primary)) {
            primary = (0, import_extend.default)(true, currentPrimary, primary);
          }
          attachers[entryIndex] = [plugin, primary, ...rest];
        }
      }
    }
  };
  var unified = new Processor().freeze();
  function assertParser(name2, value) {
    if (typeof value !== "function") {
      throw new TypeError("Cannot `" + name2 + "` without `parser`");
    }
  }
  function assertCompiler(name2, value) {
    if (typeof value !== "function") {
      throw new TypeError("Cannot `" + name2 + "` without `compiler`");
    }
  }
  function assertUnfrozen(name2, frozen) {
    if (frozen) {
      throw new Error(
        "Cannot call `" + name2 + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
      );
    }
  }
  function assertNode(node) {
    if (!isPlainObject(node) || typeof node.type !== "string") {
      throw new TypeError("Expected node, got `" + node + "`");
    }
  }
  function assertDone(name2, asyncName, complete) {
    if (!complete) {
      throw new Error(
        "`" + name2 + "` finished async. Use `" + asyncName + "` instead"
      );
    }
  }
  function vfile(value) {
    return looksLikeAVFile(value) ? value : new VFile(value);
  }
  function looksLikeAVFile(value) {
    return Boolean(
      value && typeof value === "object" && "message" in value && "messages" in value
    );
  }
  function looksLikeAValue(value) {
    return typeof value === "string" || isUint8Array2(value);
  }
  function isUint8Array2(value) {
    return Boolean(
      value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
    );
  }

  // node_modules/.pnpm/unist-util-is@6.0.0/node_modules/unist-util-is/lib/index.js
  var convert = (
    // Note: overloads in JSDoc can’t yet use different `@template`s.
    /**
     * @type {(
     *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
     *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
     *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
     *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
     *   ((test?: Test) => Check)
     * )}
     */
    /**
     * @param {Test} [test]
     * @returns {Check}
     */
    function(test2) {
      if (test2 === null || test2 === void 0) {
        return ok2;
      }
      if (typeof test2 === "function") {
        return castFactory(test2);
      }
      if (typeof test2 === "object") {
        return Array.isArray(test2) ? anyFactory(test2) : propsFactory(test2);
      }
      if (typeof test2 === "string") {
        return typeFactory(test2);
      }
      throw new Error("Expected function, string, or object as test");
    }
  );
  function anyFactory(tests) {
    const checks2 = [];
    let index2 = -1;
    while (++index2 < tests.length) {
      checks2[index2] = convert(tests[index2]);
    }
    return castFactory(any);
    function any(...parameters) {
      let index3 = -1;
      while (++index3 < checks2.length) {
        if (checks2[index3].apply(this, parameters))
          return true;
      }
      return false;
    }
  }
  function propsFactory(check) {
    const checkAsRecord = (
      /** @type {Record<string, unknown>} */
      check
    );
    return castFactory(all5);
    function all5(node) {
      const nodeAsRecord = (
        /** @type {Record<string, unknown>} */
        /** @type {unknown} */
        node
      );
      let key2;
      for (key2 in check) {
        if (nodeAsRecord[key2] !== checkAsRecord[key2])
          return false;
      }
      return true;
    }
  }
  function typeFactory(check) {
    return castFactory(type);
    function type(node) {
      return node && node.type === check;
    }
  }
  function castFactory(testFunction) {
    return check;
    function check(value, index2, parent) {
      return Boolean(
        looksLikeANode(value) && testFunction.call(
          this,
          value,
          typeof index2 === "number" ? index2 : void 0,
          parent || void 0
        )
      );
    }
  }
  function ok2() {
    return true;
  }
  function looksLikeANode(value) {
    return value !== null && typeof value === "object" && "type" in value;
  }

  // node_modules/.pnpm/unist-util-visit-parents@6.0.1/node_modules/unist-util-visit-parents/lib/color.js
  function color(d) {
    return d;
  }

  // node_modules/.pnpm/unist-util-visit-parents@6.0.1/node_modules/unist-util-visit-parents/lib/index.js
  var empty = [];
  var CONTINUE = true;
  var EXIT = false;
  var SKIP = "skip";
  function visitParents(tree, test2, visitor, reverse) {
    let check;
    if (typeof test2 === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test2;
    } else {
      check = test2;
    }
    const is4 = convert(check);
    const step = reverse ? -1 : 1;
    factory2(tree, void 0, [])();
    function factory2(node, index2, parents) {
      const value = (
        /** @type {Record<string, unknown>} */
        node && typeof node === "object" ? node : {}
      );
      if (typeof value.type === "string") {
        const name2 = (
          // `hast`
          typeof value.tagName === "string" ? value.tagName : (
            // `xast`
            typeof value.name === "string" ? value.name : void 0
          )
        );
        Object.defineProperty(visit2, "name", {
          value: "node (" + color(node.type + (name2 ? "<" + name2 + ">" : "")) + ")"
        });
      }
      return visit2;
      function visit2() {
        let result = empty;
        let subresult;
        let offset;
        let grandparents;
        if (!test2 || is4(node, index2, parents[parents.length - 1] || void 0)) {
          result = toResult(visitor(node, parents));
          if (result[0] === EXIT) {
            return result;
          }
        }
        if ("children" in node && node.children) {
          const nodeAsParent = (
            /** @type {UnistParent} */
            node
          );
          if (nodeAsParent.children && result[0] !== SKIP) {
            offset = (reverse ? nodeAsParent.children.length : -1) + step;
            grandparents = parents.concat(nodeAsParent);
            while (offset > -1 && offset < nodeAsParent.children.length) {
              const child = nodeAsParent.children[offset];
              subresult = factory2(child, offset, grandparents)();
              if (subresult[0] === EXIT) {
                return subresult;
              }
              offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
            }
          }
        }
        return result;
      }
    }
  }
  function toResult(value) {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "number") {
      return [CONTINUE, value];
    }
    return value === null || value === void 0 ? empty : [value];
  }

  // node_modules/.pnpm/unist-util-visit@5.0.0/node_modules/unist-util-visit/lib/index.js
  function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
    let reverse;
    let test2;
    let visitor;
    if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
      test2 = void 0;
      visitor = testOrVisitor;
      reverse = visitorOrReverse;
    } else {
      test2 = testOrVisitor;
      visitor = visitorOrReverse;
      reverse = maybeReverse;
    }
    visitParents(tree, test2, overload, reverse);
    function overload(node, parents) {
      const parent = parents[parents.length - 1];
      const index2 = parent ? parent.children.indexOf(node) : void 0;
      return visitor(node, index2, parent);
    }
  }

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/util/schema.js
  var Schema = class {
    /**
     * @constructor
     * @param {Properties} property
     * @param {Normal} normal
     * @param {string} [space]
     */
    constructor(property, normal, space) {
      this.property = property;
      this.normal = normal;
      if (space) {
        this.space = space;
      }
    }
  };
  Schema.prototype.property = {};
  Schema.prototype.normal = {};
  Schema.prototype.space = null;

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/util/merge.js
  function merge(definitions, space) {
    const property = {};
    const normal = {};
    let index2 = -1;
    while (++index2 < definitions.length) {
      Object.assign(property, definitions[index2].property);
      Object.assign(normal, definitions[index2].normal);
    }
    return new Schema(property, normal, space);
  }

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/normalize.js
  function normalize2(value) {
    return value.toLowerCase();
  }

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/util/info.js
  var Info = class {
    /**
     * @constructor
     * @param {string} property
     * @param {string} attribute
     */
    constructor(property, attribute2) {
      this.property = property;
      this.attribute = attribute2;
    }
  };
  Info.prototype.space = null;
  Info.prototype.boolean = false;
  Info.prototype.booleanish = false;
  Info.prototype.overloadedBoolean = false;
  Info.prototype.number = false;
  Info.prototype.commaSeparated = false;
  Info.prototype.spaceSeparated = false;
  Info.prototype.commaOrSpaceSeparated = false;
  Info.prototype.mustUseProperty = false;
  Info.prototype.defined = false;

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/util/types.js
  var types_exports = {};
  __export(types_exports, {
    boolean: () => boolean,
    booleanish: () => booleanish,
    commaOrSpaceSeparated: () => commaOrSpaceSeparated,
    commaSeparated: () => commaSeparated,
    number: () => number,
    overloadedBoolean: () => overloadedBoolean,
    spaceSeparated: () => spaceSeparated
  });
  var powers = 0;
  var boolean = increment();
  var booleanish = increment();
  var overloadedBoolean = increment();
  var number = increment();
  var spaceSeparated = increment();
  var commaSeparated = increment();
  var commaOrSpaceSeparated = increment();
  function increment() {
    return 2 ** ++powers;
  }

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/util/defined-info.js
  var checks = Object.keys(types_exports);
  var DefinedInfo = class extends Info {
    /**
     * @constructor
     * @param {string} property
     * @param {string} attribute
     * @param {number|null} [mask]
     * @param {string} [space]
     */
    constructor(property, attribute2, mask, space) {
      let index2 = -1;
      super(property, attribute2);
      mark(this, "space", space);
      if (typeof mask === "number") {
        while (++index2 < checks.length) {
          const check = checks[index2];
          mark(this, checks[index2], (mask & types_exports[check]) === types_exports[check]);
        }
      }
    }
  };
  DefinedInfo.prototype.defined = true;
  function mark(values, key2, value) {
    if (value) {
      values[key2] = value;
    }
  }

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/util/create.js
  var own2 = {}.hasOwnProperty;
  function create(definition) {
    const property = {};
    const normal = {};
    let prop;
    for (prop in definition.properties) {
      if (own2.call(definition.properties, prop)) {
        const value = definition.properties[prop];
        const info = new DefinedInfo(
          prop,
          definition.transform(definition.attributes || {}, prop),
          value,
          definition.space
        );
        if (definition.mustUseProperty && definition.mustUseProperty.includes(prop)) {
          info.mustUseProperty = true;
        }
        property[prop] = info;
        normal[normalize2(prop)] = prop;
        normal[normalize2(info.attribute)] = prop;
      }
    }
    return new Schema(property, normal, definition.space);
  }

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/xlink.js
  var xlink = create({
    space: "xlink",
    transform(_, prop) {
      return "xlink:" + prop.slice(5).toLowerCase();
    },
    properties: {
      xLinkActuate: null,
      xLinkArcRole: null,
      xLinkHref: null,
      xLinkRole: null,
      xLinkShow: null,
      xLinkTitle: null,
      xLinkType: null
    }
  });

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/xml.js
  var xml = create({
    space: "xml",
    transform(_, prop) {
      return "xml:" + prop.slice(3).toLowerCase();
    },
    properties: { xmlLang: null, xmlBase: null, xmlSpace: null }
  });

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/util/case-sensitive-transform.js
  function caseSensitiveTransform(attributes, attribute2) {
    return attribute2 in attributes ? attributes[attribute2] : attribute2;
  }

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/util/case-insensitive-transform.js
  function caseInsensitiveTransform(attributes, property) {
    return caseSensitiveTransform(attributes, property.toLowerCase());
  }

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/xmlns.js
  var xmlns = create({
    space: "xmlns",
    attributes: { xmlnsxlink: "xmlns:xlink" },
    transform: caseInsensitiveTransform,
    properties: { xmlns: null, xmlnsXLink: null }
  });

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/aria.js
  var aria = create({
    transform(_, prop) {
      return prop === "role" ? prop : "aria-" + prop.slice(4).toLowerCase();
    },
    properties: {
      ariaActiveDescendant: null,
      ariaAtomic: booleanish,
      ariaAutoComplete: null,
      ariaBusy: booleanish,
      ariaChecked: booleanish,
      ariaColCount: number,
      ariaColIndex: number,
      ariaColSpan: number,
      ariaControls: spaceSeparated,
      ariaCurrent: null,
      ariaDescribedBy: spaceSeparated,
      ariaDetails: null,
      ariaDisabled: booleanish,
      ariaDropEffect: spaceSeparated,
      ariaErrorMessage: null,
      ariaExpanded: booleanish,
      ariaFlowTo: spaceSeparated,
      ariaGrabbed: booleanish,
      ariaHasPopup: null,
      ariaHidden: booleanish,
      ariaInvalid: null,
      ariaKeyShortcuts: null,
      ariaLabel: null,
      ariaLabelledBy: spaceSeparated,
      ariaLevel: number,
      ariaLive: null,
      ariaModal: booleanish,
      ariaMultiLine: booleanish,
      ariaMultiSelectable: booleanish,
      ariaOrientation: null,
      ariaOwns: spaceSeparated,
      ariaPlaceholder: null,
      ariaPosInSet: number,
      ariaPressed: booleanish,
      ariaReadOnly: booleanish,
      ariaRelevant: null,
      ariaRequired: booleanish,
      ariaRoleDescription: spaceSeparated,
      ariaRowCount: number,
      ariaRowIndex: number,
      ariaRowSpan: number,
      ariaSelected: booleanish,
      ariaSetSize: number,
      ariaSort: null,
      ariaValueMax: number,
      ariaValueMin: number,
      ariaValueNow: number,
      ariaValueText: null,
      role: null
    }
  });

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/html.js
  var html = create({
    space: "html",
    attributes: {
      acceptcharset: "accept-charset",
      classname: "class",
      htmlfor: "for",
      httpequiv: "http-equiv"
    },
    transform: caseInsensitiveTransform,
    mustUseProperty: ["checked", "multiple", "muted", "selected"],
    properties: {
      // Standard Properties.
      abbr: null,
      accept: commaSeparated,
      acceptCharset: spaceSeparated,
      accessKey: spaceSeparated,
      action: null,
      allow: null,
      allowFullScreen: boolean,
      allowPaymentRequest: boolean,
      allowUserMedia: boolean,
      alt: null,
      as: null,
      async: boolean,
      autoCapitalize: null,
      autoComplete: spaceSeparated,
      autoFocus: boolean,
      autoPlay: boolean,
      blocking: spaceSeparated,
      capture: null,
      charSet: null,
      checked: boolean,
      cite: null,
      className: spaceSeparated,
      cols: number,
      colSpan: null,
      content: null,
      contentEditable: booleanish,
      controls: boolean,
      controlsList: spaceSeparated,
      coords: number | commaSeparated,
      crossOrigin: null,
      data: null,
      dateTime: null,
      decoding: null,
      default: boolean,
      defer: boolean,
      dir: null,
      dirName: null,
      disabled: boolean,
      download: overloadedBoolean,
      draggable: booleanish,
      encType: null,
      enterKeyHint: null,
      fetchPriority: null,
      form: null,
      formAction: null,
      formEncType: null,
      formMethod: null,
      formNoValidate: boolean,
      formTarget: null,
      headers: spaceSeparated,
      height: number,
      hidden: boolean,
      high: number,
      href: null,
      hrefLang: null,
      htmlFor: spaceSeparated,
      httpEquiv: spaceSeparated,
      id: null,
      imageSizes: null,
      imageSrcSet: null,
      inert: boolean,
      inputMode: null,
      integrity: null,
      is: null,
      isMap: boolean,
      itemId: null,
      itemProp: spaceSeparated,
      itemRef: spaceSeparated,
      itemScope: boolean,
      itemType: spaceSeparated,
      kind: null,
      label: null,
      lang: null,
      language: null,
      list: null,
      loading: null,
      loop: boolean,
      low: number,
      manifest: null,
      max: null,
      maxLength: number,
      media: null,
      method: null,
      min: null,
      minLength: number,
      multiple: boolean,
      muted: boolean,
      name: null,
      nonce: null,
      noModule: boolean,
      noValidate: boolean,
      onAbort: null,
      onAfterPrint: null,
      onAuxClick: null,
      onBeforeMatch: null,
      onBeforePrint: null,
      onBeforeToggle: null,
      onBeforeUnload: null,
      onBlur: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onContextLost: null,
      onContextMenu: null,
      onContextRestored: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFormData: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLanguageChange: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadEnd: null,
      onLoadStart: null,
      onMessage: null,
      onMessageError: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRejectionHandled: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onScrollEnd: null,
      onSecurityPolicyViolation: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onSlotChange: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnhandledRejection: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onWheel: null,
      open: boolean,
      optimum: number,
      pattern: null,
      ping: spaceSeparated,
      placeholder: null,
      playsInline: boolean,
      popover: null,
      popoverTarget: null,
      popoverTargetAction: null,
      poster: null,
      preload: null,
      readOnly: boolean,
      referrerPolicy: null,
      rel: spaceSeparated,
      required: boolean,
      reversed: boolean,
      rows: number,
      rowSpan: number,
      sandbox: spaceSeparated,
      scope: null,
      scoped: boolean,
      seamless: boolean,
      selected: boolean,
      shadowRootDelegatesFocus: boolean,
      shadowRootMode: null,
      shape: null,
      size: number,
      sizes: null,
      slot: null,
      span: number,
      spellCheck: booleanish,
      src: null,
      srcDoc: null,
      srcLang: null,
      srcSet: null,
      start: number,
      step: null,
      style: null,
      tabIndex: number,
      target: null,
      title: null,
      translate: null,
      type: null,
      typeMustMatch: boolean,
      useMap: null,
      value: booleanish,
      width: number,
      wrap: null,
      // Legacy.
      // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
      align: null,
      // Several. Use CSS `text-align` instead,
      aLink: null,
      // `<body>`. Use CSS `a:active {color}` instead
      archive: spaceSeparated,
      // `<object>`. List of URIs to archives
      axis: null,
      // `<td>` and `<th>`. Use `scope` on `<th>`
      background: null,
      // `<body>`. Use CSS `background-image` instead
      bgColor: null,
      // `<body>` and table elements. Use CSS `background-color` instead
      border: number,
      // `<table>`. Use CSS `border-width` instead,
      borderColor: null,
      // `<table>`. Use CSS `border-color` instead,
      bottomMargin: number,
      // `<body>`
      cellPadding: null,
      // `<table>`
      cellSpacing: null,
      // `<table>`
      char: null,
      // Several table elements. When `align=char`, sets the character to align on
      charOff: null,
      // Several table elements. When `char`, offsets the alignment
      classId: null,
      // `<object>`
      clear: null,
      // `<br>`. Use CSS `clear` instead
      code: null,
      // `<object>`
      codeBase: null,
      // `<object>`
      codeType: null,
      // `<object>`
      color: null,
      // `<font>` and `<hr>`. Use CSS instead
      compact: boolean,
      // Lists. Use CSS to reduce space between items instead
      declare: boolean,
      // `<object>`
      event: null,
      // `<script>`
      face: null,
      // `<font>`. Use CSS instead
      frame: null,
      // `<table>`
      frameBorder: null,
      // `<iframe>`. Use CSS `border` instead
      hSpace: number,
      // `<img>` and `<object>`
      leftMargin: number,
      // `<body>`
      link: null,
      // `<body>`. Use CSS `a:link {color: *}` instead
      longDesc: null,
      // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
      lowSrc: null,
      // `<img>`. Use a `<picture>`
      marginHeight: number,
      // `<body>`
      marginWidth: number,
      // `<body>`
      noResize: boolean,
      // `<frame>`
      noHref: boolean,
      // `<area>`. Use no href instead of an explicit `nohref`
      noShade: boolean,
      // `<hr>`. Use background-color and height instead of borders
      noWrap: boolean,
      // `<td>` and `<th>`
      object: null,
      // `<applet>`
      profile: null,
      // `<head>`
      prompt: null,
      // `<isindex>`
      rev: null,
      // `<link>`
      rightMargin: number,
      // `<body>`
      rules: null,
      // `<table>`
      scheme: null,
      // `<meta>`
      scrolling: booleanish,
      // `<frame>`. Use overflow in the child context
      standby: null,
      // `<object>`
      summary: null,
      // `<table>`
      text: null,
      // `<body>`. Use CSS `color` instead
      topMargin: number,
      // `<body>`
      valueType: null,
      // `<param>`
      version: null,
      // `<html>`. Use a doctype.
      vAlign: null,
      // Several. Use CSS `vertical-align` instead
      vLink: null,
      // `<body>`. Use CSS `a:visited {color}` instead
      vSpace: number,
      // `<img>` and `<object>`
      // Non-standard Properties.
      allowTransparency: null,
      autoCorrect: null,
      autoSave: null,
      disablePictureInPicture: boolean,
      disableRemotePlayback: boolean,
      prefix: null,
      property: null,
      results: number,
      security: null,
      unselectable: null
    }
  });

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/svg.js
  var svg = create({
    space: "svg",
    attributes: {
      accentHeight: "accent-height",
      alignmentBaseline: "alignment-baseline",
      arabicForm: "arabic-form",
      baselineShift: "baseline-shift",
      capHeight: "cap-height",
      className: "class",
      clipPath: "clip-path",
      clipRule: "clip-rule",
      colorInterpolation: "color-interpolation",
      colorInterpolationFilters: "color-interpolation-filters",
      colorProfile: "color-profile",
      colorRendering: "color-rendering",
      crossOrigin: "crossorigin",
      dataType: "datatype",
      dominantBaseline: "dominant-baseline",
      enableBackground: "enable-background",
      fillOpacity: "fill-opacity",
      fillRule: "fill-rule",
      floodColor: "flood-color",
      floodOpacity: "flood-opacity",
      fontFamily: "font-family",
      fontSize: "font-size",
      fontSizeAdjust: "font-size-adjust",
      fontStretch: "font-stretch",
      fontStyle: "font-style",
      fontVariant: "font-variant",
      fontWeight: "font-weight",
      glyphName: "glyph-name",
      glyphOrientationHorizontal: "glyph-orientation-horizontal",
      glyphOrientationVertical: "glyph-orientation-vertical",
      hrefLang: "hreflang",
      horizAdvX: "horiz-adv-x",
      horizOriginX: "horiz-origin-x",
      horizOriginY: "horiz-origin-y",
      imageRendering: "image-rendering",
      letterSpacing: "letter-spacing",
      lightingColor: "lighting-color",
      markerEnd: "marker-end",
      markerMid: "marker-mid",
      markerStart: "marker-start",
      navDown: "nav-down",
      navDownLeft: "nav-down-left",
      navDownRight: "nav-down-right",
      navLeft: "nav-left",
      navNext: "nav-next",
      navPrev: "nav-prev",
      navRight: "nav-right",
      navUp: "nav-up",
      navUpLeft: "nav-up-left",
      navUpRight: "nav-up-right",
      onAbort: "onabort",
      onActivate: "onactivate",
      onAfterPrint: "onafterprint",
      onBeforePrint: "onbeforeprint",
      onBegin: "onbegin",
      onCancel: "oncancel",
      onCanPlay: "oncanplay",
      onCanPlayThrough: "oncanplaythrough",
      onChange: "onchange",
      onClick: "onclick",
      onClose: "onclose",
      onCopy: "oncopy",
      onCueChange: "oncuechange",
      onCut: "oncut",
      onDblClick: "ondblclick",
      onDrag: "ondrag",
      onDragEnd: "ondragend",
      onDragEnter: "ondragenter",
      onDragExit: "ondragexit",
      onDragLeave: "ondragleave",
      onDragOver: "ondragover",
      onDragStart: "ondragstart",
      onDrop: "ondrop",
      onDurationChange: "ondurationchange",
      onEmptied: "onemptied",
      onEnd: "onend",
      onEnded: "onended",
      onError: "onerror",
      onFocus: "onfocus",
      onFocusIn: "onfocusin",
      onFocusOut: "onfocusout",
      onHashChange: "onhashchange",
      onInput: "oninput",
      onInvalid: "oninvalid",
      onKeyDown: "onkeydown",
      onKeyPress: "onkeypress",
      onKeyUp: "onkeyup",
      onLoad: "onload",
      onLoadedData: "onloadeddata",
      onLoadedMetadata: "onloadedmetadata",
      onLoadStart: "onloadstart",
      onMessage: "onmessage",
      onMouseDown: "onmousedown",
      onMouseEnter: "onmouseenter",
      onMouseLeave: "onmouseleave",
      onMouseMove: "onmousemove",
      onMouseOut: "onmouseout",
      onMouseOver: "onmouseover",
      onMouseUp: "onmouseup",
      onMouseWheel: "onmousewheel",
      onOffline: "onoffline",
      onOnline: "ononline",
      onPageHide: "onpagehide",
      onPageShow: "onpageshow",
      onPaste: "onpaste",
      onPause: "onpause",
      onPlay: "onplay",
      onPlaying: "onplaying",
      onPopState: "onpopstate",
      onProgress: "onprogress",
      onRateChange: "onratechange",
      onRepeat: "onrepeat",
      onReset: "onreset",
      onResize: "onresize",
      onScroll: "onscroll",
      onSeeked: "onseeked",
      onSeeking: "onseeking",
      onSelect: "onselect",
      onShow: "onshow",
      onStalled: "onstalled",
      onStorage: "onstorage",
      onSubmit: "onsubmit",
      onSuspend: "onsuspend",
      onTimeUpdate: "ontimeupdate",
      onToggle: "ontoggle",
      onUnload: "onunload",
      onVolumeChange: "onvolumechange",
      onWaiting: "onwaiting",
      onZoom: "onzoom",
      overlinePosition: "overline-position",
      overlineThickness: "overline-thickness",
      paintOrder: "paint-order",
      panose1: "panose-1",
      pointerEvents: "pointer-events",
      referrerPolicy: "referrerpolicy",
      renderingIntent: "rendering-intent",
      shapeRendering: "shape-rendering",
      stopColor: "stop-color",
      stopOpacity: "stop-opacity",
      strikethroughPosition: "strikethrough-position",
      strikethroughThickness: "strikethrough-thickness",
      strokeDashArray: "stroke-dasharray",
      strokeDashOffset: "stroke-dashoffset",
      strokeLineCap: "stroke-linecap",
      strokeLineJoin: "stroke-linejoin",
      strokeMiterLimit: "stroke-miterlimit",
      strokeOpacity: "stroke-opacity",
      strokeWidth: "stroke-width",
      tabIndex: "tabindex",
      textAnchor: "text-anchor",
      textDecoration: "text-decoration",
      textRendering: "text-rendering",
      transformOrigin: "transform-origin",
      typeOf: "typeof",
      underlinePosition: "underline-position",
      underlineThickness: "underline-thickness",
      unicodeBidi: "unicode-bidi",
      unicodeRange: "unicode-range",
      unitsPerEm: "units-per-em",
      vAlphabetic: "v-alphabetic",
      vHanging: "v-hanging",
      vIdeographic: "v-ideographic",
      vMathematical: "v-mathematical",
      vectorEffect: "vector-effect",
      vertAdvY: "vert-adv-y",
      vertOriginX: "vert-origin-x",
      vertOriginY: "vert-origin-y",
      wordSpacing: "word-spacing",
      writingMode: "writing-mode",
      xHeight: "x-height",
      // These were camelcased in Tiny. Now lowercased in SVG 2
      playbackOrder: "playbackorder",
      timelineBegin: "timelinebegin"
    },
    transform: caseSensitiveTransform,
    properties: {
      about: commaOrSpaceSeparated,
      accentHeight: number,
      accumulate: null,
      additive: null,
      alignmentBaseline: null,
      alphabetic: number,
      amplitude: number,
      arabicForm: null,
      ascent: number,
      attributeName: null,
      attributeType: null,
      azimuth: number,
      bandwidth: null,
      baselineShift: null,
      baseFrequency: null,
      baseProfile: null,
      bbox: null,
      begin: null,
      bias: number,
      by: null,
      calcMode: null,
      capHeight: number,
      className: spaceSeparated,
      clip: null,
      clipPath: null,
      clipPathUnits: null,
      clipRule: null,
      color: null,
      colorInterpolation: null,
      colorInterpolationFilters: null,
      colorProfile: null,
      colorRendering: null,
      content: null,
      contentScriptType: null,
      contentStyleType: null,
      crossOrigin: null,
      cursor: null,
      cx: null,
      cy: null,
      d: null,
      dataType: null,
      defaultAction: null,
      descent: number,
      diffuseConstant: number,
      direction: null,
      display: null,
      dur: null,
      divisor: number,
      dominantBaseline: null,
      download: boolean,
      dx: null,
      dy: null,
      edgeMode: null,
      editable: null,
      elevation: number,
      enableBackground: null,
      end: null,
      event: null,
      exponent: number,
      externalResourcesRequired: null,
      fill: null,
      fillOpacity: number,
      fillRule: null,
      filter: null,
      filterRes: null,
      filterUnits: null,
      floodColor: null,
      floodOpacity: null,
      focusable: null,
      focusHighlight: null,
      fontFamily: null,
      fontSize: null,
      fontSizeAdjust: null,
      fontStretch: null,
      fontStyle: null,
      fontVariant: null,
      fontWeight: null,
      format: null,
      fr: null,
      from: null,
      fx: null,
      fy: null,
      g1: commaSeparated,
      g2: commaSeparated,
      glyphName: commaSeparated,
      glyphOrientationHorizontal: null,
      glyphOrientationVertical: null,
      glyphRef: null,
      gradientTransform: null,
      gradientUnits: null,
      handler: null,
      hanging: number,
      hatchContentUnits: null,
      hatchUnits: null,
      height: null,
      href: null,
      hrefLang: null,
      horizAdvX: number,
      horizOriginX: number,
      horizOriginY: number,
      id: null,
      ideographic: number,
      imageRendering: null,
      initialVisibility: null,
      in: null,
      in2: null,
      intercept: number,
      k: number,
      k1: number,
      k2: number,
      k3: number,
      k4: number,
      kernelMatrix: commaOrSpaceSeparated,
      kernelUnitLength: null,
      keyPoints: null,
      // SEMI_COLON_SEPARATED
      keySplines: null,
      // SEMI_COLON_SEPARATED
      keyTimes: null,
      // SEMI_COLON_SEPARATED
      kerning: null,
      lang: null,
      lengthAdjust: null,
      letterSpacing: null,
      lightingColor: null,
      limitingConeAngle: number,
      local: null,
      markerEnd: null,
      markerMid: null,
      markerStart: null,
      markerHeight: null,
      markerUnits: null,
      markerWidth: null,
      mask: null,
      maskContentUnits: null,
      maskUnits: null,
      mathematical: null,
      max: null,
      media: null,
      mediaCharacterEncoding: null,
      mediaContentEncodings: null,
      mediaSize: number,
      mediaTime: null,
      method: null,
      min: null,
      mode: null,
      name: null,
      navDown: null,
      navDownLeft: null,
      navDownRight: null,
      navLeft: null,
      navNext: null,
      navPrev: null,
      navRight: null,
      navUp: null,
      navUpLeft: null,
      navUpRight: null,
      numOctaves: null,
      observer: null,
      offset: null,
      onAbort: null,
      onActivate: null,
      onAfterPrint: null,
      onBeforePrint: null,
      onBegin: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnd: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFocusIn: null,
      onFocusOut: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadStart: null,
      onMessage: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onMouseWheel: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRepeat: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onShow: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onZoom: null,
      opacity: null,
      operator: null,
      order: null,
      orient: null,
      orientation: null,
      origin: null,
      overflow: null,
      overlay: null,
      overlinePosition: number,
      overlineThickness: number,
      paintOrder: null,
      panose1: null,
      path: null,
      pathLength: number,
      patternContentUnits: null,
      patternTransform: null,
      patternUnits: null,
      phase: null,
      ping: spaceSeparated,
      pitch: null,
      playbackOrder: null,
      pointerEvents: null,
      points: null,
      pointsAtX: number,
      pointsAtY: number,
      pointsAtZ: number,
      preserveAlpha: null,
      preserveAspectRatio: null,
      primitiveUnits: null,
      propagate: null,
      property: commaOrSpaceSeparated,
      r: null,
      radius: null,
      referrerPolicy: null,
      refX: null,
      refY: null,
      rel: commaOrSpaceSeparated,
      rev: commaOrSpaceSeparated,
      renderingIntent: null,
      repeatCount: null,
      repeatDur: null,
      requiredExtensions: commaOrSpaceSeparated,
      requiredFeatures: commaOrSpaceSeparated,
      requiredFonts: commaOrSpaceSeparated,
      requiredFormats: commaOrSpaceSeparated,
      resource: null,
      restart: null,
      result: null,
      rotate: null,
      rx: null,
      ry: null,
      scale: null,
      seed: null,
      shapeRendering: null,
      side: null,
      slope: null,
      snapshotTime: null,
      specularConstant: number,
      specularExponent: number,
      spreadMethod: null,
      spacing: null,
      startOffset: null,
      stdDeviation: null,
      stemh: null,
      stemv: null,
      stitchTiles: null,
      stopColor: null,
      stopOpacity: null,
      strikethroughPosition: number,
      strikethroughThickness: number,
      string: null,
      stroke: null,
      strokeDashArray: commaOrSpaceSeparated,
      strokeDashOffset: null,
      strokeLineCap: null,
      strokeLineJoin: null,
      strokeMiterLimit: number,
      strokeOpacity: number,
      strokeWidth: null,
      style: null,
      surfaceScale: number,
      syncBehavior: null,
      syncBehaviorDefault: null,
      syncMaster: null,
      syncTolerance: null,
      syncToleranceDefault: null,
      systemLanguage: commaOrSpaceSeparated,
      tabIndex: number,
      tableValues: null,
      target: null,
      targetX: number,
      targetY: number,
      textAnchor: null,
      textDecoration: null,
      textRendering: null,
      textLength: null,
      timelineBegin: null,
      title: null,
      transformBehavior: null,
      type: null,
      typeOf: commaOrSpaceSeparated,
      to: null,
      transform: null,
      transformOrigin: null,
      u1: null,
      u2: null,
      underlinePosition: number,
      underlineThickness: number,
      unicode: null,
      unicodeBidi: null,
      unicodeRange: null,
      unitsPerEm: number,
      values: null,
      vAlphabetic: number,
      vMathematical: number,
      vectorEffect: null,
      vHanging: number,
      vIdeographic: number,
      version: null,
      vertAdvY: number,
      vertOriginX: number,
      vertOriginY: number,
      viewBox: null,
      viewTarget: null,
      visibility: null,
      width: null,
      widths: null,
      wordSpacing: null,
      writingMode: null,
      x: null,
      x1: null,
      x2: null,
      xChannelSelector: null,
      xHeight: number,
      y: null,
      y1: null,
      y2: null,
      yChannelSelector: null,
      z: null,
      zoomAndPan: null
    }
  });

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/lib/find.js
  var valid = /^data[-\w.:]+$/i;
  var dash = /-[a-z]/g;
  var cap = /[A-Z]/g;
  function find(schema, value) {
    const normal = normalize2(value);
    let prop = value;
    let Type = Info;
    if (normal in schema.normal) {
      return schema.property[schema.normal[normal]];
    }
    if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
      if (value.charAt(4) === "-") {
        const rest = value.slice(5).replace(dash, camelcase);
        prop = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
      } else {
        const rest = value.slice(4);
        if (!dash.test(rest)) {
          let dashes = rest.replace(cap, kebab);
          if (dashes.charAt(0) !== "-") {
            dashes = "-" + dashes;
          }
          value = "data" + dashes;
        }
      }
      Type = DefinedInfo;
    }
    return new Type(prop, value);
  }
  function kebab($0) {
    return "-" + $0.toLowerCase();
  }
  function camelcase($0) {
    return $0.charAt(1).toUpperCase();
  }

  // node_modules/.pnpm/property-information@6.4.1/node_modules/property-information/index.js
  var html2 = merge([xml, xlink, xmlns, aria, html], "html");
  var svg2 = merge([xml, xlink, xmlns, aria, svg], "svg");

  // node_modules/.pnpm/css-selector-parser@3.0.4/node_modules/css-selector-parser/dist/mjs/indexes.js
  var emptyMulticharIndex = {};
  var emptyRegularIndex = {};
  function extendIndex(item, index2) {
    var currentIndex = index2;
    for (var pos = 0; pos < item.length; pos++) {
      var isLast = pos === item.length - 1;
      var char = item.charAt(pos);
      var charIndex = currentIndex[char] || (currentIndex[char] = { chars: {} });
      if (isLast) {
        charIndex.self = item;
      }
      currentIndex = charIndex.chars;
    }
  }
  function createMulticharIndex(items) {
    if (items.length === 0) {
      return emptyMulticharIndex;
    }
    var index2 = {};
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
      var item = items_1[_i];
      extendIndex(item, index2);
    }
    return index2;
  }
  function createRegularIndex(items) {
    if (items.length === 0) {
      return emptyRegularIndex;
    }
    var result = {};
    for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
      var item = items_2[_i];
      result[item] = true;
    }
    return result;
  }

  // node_modules/.pnpm/css-selector-parser@3.0.4/node_modules/css-selector-parser/dist/mjs/pseudo-signatures.js
  var emptyPseudoSignatures = {};
  var defaultPseudoSignature = {
    type: "String",
    optional: true
  };
  function calculatePseudoSignature(types) {
    var result = {
      type: "NoArgument",
      optional: false
    };
    function setResultType(type2) {
      if (result.type && result.type !== type2 && result.type !== "NoArgument") {
        throw new Error('Conflicting pseudo-class argument type: "'.concat(result.type, '" vs "').concat(type2, '".'));
      }
      result.type = type2;
    }
    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
      var type = types_1[_i];
      if (type === "NoArgument") {
        result.optional = true;
      }
      if (type === "Formula") {
        setResultType("Formula");
      }
      if (type === "FormulaOfSelector") {
        setResultType("Formula");
        result.ofSelector = true;
      }
      if (type === "String") {
        setResultType("String");
      }
      if (type === "Selector") {
        setResultType("Selector");
      }
    }
    return result;
  }
  function inverseCategories(obj) {
    var result = {};
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
      var category = _a[_i];
      var items = obj[category];
      if (items) {
        for (var _b = 0, _c = items; _b < _c.length; _b++) {
          var item = _c[_b];
          (result[item] || (result[item] = [])).push(category);
        }
      }
    }
    return result;
  }
  function calculatePseudoSignatures(definitions) {
    var pseudoClassesToArgumentTypes = inverseCategories(definitions);
    var result = {};
    for (var _i = 0, _a = Object.keys(pseudoClassesToArgumentTypes); _i < _a.length; _i++) {
      var pseudoClass = _a[_i];
      var argumentTypes = pseudoClassesToArgumentTypes[pseudoClass];
      if (argumentTypes) {
        result[pseudoClass] = calculatePseudoSignature(argumentTypes);
      }
    }
    return result;
  }

  // node_modules/.pnpm/css-selector-parser@3.0.4/node_modules/css-selector-parser/dist/mjs/syntax-definitions.js
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s2, i = 1, n = arguments.length; i < n; i++) {
        s2 = arguments[i];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t[p2] = s2[p2];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var emptyXmlOptions = {};
  var defaultXmlOptions = { wildcard: true };
  function getXmlOptions(param) {
    if (param) {
      if (typeof param === "boolean") {
        return defaultXmlOptions;
      } else {
        return param;
      }
    } else {
      return emptyXmlOptions;
    }
  }
  function withMigration(migration, merge2) {
    return function(base, extension) {
      return merge2(migration(base), migration(extension));
    };
  }
  function withNoNegative(merge2) {
    return function(base, extension) {
      var result = merge2(base, extension);
      if (!result) {
        throw new Error("Syntax definition cannot be null or undefined.");
      }
      return result;
    };
  }
  function withPositive(positive, merge2) {
    return function(base, extension) {
      if (extension === true) {
        return positive;
      }
      return merge2(base === true ? positive : base, extension);
    };
  }
  function mergeSection(values) {
    return function(base, extension) {
      if (!extension || !base) {
        return extension;
      }
      if (typeof extension !== "object" || extension === null) {
        throw new Error("Unexpected syntax definition extension type: ".concat(extension, "."));
      }
      var result = __assign({}, base);
      for (var _i = 0, _a = Object.entries(extension); _i < _a.length; _i++) {
        var _b = _a[_i], key2 = _b[0], value = _b[1];
        var mergeSchema = values[key2];
        result[key2] = mergeSchema(base[key2], value);
      }
      return result;
    };
  }
  function replaceValueIfSpecified(base, extension) {
    if (extension !== void 0) {
      return extension;
    }
    return base;
  }
  function concatArray(base, extension) {
    if (!extension) {
      return base;
    }
    if (!base) {
      return extension;
    }
    return base.concat(extension);
  }
  function mergeDefinitions(base, extension) {
    if (!extension) {
      return base;
    }
    if (!base) {
      return extension;
    }
    var result = __assign({}, base);
    for (var _i = 0, _a = Object.entries(extension); _i < _a.length; _i++) {
      var _b = _a[_i], key2 = _b[0], value = _b[1];
      if (!value) {
        delete result[key2];
        continue;
      }
      var baseValue = base[key2];
      if (!baseValue) {
        result[key2] = value;
        continue;
      }
      result[key2] = baseValue.concat(value);
    }
    return result;
  }
  var extendSyntaxDefinition = withNoNegative(mergeSection({
    baseSyntax: replaceValueIfSpecified,
    tag: withPositive(defaultXmlOptions, mergeSection({
      wildcard: replaceValueIfSpecified
    })),
    ids: replaceValueIfSpecified,
    classNames: replaceValueIfSpecified,
    namespace: withPositive(defaultXmlOptions, mergeSection({
      wildcard: replaceValueIfSpecified
    })),
    combinators: concatArray,
    attributes: mergeSection({
      operators: concatArray,
      caseSensitivityModifiers: concatArray,
      unknownCaseSensitivityModifiers: replaceValueIfSpecified
    }),
    pseudoClasses: mergeSection({
      unknown: replaceValueIfSpecified,
      definitions: mergeDefinitions
    }),
    pseudoElements: mergeSection({
      unknown: replaceValueIfSpecified,
      notation: replaceValueIfSpecified,
      definitions: withMigration(function(definitions) {
        return Array.isArray(definitions) ? { NoArgument: definitions } : definitions;
      }, mergeDefinitions)
    })
  }));
  var css1SyntaxDefinition = {
    tag: {},
    ids: true,
    classNames: true,
    combinators: [],
    pseudoElements: {
      unknown: "reject",
      notation: "singleColon",
      definitions: ["first-letter", "first-line"]
    },
    pseudoClasses: {
      unknown: "reject",
      definitions: {
        NoArgument: ["link", "visited", "active"]
      }
    }
  };
  var css2SyntaxDefinition = extendSyntaxDefinition(css1SyntaxDefinition, {
    tag: { wildcard: true },
    combinators: [">", "+"],
    attributes: {
      unknownCaseSensitivityModifiers: "reject",
      operators: ["=", "~=", "|="]
    },
    pseudoElements: {
      definitions: ["before", "after"]
    },
    pseudoClasses: {
      unknown: "reject",
      definitions: {
        NoArgument: ["hover", "focus", "first-child"],
        String: ["lang"]
      }
    }
  });
  var selectors3SyntaxDefinition = extendSyntaxDefinition(css2SyntaxDefinition, {
    namespace: {
      wildcard: true
    },
    combinators: ["~"],
    attributes: {
      operators: ["^=", "$=", "*="]
    },
    pseudoElements: {
      notation: "both"
    },
    pseudoClasses: {
      definitions: {
        NoArgument: [
          "root",
          "last-child",
          "first-of-type",
          "last-of-type",
          "only-child",
          "only-of-type",
          "empty",
          "target",
          "enabled",
          "disabled",
          "checked",
          "indeterminate"
        ],
        Formula: ["nth-child", "nth-last-child", "nth-of-type", "nth-last-of-type"],
        Selector: ["not"]
      }
    }
  });
  var selectors4SyntaxDefinition = extendSyntaxDefinition(selectors3SyntaxDefinition, {
    combinators: ["||"],
    attributes: {
      caseSensitivityModifiers: ["i", "I", "s", "S"]
    },
    pseudoClasses: {
      definitions: {
        NoArgument: [
          "any-link",
          "local-link",
          "target-within",
          "scope",
          "current",
          "past",
          "future",
          "focus-within",
          "focus-visible",
          "read-write",
          "read-only",
          "placeholder-shown",
          "default",
          "valid",
          "invalid",
          "in-range",
          "out-of-range",
          "required",
          "optional",
          "blank",
          "user-invalid"
        ],
        Formula: ["nth-col", "nth-last-col"],
        String: ["dir"],
        FormulaOfSelector: ["nth-child", "nth-last-child"],
        Selector: ["current", "is", "where", "has"]
      }
    }
  });
  var progressiveSyntaxDefinition = extendSyntaxDefinition(selectors4SyntaxDefinition, {
    pseudoElements: {
      unknown: "accept"
    },
    pseudoClasses: {
      unknown: "accept"
    },
    attributes: {
      unknownCaseSensitivityModifiers: "accept"
    }
  });
  var cssSyntaxDefinitions = {
    css1: css1SyntaxDefinition,
    css2: css2SyntaxDefinition,
    css3: selectors3SyntaxDefinition,
    "selectors-3": selectors3SyntaxDefinition,
    "selectors-4": selectors4SyntaxDefinition,
    latest: selectors4SyntaxDefinition,
    progressive: progressiveSyntaxDefinition
  };

  // node_modules/.pnpm/css-selector-parser@3.0.4/node_modules/css-selector-parser/dist/mjs/utils.js
  function isIdentStart(c) {
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "-" || c === "_" || c === "\\" || c >= "\xA0";
  }
  function isIdent(c) {
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "-" || c === "_" || c >= "\xA0";
  }
  function isHex(c) {
    return c >= "a" && c <= "f" || c >= "A" && c <= "F" || c >= "0" && c <= "9";
  }
  var whitespaceChars = {
    " ": true,
    "	": true,
    "\n": true,
    "\r": true,
    "\f": true
  };
  var quoteChars = {
    '"': true,
    "'": true
  };
  var digitsChars = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true
  };
  var maxHexLength = 6;

  // node_modules/.pnpm/css-selector-parser@3.0.4/node_modules/css-selector-parser/dist/mjs/parser.js
  var errorPrefix = "css-selector-parser parse error: ";
  function createParser(options) {
    if (options === void 0) {
      options = {};
    }
    var _a = options.syntax, syntax = _a === void 0 ? "latest" : _a, substitutes = options.substitutes, _b = options.strict, strict = _b === void 0 ? true : _b;
    var syntaxDefinition = typeof syntax === "object" ? syntax : cssSyntaxDefinitions[syntax];
    if (syntaxDefinition.baseSyntax) {
      syntaxDefinition = extendSyntaxDefinition(cssSyntaxDefinitions[syntaxDefinition.baseSyntax], syntaxDefinition);
    }
    var _c = syntaxDefinition.tag ? [true, Boolean(getXmlOptions(syntaxDefinition.tag).wildcard)] : [false, false], tagNameEnabled = _c[0], tagNameWildcardEnabled = _c[1];
    var idEnabled = Boolean(syntaxDefinition.ids);
    var classNamesEnabled = Boolean(syntaxDefinition.classNames);
    var namespaceEnabled = Boolean(syntaxDefinition.namespace);
    var namespaceWildcardEnabled = syntaxDefinition.namespace && (syntaxDefinition.namespace === true || syntaxDefinition.namespace.wildcard === true);
    if (namespaceEnabled && !tagNameEnabled) {
      throw new Error("".concat(errorPrefix, "Namespaces cannot be enabled while tags are disabled."));
    }
    var substitutesEnabled = Boolean(substitutes);
    var combinatorsIndex = syntaxDefinition.combinators ? createMulticharIndex(syntaxDefinition.combinators) : emptyMulticharIndex;
    var _d = syntaxDefinition.attributes ? [
      true,
      syntaxDefinition.attributes.operators ? createMulticharIndex(syntaxDefinition.attributes.operators) : emptyMulticharIndex,
      syntaxDefinition.attributes.caseSensitivityModifiers ? createRegularIndex(syntaxDefinition.attributes.caseSensitivityModifiers) : emptyRegularIndex,
      syntaxDefinition.attributes.unknownCaseSensitivityModifiers === "accept"
    ] : [false, emptyMulticharIndex, emptyRegularIndex, false], attributesEnabled = _d[0], attributesOperatorsIndex = _d[1], attributesCaseSensitivityModifiers = _d[2], attributesAcceptUnknownCaseSensitivityModifiers = _d[3];
    var attributesCaseSensitivityModifiersEnabled = attributesAcceptUnknownCaseSensitivityModifiers || Object.keys(attributesCaseSensitivityModifiers).length > 0;
    var _e = syntaxDefinition.pseudoClasses ? [
      true,
      syntaxDefinition.pseudoClasses.definitions ? calculatePseudoSignatures(syntaxDefinition.pseudoClasses.definitions) : emptyPseudoSignatures,
      syntaxDefinition.pseudoClasses.unknown === "accept"
    ] : [false, emptyPseudoSignatures, false], pseudoClassesEnabled = _e[0], pseudoClassesDefinitions = _e[1], pseudoClassesAcceptUnknown = _e[2];
    var _f = syntaxDefinition.pseudoElements ? [
      true,
      syntaxDefinition.pseudoElements.notation === "singleColon" || syntaxDefinition.pseudoElements.notation === "both",
      !syntaxDefinition.pseudoElements.notation || syntaxDefinition.pseudoElements.notation === "doubleColon" || syntaxDefinition.pseudoElements.notation === "both",
      syntaxDefinition.pseudoElements.definitions ? calculatePseudoSignatures(Array.isArray(syntaxDefinition.pseudoElements.definitions) ? { NoArgument: syntaxDefinition.pseudoElements.definitions } : syntaxDefinition.pseudoElements.definitions) : emptyPseudoSignatures,
      syntaxDefinition.pseudoElements.unknown === "accept"
    ] : [false, false, false, emptyPseudoSignatures, false], pseudoElementsEnabled = _f[0], pseudoElementsSingleColonNotationEnabled = _f[1], pseudoElementsDoubleColonNotationEnabled = _f[2], pseudoElementsDefinitions = _f[3], pseudoElementsAcceptUnknown = _f[4];
    var str = "";
    var l = str.length;
    var pos = 0;
    var chr = "";
    var is4 = function(comparison) {
      return chr === comparison;
    };
    var isTagStart = function() {
      return is4("*") || isIdentStart(chr);
    };
    var rewind = function(newPos) {
      pos = newPos;
      chr = str.charAt(pos);
    };
    var next2 = function() {
      pos++;
      chr = str.charAt(pos);
    };
    var readAndNext = function() {
      var current = chr;
      pos++;
      chr = str.charAt(pos);
      return current;
    };
    function fail(errorMessage) {
      var position2 = Math.min(l - 1, pos);
      var error = new Error("".concat(errorPrefix).concat(errorMessage, " Pos: ").concat(position2, "."));
      error.position = position2;
      error.name = "ParserError";
      throw error;
    }
    function assert(condition, errorMessage) {
      if (!condition) {
        return fail(errorMessage);
      }
    }
    var assertNonEof = function() {
      assert(pos < l, "Unexpected end of input.");
    };
    var isEof = function() {
      return pos >= l;
    };
    var pass = function(character) {
      assert(pos < l, 'Expected "'.concat(character, '" but end of input reached.'));
      assert(chr === character, 'Expected "'.concat(character, '" but "').concat(chr, '" found.'));
      pos++;
      chr = str.charAt(pos);
    };
    function matchMulticharIndex(index2) {
      var match = matchMulticharIndexPos(index2, pos);
      if (match) {
        pos += match.length;
        chr = str.charAt(pos);
        return match;
      }
    }
    function matchMulticharIndexPos(index2, subPos) {
      var char = str.charAt(subPos);
      var charIndex = index2[char];
      if (charIndex) {
        var subMatch = matchMulticharIndexPos(charIndex.chars, subPos + 1);
        if (subMatch) {
          return subMatch;
        }
        if (charIndex.self) {
          return charIndex.self;
        }
      }
    }
    function parseHex() {
      var hex = readAndNext();
      var count2 = 1;
      while (isHex(chr) && count2 < maxHexLength) {
        hex += readAndNext();
        count2++;
      }
      skipSingleWhitespace();
      return String.fromCharCode(parseInt(hex, 16));
    }
    function parseString(quote) {
      var result = "";
      pass(quote);
      while (pos < l) {
        if (is4(quote)) {
          next2();
          return result;
        } else if (is4("\\")) {
          next2();
          if (is4(quote)) {
            result += quote;
            next2();
          } else if (chr === "\n" || chr === "\f") {
            next2();
          } else if (chr === "\r") {
            next2();
            if (is4("\n")) {
              next2();
            }
          } else if (isHex(chr)) {
            result += parseHex();
          } else {
            result += chr;
            next2();
          }
        } else {
          result += chr;
          next2();
        }
      }
      return result;
    }
    function parseIdentifier() {
      if (!isIdentStart(chr)) {
        return null;
      }
      var result = "";
      while (is4("-")) {
        result += chr;
        next2();
      }
      if (strict && result.length >= 2) {
        fail("Identifiers cannot start with two hyphens with strict mode on.");
      }
      if (digitsChars[chr]) {
        fail("Identifiers cannot start with hyphens followed by digits.");
      }
      while (pos < l) {
        if (isIdent(chr)) {
          result += readAndNext();
        } else if (is4("\\")) {
          next2();
          assertNonEof();
          if (isHex(chr)) {
            result += parseHex();
          } else {
            result += readAndNext();
          }
        } else {
          break;
        }
      }
      return result;
    }
    function parsePseudoClassString() {
      var result = "";
      while (pos < l) {
        if (is4(")")) {
          break;
        } else if (is4("\\")) {
          next2();
          if (isEof() && !strict) {
            return (result + "\\").trim();
          }
          assertNonEof();
          if (isHex(chr)) {
            result += parseHex();
          } else {
            result += readAndNext();
          }
        } else {
          result += readAndNext();
        }
      }
      return result.trim();
    }
    function skipSingleWhitespace() {
      if (chr === " " || chr === "	" || chr === "\f" || chr === "\n") {
        next2();
        return;
      }
      if (chr === "\r") {
        next2();
      }
      if (chr === "\n") {
        next2();
      }
    }
    function skipWhitespace() {
      while (whitespaceChars[chr]) {
        next2();
      }
    }
    function parseSelector2(relative) {
      if (relative === void 0) {
        relative = false;
      }
      skipWhitespace();
      var rules3 = [parseRule(relative)];
      while (is4(",")) {
        next2();
        skipWhitespace();
        rules3.push(parseRule(relative));
      }
      return {
        type: "Selector",
        rules: rules3
      };
    }
    function parseAttribute() {
      pass("[");
      skipWhitespace();
      var attr;
      if (is4("|")) {
        assert(namespaceEnabled, "Namespaces are not enabled.");
        next2();
        var name_1 = parseIdentifier();
        assert(name_1, "Expected attribute name.");
        attr = {
          type: "Attribute",
          name: name_1,
          namespace: { type: "NoNamespace" }
        };
      } else if (is4("*")) {
        assert(namespaceEnabled, "Namespaces are not enabled.");
        assert(namespaceWildcardEnabled, "Wildcard namespace is not enabled.");
        next2();
        pass("|");
        var name_2 = parseIdentifier();
        assert(name_2, "Expected attribute name.");
        attr = {
          type: "Attribute",
          name: name_2,
          namespace: { type: "WildcardNamespace" }
        };
      } else {
        var identifier = parseIdentifier();
        assert(identifier, "Expected attribute name.");
        attr = {
          type: "Attribute",
          name: identifier
        };
        if (is4("|")) {
          var savedPos = pos;
          next2();
          if (isIdentStart(chr)) {
            assert(namespaceEnabled, "Namespaces are not enabled.");
            var name_3 = parseIdentifier();
            assert(name_3, "Expected attribute name.");
            attr = {
              type: "Attribute",
              name: name_3,
              namespace: { type: "NamespaceName", name: identifier }
            };
          } else {
            rewind(savedPos);
          }
        }
      }
      assert(attr.name, "Expected attribute name.");
      skipWhitespace();
      if (isEof() && !strict) {
        return attr;
      }
      if (is4("]")) {
        next2();
      } else {
        attr.operator = matchMulticharIndex(attributesOperatorsIndex);
        assert(attr.operator, "Expected a valid attribute selector operator.");
        skipWhitespace();
        assertNonEof();
        if (quoteChars[chr]) {
          attr.value = {
            type: "String",
            value: parseString(chr)
          };
        } else if (substitutesEnabled && is4("$")) {
          next2();
          var name_4 = parseIdentifier();
          assert(name_4, "Expected substitute name.");
          attr.value = {
            type: "Substitution",
            name: name_4
          };
        } else {
          var value = parseIdentifier();
          assert(value, "Expected attribute value.");
          attr.value = {
            type: "String",
            value
          };
        }
        skipWhitespace();
        if (isEof() && !strict) {
          return attr;
        }
        if (!is4("]")) {
          var caseSensitivityModifier = parseIdentifier();
          assert(caseSensitivityModifier, "Expected end of attribute selector.");
          attr.caseSensitivityModifier = caseSensitivityModifier;
          assert(attributesCaseSensitivityModifiersEnabled, "Attribute case sensitivity modifiers are not enabled.");
          assert(attributesAcceptUnknownCaseSensitivityModifiers || attributesCaseSensitivityModifiers[attr.caseSensitivityModifier], "Unknown attribute case sensitivity modifier.");
          skipWhitespace();
          if (isEof() && !strict) {
            return attr;
          }
        }
        pass("]");
      }
      return attr;
    }
    function parseNumber() {
      var result = "";
      while (digitsChars[chr]) {
        result += readAndNext();
      }
      assert(result !== "", "Formula parse error.");
      return parseInt(result);
    }
    var isNumberStart = function() {
      return is4("-") || is4("+") || digitsChars[chr];
    };
    function parseFormula() {
      if (is4("e") || is4("o")) {
        var ident = parseIdentifier();
        if (ident === "even") {
          skipWhitespace();
          return [2, 0];
        }
        if (ident === "odd") {
          skipWhitespace();
          return [2, 1];
        }
      }
      var firstNumber = null;
      var firstNumberMultiplier = 1;
      if (is4("-")) {
        next2();
        firstNumberMultiplier = -1;
      }
      if (isNumberStart()) {
        if (is4("+")) {
          next2();
        }
        firstNumber = parseNumber();
        if (!is4("\\") && !is4("n")) {
          return [0, firstNumber * firstNumberMultiplier];
        }
      }
      if (firstNumber === null) {
        firstNumber = 1;
      }
      firstNumber *= firstNumberMultiplier;
      var identifier;
      if (is4("\\")) {
        next2();
        if (isHex(chr)) {
          identifier = parseHex();
        } else {
          identifier = readAndNext();
        }
      } else {
        identifier = readAndNext();
      }
      assert(identifier === "n", 'Formula parse error: expected "n".');
      skipWhitespace();
      if (is4("+") || is4("-")) {
        var sign = is4("+") ? 1 : -1;
        next2();
        skipWhitespace();
        return [firstNumber, sign * parseNumber()];
      } else {
        return [firstNumber, 0];
      }
    }
    function parsePseudoArgument(pseudoName, type, signature) {
      var argument;
      if (is4("(")) {
        next2();
        skipWhitespace();
        if (substitutesEnabled && is4("$")) {
          next2();
          var name_5 = parseIdentifier();
          assert(name_5, "Expected substitute name.");
          argument = {
            type: "Substitution",
            name: name_5
          };
        } else if (signature.type === "String") {
          argument = {
            type: "String",
            value: parsePseudoClassString()
          };
          assert(argument.value, "Expected ".concat(type, " argument value."));
        } else if (signature.type === "Selector") {
          argument = parseSelector2(true);
        } else if (signature.type === "Formula") {
          var _a2 = parseFormula(), a = _a2[0], b = _a2[1];
          argument = {
            type: "Formula",
            a,
            b
          };
          if (signature.ofSelector) {
            skipWhitespace();
            if (is4("o") || is4("\\")) {
              var ident = parseIdentifier();
              assert(ident === "of", "Formula of selector parse error.");
              skipWhitespace();
              argument = {
                type: "FormulaOfSelector",
                a,
                b,
                selector: parseRule()
              };
            }
          }
        } else {
          return fail("Invalid ".concat(type, " signature."));
        }
        skipWhitespace();
        if (isEof() && !strict) {
          return argument;
        }
        pass(")");
      } else {
        assert(signature.optional, "Argument is required for ".concat(type, ' "').concat(pseudoName, '".'));
      }
      return argument;
    }
    function parseTagName() {
      if (is4("*")) {
        assert(tagNameWildcardEnabled, "Wildcard tag name is not enabled.");
        next2();
        return { type: "WildcardTag" };
      } else if (isIdentStart(chr)) {
        assert(tagNameEnabled, "Tag names are not enabled.");
        var name_6 = parseIdentifier();
        assert(name_6, "Expected tag name.");
        return {
          type: "TagName",
          name: name_6
        };
      } else {
        return fail("Expected tag name.");
      }
    }
    function parseTagNameWithNamespace() {
      if (is4("*")) {
        var savedPos = pos;
        next2();
        if (!is4("|")) {
          rewind(savedPos);
          return parseTagName();
        }
        next2();
        if (!isTagStart()) {
          rewind(savedPos);
          return parseTagName();
        }
        assert(namespaceEnabled, "Namespaces are not enabled.");
        assert(namespaceWildcardEnabled, "Wildcard namespace is not enabled.");
        var tagName = parseTagName();
        tagName.namespace = { type: "WildcardNamespace" };
        return tagName;
      } else if (is4("|")) {
        assert(namespaceEnabled, "Namespaces are not enabled.");
        next2();
        var tagName = parseTagName();
        tagName.namespace = { type: "NoNamespace" };
        return tagName;
      } else if (isIdentStart(chr)) {
        var identifier = parseIdentifier();
        assert(identifier, "Expected tag name.");
        if (!is4("|")) {
          assert(tagNameEnabled, "Tag names are not enabled.");
          return {
            type: "TagName",
            name: identifier
          };
        }
        var savedPos = pos;
        next2();
        if (!isTagStart()) {
          rewind(savedPos);
          return {
            type: "TagName",
            name: identifier
          };
        }
        assert(namespaceEnabled, "Namespaces are not enabled.");
        var tagName = parseTagName();
        tagName.namespace = { type: "NamespaceName", name: identifier };
        return tagName;
      } else {
        return fail("Expected tag name.");
      }
    }
    function parseRule(relative) {
      var _a2, _b2;
      if (relative === void 0) {
        relative = false;
      }
      var rule = { type: "Rule", items: [] };
      if (relative) {
        var combinator = matchMulticharIndex(combinatorsIndex);
        if (combinator) {
          rule.combinator = combinator;
          skipWhitespace();
        }
      }
      while (pos < l) {
        if (isTagStart()) {
          assert(rule.items.length === 0, "Unexpected tag/namespace start.");
          rule.items.push(parseTagNameWithNamespace());
        } else if (is4("|")) {
          var savedPos = pos;
          next2();
          if (isTagStart()) {
            assert(rule.items.length === 0, "Unexpected tag/namespace start.");
            rewind(savedPos);
            rule.items.push(parseTagNameWithNamespace());
          } else {
            rewind(savedPos);
            break;
          }
        } else if (is4(".")) {
          assert(classNamesEnabled, "Class names are not enabled.");
          next2();
          var className2 = parseIdentifier();
          assert(className2, "Expected class name.");
          rule.items.push({ type: "ClassName", name: className2 });
        } else if (is4("#")) {
          assert(idEnabled, "IDs are not enabled.");
          next2();
          var idName = parseIdentifier();
          assert(idName, "Expected ID name.");
          rule.items.push({ type: "Id", name: idName });
        } else if (is4("[")) {
          assert(attributesEnabled, "Attributes are not enabled.");
          rule.items.push(parseAttribute());
        } else if (is4(":")) {
          var isDoubleColon = false;
          var isPseudoElement = false;
          next2();
          if (is4(":")) {
            assert(pseudoElementsEnabled, "Pseudo elements are not enabled.");
            assert(pseudoElementsDoubleColonNotationEnabled, "Pseudo elements double colon notation is not enabled.");
            isDoubleColon = true;
            next2();
          }
          var pseudoName = parseIdentifier();
          assert(isDoubleColon || pseudoName, "Expected pseudo-class name.");
          assert(!isDoubleColon || pseudoName, "Expected pseudo-element name.");
          assert(pseudoName, "Expected pseudo-class name.");
          assert(!isDoubleColon || pseudoElementsAcceptUnknown || Object.prototype.hasOwnProperty.call(pseudoElementsDefinitions, pseudoName), 'Unknown pseudo-element "'.concat(pseudoName, '".'));
          isPseudoElement = pseudoElementsEnabled && (isDoubleColon || !isDoubleColon && pseudoElementsSingleColonNotationEnabled && Object.prototype.hasOwnProperty.call(pseudoElementsDefinitions, pseudoName));
          if (isPseudoElement) {
            var signature = (_a2 = pseudoElementsDefinitions[pseudoName]) !== null && _a2 !== void 0 ? _a2 : pseudoElementsAcceptUnknown && defaultPseudoSignature;
            var pseudoElement = {
              type: "PseudoElement",
              name: pseudoName
            };
            var argument = parsePseudoArgument(pseudoName, "pseudo-element", signature);
            if (argument) {
              assert(argument.type !== "Formula" && argument.type !== "FormulaOfSelector", "Pseudo-elements cannot have formula argument.");
              pseudoElement.argument = argument;
            }
            rule.items.push(pseudoElement);
          } else {
            assert(pseudoClassesEnabled, "Pseudo-classes are not enabled.");
            var signature = (_b2 = pseudoClassesDefinitions[pseudoName]) !== null && _b2 !== void 0 ? _b2 : pseudoClassesAcceptUnknown && defaultPseudoSignature;
            assert(signature, 'Unknown pseudo-class: "'.concat(pseudoName, '".'));
            var argument = parsePseudoArgument(pseudoName, "pseudo-class", signature);
            var pseudoClass = {
              type: "PseudoClass",
              name: pseudoName
            };
            if (argument) {
              pseudoClass.argument = argument;
            }
            rule.items.push(pseudoClass);
          }
        } else {
          break;
        }
      }
      if (rule.items.length === 0) {
        if (isEof()) {
          return fail("Expected rule but end of input reached.");
        } else {
          return fail('Expected rule but "'.concat(chr, '" found.'));
        }
      }
      skipWhitespace();
      if (!isEof() && !is4(",") && !is4(")")) {
        var combinator = matchMulticharIndex(combinatorsIndex);
        skipWhitespace();
        rule.nestedRule = parseRule();
        rule.nestedRule.combinator = combinator;
      }
      return rule;
    }
    return function(input) {
      if (typeof input !== "string") {
        throw new Error("".concat(errorPrefix, "Expected string input."));
      }
      str = input;
      l = str.length;
      pos = 0;
      chr = str.charAt(0);
      return parseSelector2();
    };
  }

  // node_modules/.pnpm/css-selector-parser@3.0.4/node_modules/css-selector-parser/dist/mjs/ast.js
  var __assign2 = function() {
    __assign2 = Object.assign || function(t) {
      for (var s2, i = 1, n = arguments.length; i < n; i++) {
        s2 = arguments[i];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t[p2] = s2[p2];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  function astMethods(type) {
    return function(generatorName, checkerName) {
      var _a;
      return _a = {}, _a[generatorName] = function(props) {
        return __assign2({ type }, props);
      }, _a[checkerName] = function(entity) {
        return typeof entity === "object" && entity !== null && entity.type === type;
      }, _a;
    };
  }
  var ast = __assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2(__assign2({}, astMethods("Selector")("selector", "isSelector")), astMethods("Rule")("rule", "isRule")), astMethods("TagName")("tagName", "isTagName")), astMethods("Id")("id", "isId")), astMethods("ClassName")("className", "isClassName")), astMethods("WildcardTag")("wildcardTag", "isWildcardTag")), astMethods("NamespaceName")("namespaceName", "isNamespaceName")), astMethods("WildcardNamespace")("wildcardNamespace", "isWildcardNamespace")), astMethods("NoNamespace")("noNamespace", "isNoNamespace")), astMethods("Attribute")("attribute", "isAttribute")), astMethods("PseudoClass")("pseudoClass", "isPseudoClass")), astMethods("PseudoElement")("pseudoElement", "isPseudoElement")), astMethods("String")("string", "isString")), astMethods("Formula")("formula", "isFormula")), astMethods("FormulaOfSelector")("formulaOfSelector", "isFormulaOfSelector")), astMethods("Substitution")("substitution", "isSubstitution"));

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/parse.js
  var cssSelectorParse = createParser({ syntax: "selectors-4" });
  function parse(selector) {
    if (typeof selector !== "string") {
      throw new TypeError("Expected `string` as selector, not `" + selector + "`");
    }
    return cssSelectorParse(selector);
  }

  // node_modules/.pnpm/direction@2.0.1/node_modules/direction/index.js
  var rtlRange = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC";
  var ltrRange = "A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C\uFE00-\uFE6F\uFEFD-\uFFFF";
  var rtl = new RegExp("^[^" + ltrRange + "]*[" + rtlRange + "]");
  var ltr = new RegExp("^[^" + rtlRange + "]*[" + ltrRange + "]");
  function direction(value) {
    const source = String(value || "");
    return rtl.test(source) ? "rtl" : ltr.test(source) ? "ltr" : "neutral";
  }

  // node_modules/.pnpm/hast-util-to-string@3.0.0/node_modules/hast-util-to-string/lib/index.js
  function toString(node) {
    if ("children" in node) {
      return all(node);
    }
    return "value" in node ? node.value : "";
  }
  function one(node) {
    if (node.type === "text") {
      return node.value;
    }
    return "children" in node ? all(node) : "";
  }
  function all(node) {
    let index2 = -1;
    const result = [];
    while (++index2 < node.children.length) {
      result[index2] = one(node.children[index2]);
    }
    return result.join("");
  }

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/enter-state.js
  function enterState(state, node) {
    const schema = state.schema;
    const language = state.language;
    const currentDirection = state.direction;
    const editableOrEditingHost = state.editableOrEditingHost;
    let dirInferred;
    if (node.type === "element") {
      const lang2 = node.properties.xmlLang || node.properties.lang;
      const type = node.properties.type || "text";
      const dir2 = dirProperty(node);
      if (lang2 !== null && lang2 !== void 0) {
        state.language = String(lang2);
      }
      if (schema && schema.space === "html") {
        if (node.properties.contentEditable === "true") {
          state.editableOrEditingHost = true;
        }
        if (node.tagName === "svg") {
          state.schema = svg2;
        }
        if (dir2 === "rtl") {
          dirInferred = dir2;
        } else if (
          // Explicit `[dir=ltr]`.
          dir2 === "ltr" || // HTML with an invalid or no `[dir]`.
          dir2 !== "auto" && node.tagName === "html" || // `input[type=tel]` with an invalid or no `[dir]`.
          dir2 !== "auto" && node.tagName === "input" && type === "tel"
        ) {
          dirInferred = "ltr";
        } else if (dir2 === "auto" || node.tagName === "bdi") {
          if (node.tagName === "textarea") {
            dirInferred = dirBidi(toString(node));
          } else if (node.tagName === "input" && (type === "email" || type === "search" || type === "tel" || type === "text")) {
            dirInferred = node.properties.value ? dirBidi(String(node.properties.value)) : "ltr";
          } else {
            visit(node, inferDirectionality);
          }
        }
        if (dirInferred) {
          state.direction = dirInferred;
        }
      } else if (state.editableOrEditingHost) {
        state.editableOrEditingHost = false;
      }
    }
    return reset;
    function reset() {
      state.schema = schema;
      state.language = language;
      state.direction = currentDirection;
      state.editableOrEditingHost = editableOrEditingHost;
    }
    function inferDirectionality(child) {
      if (child.type === "text") {
        dirInferred = dirBidi(child.value);
        return dirInferred ? EXIT : void 0;
      }
      if (child !== node && child.type === "element" && (child.tagName === "bdi" || child.tagName === "script" || child.tagName === "style" || child.tagName === "textare" || dirProperty(child))) {
        return SKIP;
      }
    }
  }
  function dirBidi(value) {
    const result = direction(value);
    return result === "neutral" ? void 0 : result;
  }
  function dirProperty(node) {
    const value = node.type === "element" && typeof node.properties.dir === "string" ? node.properties.dir.toLowerCase() : void 0;
    return value === "auto" || value === "ltr" || value === "rtl" ? value : void 0;
  }

  // node_modules/.pnpm/comma-separated-tokens@2.0.3/node_modules/comma-separated-tokens/index.js
  function parse2(value) {
    const tokens = [];
    const input = String(value || "");
    let index2 = input.indexOf(",");
    let start = 0;
    let end = false;
    while (!end) {
      if (index2 === -1) {
        index2 = input.length;
        end = true;
      }
      const token = input.slice(start, index2).trim();
      if (token || !end) {
        tokens.push(token);
      }
      start = index2 + 1;
      index2 = input.indexOf(",", start);
    }
    return tokens;
  }
  function stringify(values, options) {
    const settings = options || {};
    const input = values[values.length - 1] === "" ? [...values, ""] : values;
    return input.join(
      (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
    ).trim();
  }

  // node_modules/.pnpm/space-separated-tokens@2.0.2/node_modules/space-separated-tokens/index.js
  function parse3(value) {
    const input = String(value || "").trim();
    return input ? input.split(/[ \t\n\r\f]+/g) : [];
  }
  function stringify2(values) {
    return values.join(" ").trim();
  }

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/attribute.js
  function attribute(query, element3, schema) {
    const info = find(schema, query.name);
    const propertyValue = element3.properties[info.property];
    let value = normalizeValue(propertyValue, info);
    if (!query.value) {
      return value !== void 0;
    }
    ok(query.value.type === "String", "expected plain string");
    let key2 = query.value.value;
    if (query.caseSensitivityModifier === "i") {
      key2 = key2.toLowerCase();
      if (value) {
        value = value.toLowerCase();
      }
    }
    if (value !== void 0) {
      switch (query.operator) {
        case "=": {
          return key2 === value;
        }
        case "$=": {
          return key2 === value.slice(-key2.length);
        }
        case "*=": {
          return value.includes(key2);
        }
        case "^=": {
          return key2 === value.slice(0, key2.length);
        }
        case "|=": {
          return key2 === value || key2 === value.slice(0, key2.length) && value.charAt(key2.length) === "-";
        }
        case "~=": {
          return (
            // For all other values (including comma-separated lists), return whether this
            // is an exact match.
            key2 === value || // If this is a space-separated list, and the query is contained in it, return
            // true.
            parse3(value).includes(key2)
          );
        }
      }
    }
    return false;
  }
  function normalizeValue(value, info) {
    if (value === null || value === void 0) {
    } else if (typeof value === "boolean") {
      if (value) {
        return info.attribute;
      }
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        return (info.commaSeparated ? stringify : stringify2)(value);
      }
    } else {
      return String(value);
    }
  }

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/class-name.js
  var emptyClassNames = [];
  function className(query, element3) {
    const value = (
      /** @type {Readonly<Array<string>>} */
      element3.properties.className || emptyClassNames
    );
    return value.includes(query.name);
  }

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/id.js
  function id(query, element3) {
    return element3.properties.id === query.name;
  }

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/name.js
  function name(query, element3) {
    return query.name === element3.tagName;
  }

  // node_modules/.pnpm/bcp-47-match@2.0.3/node_modules/bcp-47-match/index.js
  function factory(check, filter) {
    return function(tags, ranges) {
      let left = cast(tags, "tag");
      const right = cast(
        ranges === null || ranges === void 0 ? "*" : ranges,
        "range"
      );
      const matches2 = [];
      let rightIndex = -1;
      while (++rightIndex < right.length) {
        const range = right[rightIndex].toLowerCase();
        if (!filter && range === "*")
          continue;
        let leftIndex = -1;
        const next2 = [];
        while (++leftIndex < left.length) {
          if (check(left[leftIndex].toLowerCase(), range)) {
            if (!filter) {
              return (
                /** @type {IsFilter extends true ? Tags : Tag|undefined} */
                left[leftIndex]
              );
            }
            matches2.push(left[leftIndex]);
          } else {
            next2.push(left[leftIndex]);
          }
        }
        left = next2;
      }
      return (
        /** @type {IsFilter extends true ? Tags : Tag|undefined} */
        filter ? matches2 : void 0
      );
    };
  }
  var basicFilter = factory(function(tag, range) {
    return range === "*" || tag === range || tag.includes(range + "-");
  }, true);
  var extendedFilter = factory(function(tag, range) {
    const left = tag.split("-");
    const right = range.split("-");
    let leftIndex = 0;
    let rightIndex = 0;
    if (right[rightIndex] !== "*" && left[leftIndex] !== right[rightIndex]) {
      return false;
    }
    leftIndex++;
    rightIndex++;
    while (rightIndex < right.length) {
      if (right[rightIndex] === "*") {
        rightIndex++;
        continue;
      }
      if (!left[leftIndex])
        return false;
      if (left[leftIndex] === right[rightIndex]) {
        leftIndex++;
        rightIndex++;
        continue;
      }
      if (left[leftIndex].length === 1)
        return false;
      leftIndex++;
    }
    return true;
  }, true);
  var lookup = factory(function(tag, range) {
    let right = range;
    while (true) {
      if (right === "*" || tag === right)
        return true;
      let index2 = right.lastIndexOf("-");
      if (index2 < 0)
        return false;
      if (right.charAt(index2 - 2) === "-")
        index2 -= 2;
      right = right.slice(0, index2);
    }
  }, false);
  function cast(values, name2) {
    const value = values && typeof values === "string" ? [values] : values;
    if (!value || typeof value !== "object" || !("length" in value)) {
      throw new Error(
        "Invalid " + name2 + " `" + value + "`, expected non-empty string"
      );
    }
    return value;
  }

  // node_modules/.pnpm/hast-util-has-property@3.0.0/node_modules/hast-util-has-property/lib/index.js
  var own3 = {}.hasOwnProperty;
  function hasProperty(node, name2) {
    const value = node.type === "element" && own3.call(node.properties, name2) && node.properties[name2];
    return value !== null && value !== void 0 && value !== false;
  }

  // node_modules/.pnpm/hast-util-whitespace@3.0.0/node_modules/hast-util-whitespace/lib/index.js
  var re = /[ \t\n\f\r]/g;
  function whitespace(thing) {
    return typeof thing === "object" ? thing.type === "text" ? empty2(thing.value) : false : empty2(thing);
  }
  function empty2(value) {
    return value.replace(re, "") === "";
  }

  // node_modules/.pnpm/nth-check@2.1.1/node_modules/nth-check/lib/esm/parse.js
  var whitespace2 = /* @__PURE__ */ new Set([9, 10, 12, 13, 32]);
  var ZERO = "0".charCodeAt(0);
  var NINE = "9".charCodeAt(0);
  function parse4(formula) {
    formula = formula.trim().toLowerCase();
    if (formula === "even") {
      return [2, 0];
    } else if (formula === "odd") {
      return [2, 1];
    }
    let idx = 0;
    let a = 0;
    let sign = readSign();
    let number2 = readNumber();
    if (idx < formula.length && formula.charAt(idx) === "n") {
      idx++;
      a = sign * (number2 !== null && number2 !== void 0 ? number2 : 1);
      skipWhitespace();
      if (idx < formula.length) {
        sign = readSign();
        skipWhitespace();
        number2 = readNumber();
      } else {
        sign = number2 = 0;
      }
    }
    if (number2 === null || idx < formula.length) {
      throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
    }
    return [a, sign * number2];
    function readSign() {
      if (formula.charAt(idx) === "-") {
        idx++;
        return -1;
      }
      if (formula.charAt(idx) === "+") {
        idx++;
      }
      return 1;
    }
    function readNumber() {
      const start = idx;
      let value = 0;
      while (idx < formula.length && formula.charCodeAt(idx) >= ZERO && formula.charCodeAt(idx) <= NINE) {
        value = value * 10 + (formula.charCodeAt(idx) - ZERO);
        idx++;
      }
      return idx === start ? null : value;
    }
    function skipWhitespace() {
      while (idx < formula.length && whitespace2.has(formula.charCodeAt(idx))) {
        idx++;
      }
    }
  }

  // node_modules/.pnpm/nth-check@2.1.1/node_modules/nth-check/lib/esm/compile.js
  var import_boolbase = __toESM(require_boolbase(), 1);
  function compile(parsed) {
    const a = parsed[0];
    const b = parsed[1] - 1;
    if (b < 0 && a <= 0)
      return import_boolbase.default.falseFunc;
    if (a === -1)
      return (index2) => index2 <= b;
    if (a === 0)
      return (index2) => index2 === b;
    if (a === 1)
      return b < 0 ? import_boolbase.default.trueFunc : (index2) => index2 >= b;
    const absA = Math.abs(a);
    const bMod = (b % absA + absA) % absA;
    return a > 1 ? (index2) => index2 >= b && index2 % absA === bMod : (index2) => index2 <= b && index2 % absA === bMod;
  }

  // node_modules/.pnpm/nth-check@2.1.1/node_modules/nth-check/lib/esm/index.js
  function nthCheck(formula) {
    return compile(parse4(formula));
  }

  // node_modules/.pnpm/zwitch@2.0.4/node_modules/zwitch/index.js
  var own4 = {}.hasOwnProperty;
  function zwitch(key2, options) {
    const settings = options || {};
    function one5(value, ...parameters) {
      let fn = one5.invalid;
      const handlers = one5.handlers;
      if (value && own4.call(value, key2)) {
        const id2 = String(value[key2]);
        fn = own4.call(handlers, id2) ? handlers[id2] : one5.unknown;
      }
      if (fn) {
        return fn.call(this, value, ...parameters);
      }
    }
    one5.handlers = settings.handlers || {};
    one5.invalid = settings.invalid;
    one5.unknown = settings.unknown;
    return one5;
  }

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/pseudo.js
  var nthCheck2 = nthCheck.default || nthCheck;
  var pseudo = zwitch("name", {
    handlers: {
      "any-link": anyLink,
      blank,
      checked,
      dir,
      disabled,
      empty: empty3,
      enabled,
      "first-child": firstChild,
      "first-of-type": firstOfType,
      has,
      is: is2,
      lang,
      "last-child": lastChild,
      "last-of-type": lastOfType,
      not,
      "nth-child": nthChild,
      "nth-last-child": nthLastChild,
      "nth-last-of-type": nthLastOfType,
      "nth-of-type": nthOfType,
      "only-child": onlyChild,
      "only-of-type": onlyOfType,
      optional,
      "read-only": readOnly,
      "read-write": readWrite,
      required,
      root,
      scope
    },
    invalid: invalidPseudo,
    unknown: unknownPseudo
  });
  function anyLink(_, element3) {
    return (element3.tagName === "a" || element3.tagName === "area" || element3.tagName === "link") && hasProperty(element3, "href");
  }
  function assertDeep(state, query) {
    if (state.shallow) {
      throw new Error("Cannot use `:" + query.name + "` without parent");
    }
  }
  function blank(_, element3) {
    return !someChildren(element3, check);
    function check(child) {
      return child.type === "element" || child.type === "text" && !whitespace(child);
    }
  }
  function checked(_, element3) {
    if (element3.tagName === "input" || element3.tagName === "menuitem") {
      return Boolean(
        (element3.properties.type === "checkbox" || element3.properties.type === "radio") && hasProperty(element3, "checked")
      );
    }
    if (element3.tagName === "option") {
      return hasProperty(element3, "selected");
    }
    return false;
  }
  function dir(query, _1, _2, _3, state) {
    ok(query.argument, "expected `argument`");
    ok(query.argument.type === "String", "expected plain text");
    return state.direction === query.argument.value;
  }
  function disabled(_, element3) {
    return (element3.tagName === "button" || element3.tagName === "input" || element3.tagName === "select" || element3.tagName === "textarea" || element3.tagName === "optgroup" || element3.tagName === "option" || element3.tagName === "menuitem" || element3.tagName === "fieldset") && hasProperty(element3, "disabled");
  }
  function empty3(_, element3) {
    return !someChildren(element3, check);
    function check(child) {
      return child.type === "element" || child.type === "text";
    }
  }
  function enabled(query, element3) {
    return !disabled(query, element3);
  }
  function firstChild(query, _1, _2, _3, state) {
    assertDeep(state, query);
    return state.elementIndex === 0;
  }
  function firstOfType(query, _1, _2, _3, state) {
    assertDeep(state, query);
    return state.typeIndex === 0;
  }
  function getCachedNthCheck(query) {
    let fn = query._cachedFn;
    if (!fn) {
      const value = query.argument;
      ok(value, "expected `argument`");
      if (value.type !== "Formula") {
        throw new Error(
          "Expected `nth` formula, such as `even` or `2n+1` (`of` is not yet supported)"
        );
      }
      fn = nthCheck2(value.a + "n+" + value.b);
      query._cachedFn = fn;
    }
    return fn;
  }
  function has(query, element3, _1, _2, state) {
    ok(query.argument, "expected `argument`");
    ok(query.argument.type === "Selector", "expected selector");
    const childState = {
      ...state,
      // Not found yet.
      found: false,
      // One result is enough.
      one: true,
      results: [],
      rootQuery: query.argument,
      scopeElements: [element3],
      // Do walk deep.
      shallow: false
    };
    walk(childState, { type: "root", children: element3.children });
    return childState.results.length > 0;
  }
  function invalidPseudo() {
    unreachable("Invalid pseudo-selector");
  }
  function is2(query, element3, _1, _2, state) {
    ok(query.argument, "expected `argument`");
    ok(query.argument.type === "Selector", "expected selector");
    const childState = {
      ...state,
      // Not found yet.
      found: false,
      // One result is enough.
      one: true,
      results: [],
      rootQuery: query.argument,
      scopeElements: [element3],
      // Do walk deep.
      shallow: false
    };
    walk(childState, element3);
    return childState.results[0] === element3;
  }
  function lang(query, _1, _2, _3, state) {
    ok(query.argument, "expected `argument`");
    ok(query.argument.type === "String", "expected string");
    return state.language !== "" && state.language !== void 0 && extendedFilter(state.language, parse2(query.argument.value)).length > 0;
  }
  function lastChild(query, _1, _2, _3, state) {
    assertDeep(state, query);
    return Boolean(
      state.elementCount && state.elementIndex === state.elementCount - 1
    );
  }
  function lastOfType(query, _1, _2, _3, state) {
    assertDeep(state, query);
    return typeof state.typeIndex === "number" && typeof state.typeCount === "number" && state.typeIndex === state.typeCount - 1;
  }
  function not(query, element3, index2, parent, state) {
    return !is2(query, element3, index2, parent, state);
  }
  function nthChild(query, _1, _2, _3, state) {
    const fn = getCachedNthCheck(query);
    assertDeep(state, query);
    return typeof state.elementIndex === "number" && fn(state.elementIndex);
  }
  function nthLastChild(query, _1, _2, _3, state) {
    const fn = getCachedNthCheck(query);
    assertDeep(state, query);
    return Boolean(
      typeof state.elementCount === "number" && typeof state.elementIndex === "number" && fn(state.elementCount - state.elementIndex - 1)
    );
  }
  function nthLastOfType(query, _1, _2, _3, state) {
    const fn = getCachedNthCheck(query);
    assertDeep(state, query);
    return typeof state.typeCount === "number" && typeof state.typeIndex === "number" && fn(state.typeCount - 1 - state.typeIndex);
  }
  function nthOfType(query, _1, _2, _3, state) {
    const fn = getCachedNthCheck(query);
    assertDeep(state, query);
    return typeof state.typeIndex === "number" && fn(state.typeIndex);
  }
  function onlyChild(query, _1, _2, _3, state) {
    assertDeep(state, query);
    return state.elementCount === 1;
  }
  function onlyOfType(query, _1, _2, _3, state) {
    assertDeep(state, query);
    return state.typeCount === 1;
  }
  function optional(query, element3) {
    return !required(query, element3);
  }
  function readOnly(query, element3, index2, parent, state) {
    return !readWrite(query, element3, index2, parent, state);
  }
  function readWrite(_, element3, _1, _2, state) {
    return element3.tagName === "input" || element3.tagName === "textarea" ? !hasProperty(element3, "readOnly") && !hasProperty(element3, "disabled") : Boolean(state.editableOrEditingHost);
  }
  function required(_, element3) {
    return (element3.tagName === "input" || element3.tagName === "textarea" || element3.tagName === "select") && hasProperty(element3, "required");
  }
  function root(_1, element3, _2, parent, state) {
    return Boolean(
      (!parent || parent.type === "root") && state.schema && (state.schema.space === "html" || state.schema.space === "svg") && (element3.tagName === "html" || element3.tagName === "svg")
    );
  }
  function scope(_1, element3, _2, _3, state) {
    return state.scopeElements.includes(element3);
  }
  function someChildren(element3, check) {
    const children = element3.children;
    let index2 = -1;
    while (++index2 < children.length) {
      if (check(children[index2]))
        return true;
    }
    return false;
  }
  function unknownPseudo(query_) {
    const query = (
      /** @type {AstPseudoClass} */
      query_
    );
    throw new Error("Unknown pseudo-selector `" + query.name + "`");
  }

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/test.js
  function test(query, element3, index2, parent, state) {
    for (const item of query.items) {
      if (item.type === "Attribute") {
        if (!attribute(item, element3, state.schema))
          return false;
      } else if (item.type === "Id") {
        if (!id(item, element3))
          return false;
      } else if (item.type === "ClassName") {
        if (!className(item, element3))
          return false;
      } else if (item.type === "PseudoClass") {
        if (!pseudo(item, element3, index2, parent, state))
          return false;
      } else if (item.type === "PseudoElement") {
        throw new Error("Invalid selector: `::" + item.name + "`");
      } else if (item.type === "TagName") {
        if (!name(item, element3))
          return false;
      } else {
      }
    }
    return true;
  }

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/walk.js
  var empty4 = [];
  function walk(state, tree) {
    if (tree) {
      one2(state, [], tree, void 0, void 0, tree);
    }
  }
  function add(nest, field, rule) {
    const list = nest[field];
    if (list) {
      list.push(rule);
    } else {
      nest[field] = [rule];
    }
  }
  function all2(state, nest, node, tree) {
    const fromParent = combine(nest.descendant, nest.directChild);
    let fromSibling;
    let index2 = -1;
    const total = { count: 0, types: /* @__PURE__ */ new Map() };
    const before = { count: 0, types: /* @__PURE__ */ new Map() };
    while (++index2 < node.children.length) {
      count(total, node.children[index2]);
    }
    index2 = -1;
    while (++index2 < node.children.length) {
      const child = node.children[index2];
      const name2 = child.type === "element" ? child.tagName.toUpperCase() : void 0;
      state.elementIndex = before.count;
      state.typeIndex = name2 ? before.types.get(name2) || 0 : 0;
      state.elementCount = total.count;
      state.typeCount = name2 ? total.types.get(name2) : 0;
      if ("children" in child) {
        const forSibling = combine(fromParent, fromSibling);
        const nest2 = one2(
          state,
          forSibling,
          node.children[index2],
          index2,
          node,
          tree
        );
        fromSibling = combine(nest2.generalSibling, nest2.adjacentSibling);
      }
      if (state.one && state.found) {
        break;
      }
      count(before, node.children[index2]);
    }
  }
  function applySelectors(state, rules3, node, index2, parent) {
    const nestResult = {
      adjacentSibling: void 0,
      descendant: void 0,
      directChild: void 0,
      generalSibling: void 0
    };
    let selectorIndex = -1;
    while (++selectorIndex < rules3.length) {
      const rule = rules3[selectorIndex];
      if (state.one && state.found) {
        break;
      }
      if (state.shallow && rule.nestedRule) {
        throw new Error("Expected selector without nesting");
      }
      if (test(rule, node, index2, parent, state)) {
        const nest = rule.nestedRule;
        if (nest) {
          const label = nest.combinator === "+" ? "adjacentSibling" : nest.combinator === "~" ? "generalSibling" : nest.combinator === ">" ? "directChild" : "descendant";
          add(nestResult, label, nest);
        } else {
          state.found = true;
          if (!state.results.includes(node)) {
            state.results.push(node);
          }
        }
      }
      if (rule.combinator === void 0) {
        add(nestResult, "descendant", rule);
      } else if (rule.combinator === "~") {
        add(nestResult, "generalSibling", rule);
      }
    }
    return nestResult;
  }
  function combine(left, right) {
    return left && right && left.length > 0 && right.length > 0 ? [...left, ...right] : left && left.length > 0 ? left : right && right.length > 0 ? right : empty4;
  }
  function count(counts, node) {
    if (node.type === "element") {
      const name2 = node.tagName.toUpperCase();
      const count2 = (counts.types.get(name2) || 0) + 1;
      counts.count++;
      counts.types.set(name2, count2);
    }
  }
  function one2(state, currentRules, node, index2, parent, tree) {
    let nestResult = {
      adjacentSibling: void 0,
      descendant: void 0,
      directChild: void 0,
      generalSibling: void 0
    };
    const exit = enterState(state, node);
    if (node.type === "element") {
      let rootRules = state.rootQuery.rules;
      if (parent && parent !== tree) {
        rootRules = state.rootQuery.rules.filter(
          (d) => d.combinator === void 0 || d.combinator === ">" && parent === tree
        );
      }
      nestResult = applySelectors(
        state,
        // Try the root rules for this element too.
        combine(currentRules, rootRules),
        node,
        index2,
        parent
      );
    }
    if ("children" in node && !state.shallow && !(state.one && state.found)) {
      all2(state, nestResult, node, tree);
    }
    exit();
    return nestResult;
  }

  // node_modules/.pnpm/hast-util-select@6.0.2/node_modules/hast-util-select/lib/index.js
  function selectAll(selector, tree, space) {
    const state = createState(selector, tree, space);
    walk(state, tree || void 0);
    return state.results;
  }
  function createState(selector, tree, space) {
    return {
      direction: "ltr",
      editableOrEditingHost: false,
      elementCount: void 0,
      elementIndex: void 0,
      found: false,
      language: void 0,
      one: false,
      // State of the query.
      results: [],
      rootQuery: parse(selector),
      schema: space === "svg" ? svg2 : html2,
      scopeElements: tree ? tree.type === "root" ? tree.children : [tree] : [],
      shallow: false,
      typeIndex: void 0,
      typeCount: void 0
    };
  }

  // node_modules/.pnpm/rehype-rewrite@4.0.2/node_modules/rehype-rewrite/lib/index.js
  var remarkRewrite = (options) => {
    const { selector, rewrite } = options || {};
    return (tree) => {
      if (!rewrite || typeof rewrite !== "function")
        return;
      if (selector && typeof selector === "string") {
        const selected = selectAll(selector, tree);
        if (selected && selected.length > 0) {
          visit(tree, selected, (node, index2, parent) => {
            rewrite(node, index2, parent);
          });
        }
        return;
      }
      visit(tree, (node, index2, parent) => {
        rewrite(node, index2, parent);
      });
    };
  };
  var lib_default = remarkRewrite;

  // node_modules/.pnpm/hast-util-parse-selector@4.0.0/node_modules/hast-util-parse-selector/lib/index.js
  var search = /[#.]/g;
  function parseSelector(selector, defaultTagName) {
    const value = selector || "";
    const props = {};
    let start = 0;
    let previous;
    let tagName;
    while (start < value.length) {
      search.lastIndex = start;
      const match = search.exec(value);
      const subvalue = value.slice(start, match ? match.index : value.length);
      if (subvalue) {
        if (!previous) {
          tagName = subvalue;
        } else if (previous === "#") {
          props.id = subvalue;
        } else if (Array.isArray(props.className)) {
          props.className.push(subvalue);
        } else {
          props.className = [subvalue];
        }
        start += subvalue.length;
      }
      if (match) {
        previous = match[0];
        start++;
      }
    }
    return {
      type: "element",
      // @ts-expect-error: tag name is parsed.
      tagName: tagName || defaultTagName || "div",
      properties: props,
      children: []
    };
  }

  // node_modules/.pnpm/hastscript@8.0.0/node_modules/hastscript/lib/create-h.js
  var buttonTypes = /* @__PURE__ */ new Set(["button", "menu", "reset", "submit"]);
  var own5 = {}.hasOwnProperty;
  function createH(schema, defaultTagName, caseSensitive) {
    const adjust = caseSensitive && createAdjustMap(caseSensitive);
    function h2(selector, properties, ...children) {
      let index2 = -1;
      let node;
      if (selector === void 0 || selector === null) {
        node = { type: "root", children: [] };
        const child = (
          /** @type {Child} */
          properties
        );
        children.unshift(child);
      } else {
        node = parseSelector(selector, defaultTagName);
        node.tagName = node.tagName.toLowerCase();
        if (adjust && own5.call(adjust, node.tagName)) {
          node.tagName = adjust[node.tagName];
        }
        if (isProperties(properties, node.tagName)) {
          let key2;
          for (key2 in properties) {
            if (own5.call(properties, key2)) {
              addProperty(schema, node.properties, key2, properties[key2]);
            }
          }
        } else {
          children.unshift(properties);
        }
      }
      while (++index2 < children.length) {
        addChild(node.children, children[index2]);
      }
      if (node.type === "element" && node.tagName === "template") {
        node.content = { type: "root", children: node.children };
        node.children = [];
      }
      return node;
    }
    return h2;
  }
  function isProperties(value, name2) {
    if (value === null || value === void 0 || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }
    if (name2 === "input" || !value.type || typeof value.type !== "string") {
      return true;
    }
    if ("children" in value && Array.isArray(value.children)) {
      return false;
    }
    if (name2 === "button") {
      return buttonTypes.has(value.type.toLowerCase());
    }
    return !("value" in value);
  }
  function addProperty(schema, properties, key2, value) {
    const info = find(schema, key2);
    let index2 = -1;
    let result;
    if (value === void 0 || value === null)
      return;
    if (typeof value === "number") {
      if (Number.isNaN(value))
        return;
      result = value;
    } else if (typeof value === "boolean") {
      result = value;
    } else if (typeof value === "string") {
      if (info.spaceSeparated) {
        result = parse3(value);
      } else if (info.commaSeparated) {
        result = parse2(value);
      } else if (info.commaOrSpaceSeparated) {
        result = parse3(parse2(value).join(" "));
      } else {
        result = parsePrimitive(info, info.property, value);
      }
    } else if (Array.isArray(value)) {
      result = value.concat();
    } else {
      result = info.property === "style" ? style(value) : String(value);
    }
    if (Array.isArray(result)) {
      const finalResult = [];
      while (++index2 < result.length) {
        const value2 = (
          /** @type {number | string} */
          parsePrimitive(info, info.property, result[index2])
        );
        finalResult[index2] = value2;
      }
      result = finalResult;
    }
    if (info.property === "className" && Array.isArray(properties.className)) {
      const value2 = (
        /** @type {number | string} */
        result
      );
      result = properties.className.concat(value2);
    }
    properties[info.property] = result;
  }
  function addChild(nodes, value) {
    let index2 = -1;
    if (value === void 0 || value === null) {
    } else if (typeof value === "string" || typeof value === "number") {
      nodes.push({ type: "text", value: String(value) });
    } else if (Array.isArray(value)) {
      while (++index2 < value.length) {
        addChild(nodes, value[index2]);
      }
    } else if (typeof value === "object" && "type" in value) {
      if (value.type === "root") {
        addChild(nodes, value.children);
      } else {
        nodes.push(value);
      }
    } else {
      throw new Error("Expected node, nodes, or string, got `" + value + "`");
    }
  }
  function parsePrimitive(info, name2, value) {
    if (typeof value === "string") {
      if (info.number && value && !Number.isNaN(Number(value))) {
        return Number(value);
      }
      if ((info.boolean || info.overloadedBoolean) && (value === "" || normalize2(value) === normalize2(name2))) {
        return true;
      }
    }
    return value;
  }
  function style(value) {
    const result = [];
    let key2;
    for (key2 in value) {
      if (own5.call(value, key2)) {
        result.push([key2, value[key2]].join(": "));
      }
    }
    return result.join("; ");
  }
  function createAdjustMap(values) {
    const result = {};
    let index2 = -1;
    while (++index2 < values.length) {
      result[values[index2].toLowerCase()] = values[index2];
    }
    return result;
  }

  // node_modules/.pnpm/hastscript@8.0.0/node_modules/hastscript/lib/svg-case-sensitive-tag-names.js
  var svgCaseSensitiveTagNames = [
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "clipPath",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "foreignObject",
    "glyphRef",
    "linearGradient",
    "radialGradient",
    "solidColor",
    "textArea",
    "textPath"
  ];

  // node_modules/.pnpm/hastscript@8.0.0/node_modules/hastscript/lib/index.js
  var h = createH(html2, "div");
  var s = createH(svg2, "g", svgCaseSensitiveTagNames);

  // node_modules/.pnpm/web-namespaces@2.0.1/node_modules/web-namespaces/index.js
  var webNamespaces = {
    html: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    svg: "http://www.w3.org/2000/svg",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  // node_modules/.pnpm/hast-util-from-dom@5.0.0/node_modules/hast-util-from-dom/lib/index.js
  function fromDom(tree, options) {
    return transform(tree, options || {}) || { type: "root", children: [] };
  }
  function transform(node, options) {
    const transformed = one3(node, options);
    if (transformed && options.afterTransform)
      options.afterTransform(node, transformed);
    return transformed;
  }
  function one3(node, options) {
    switch (node.nodeType) {
      case 1: {
        const domNode = (
          /** @type {Element} */
          node
        );
        return element(domNode, options);
      }
      case 3: {
        const domNode = (
          /** @type {Text} */
          node
        );
        return text(domNode);
      }
      case 8: {
        const domNode = (
          /** @type {Comment} */
          node
        );
        return comment(domNode);
      }
      case 9: {
        const domNode = (
          /** @type {Document} */
          node
        );
        return root2(domNode, options);
      }
      case 10: {
        return doctype();
      }
      case 11: {
        const domNode = (
          /** @type {DocumentFragment} */
          node
        );
        return root2(domNode, options);
      }
      default: {
        return void 0;
      }
    }
  }
  function root2(node, options) {
    return { type: "root", children: all3(node, options) };
  }
  function doctype() {
    return { type: "doctype" };
  }
  function text(node) {
    return { type: "text", value: node.nodeValue || "" };
  }
  function comment(node) {
    return { type: "comment", value: node.nodeValue || "" };
  }
  function element(node, options) {
    const space = node.namespaceURI;
    const fn = space === webNamespaces.svg ? s : h;
    const tagName = space === webNamespaces.html ? node.tagName.toLowerCase() : node.tagName;
    const content = (
      // @ts-expect-error: DOM types are wrong, content can exist.
      space === webNamespaces.html && tagName === "template" ? node.content : node
    );
    const attributes = node.getAttributeNames();
    const props = {};
    let index2 = -1;
    while (++index2 < attributes.length) {
      props[attributes[index2]] = node.getAttribute(attributes[index2]) || "";
    }
    return fn(tagName, props, all3(content, options));
  }
  function all3(node, options) {
    const nodes = node.childNodes;
    const children = [];
    let index2 = -1;
    while (++index2 < nodes.length) {
      const child = transform(nodes[index2], options);
      if (child !== void 0) {
        children.push(child);
      }
    }
    return children;
  }

  // node_modules/.pnpm/rehype-dom-parse@5.0.0/node_modules/rehype-dom-parse/lib/index.js
  function parse5(options) {
    const self = this;
    const settings = { ...self.data("settings"), ...options };
    self.parser = parser;
    function parser(doc) {
      const create2 = settings.fragment === false ? createDocument : createFragment;
      return (
        /** @type {Root} */
        fromDom(create2(doc))
      );
    }
  }
  function createFragment(value) {
    const doc = createDocument("<!doctype html><body>" + value);
    return (
      /** @type {DocumentFragment} */
      {
        nodeType: 11,
        childNodes: doc.body.childNodes
      }
    );
  }
  function createDocument(value) {
    return new DOMParser().parseFromString(value, "text/html");
  }

  // node_modules/.pnpm/html-void-elements@3.0.0/node_modules/html-void-elements/index.js
  var htmlVoidElements = [
    "area",
    "base",
    "basefont",
    "bgsound",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "image",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ];

  // node_modules/.pnpm/stringify-entities@4.0.3/node_modules/stringify-entities/lib/core.js
  function core(value, options) {
    value = value.replace(
      options.subset ? charactersToExpression(options.subset) : /["&'<>`]/g,
      basic
    );
    if (options.subset || options.escapeOnly) {
      return value;
    }
    return value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, surrogate).replace(
      // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
      /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,
      basic
    );
    function surrogate(pair, index2, all5) {
      return options.format(
        (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
        all5.charCodeAt(index2 + 2),
        options
      );
    }
    function basic(character, index2, all5) {
      return options.format(
        character.charCodeAt(0),
        all5.charCodeAt(index2 + 1),
        options
      );
    }
  }
  function charactersToExpression(subset) {
    const groups = [];
    let index2 = -1;
    while (++index2 < subset.length) {
      groups.push(subset[index2].replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"));
    }
    return new RegExp("(?:" + groups.join("|") + ")", "g");
  }

  // node_modules/.pnpm/stringify-entities@4.0.3/node_modules/stringify-entities/lib/util/to-hexadecimal.js
  function toHexadecimal(code, next2, omit) {
    const value = "&#x" + code.toString(16).toUpperCase();
    return omit && next2 && !/[\dA-Fa-f]/.test(String.fromCharCode(next2)) ? value : value + ";";
  }

  // node_modules/.pnpm/stringify-entities@4.0.3/node_modules/stringify-entities/lib/util/to-decimal.js
  function toDecimal(code, next2, omit) {
    const value = "&#" + String(code);
    return omit && next2 && !/\d/.test(String.fromCharCode(next2)) ? value : value + ";";
  }

  // node_modules/.pnpm/character-entities-legacy@3.0.0/node_modules/character-entities-legacy/index.js
  var characterEntitiesLegacy = [
    "AElig",
    "AMP",
    "Aacute",
    "Acirc",
    "Agrave",
    "Aring",
    "Atilde",
    "Auml",
    "COPY",
    "Ccedil",
    "ETH",
    "Eacute",
    "Ecirc",
    "Egrave",
    "Euml",
    "GT",
    "Iacute",
    "Icirc",
    "Igrave",
    "Iuml",
    "LT",
    "Ntilde",
    "Oacute",
    "Ocirc",
    "Ograve",
    "Oslash",
    "Otilde",
    "Ouml",
    "QUOT",
    "REG",
    "THORN",
    "Uacute",
    "Ucirc",
    "Ugrave",
    "Uuml",
    "Yacute",
    "aacute",
    "acirc",
    "acute",
    "aelig",
    "agrave",
    "amp",
    "aring",
    "atilde",
    "auml",
    "brvbar",
    "ccedil",
    "cedil",
    "cent",
    "copy",
    "curren",
    "deg",
    "divide",
    "eacute",
    "ecirc",
    "egrave",
    "eth",
    "euml",
    "frac12",
    "frac14",
    "frac34",
    "gt",
    "iacute",
    "icirc",
    "iexcl",
    "igrave",
    "iquest",
    "iuml",
    "laquo",
    "lt",
    "macr",
    "micro",
    "middot",
    "nbsp",
    "not",
    "ntilde",
    "oacute",
    "ocirc",
    "ograve",
    "ordf",
    "ordm",
    "oslash",
    "otilde",
    "ouml",
    "para",
    "plusmn",
    "pound",
    "quot",
    "raquo",
    "reg",
    "sect",
    "shy",
    "sup1",
    "sup2",
    "sup3",
    "szlig",
    "thorn",
    "times",
    "uacute",
    "ucirc",
    "ugrave",
    "uml",
    "uuml",
    "yacute",
    "yen",
    "yuml"
  ];

  // node_modules/.pnpm/character-entities-html4@2.1.0/node_modules/character-entities-html4/index.js
  var characterEntitiesHtml4 = {
    nbsp: "\xA0",
    iexcl: "\xA1",
    cent: "\xA2",
    pound: "\xA3",
    curren: "\xA4",
    yen: "\xA5",
    brvbar: "\xA6",
    sect: "\xA7",
    uml: "\xA8",
    copy: "\xA9",
    ordf: "\xAA",
    laquo: "\xAB",
    not: "\xAC",
    shy: "\xAD",
    reg: "\xAE",
    macr: "\xAF",
    deg: "\xB0",
    plusmn: "\xB1",
    sup2: "\xB2",
    sup3: "\xB3",
    acute: "\xB4",
    micro: "\xB5",
    para: "\xB6",
    middot: "\xB7",
    cedil: "\xB8",
    sup1: "\xB9",
    ordm: "\xBA",
    raquo: "\xBB",
    frac14: "\xBC",
    frac12: "\xBD",
    frac34: "\xBE",
    iquest: "\xBF",
    Agrave: "\xC0",
    Aacute: "\xC1",
    Acirc: "\xC2",
    Atilde: "\xC3",
    Auml: "\xC4",
    Aring: "\xC5",
    AElig: "\xC6",
    Ccedil: "\xC7",
    Egrave: "\xC8",
    Eacute: "\xC9",
    Ecirc: "\xCA",
    Euml: "\xCB",
    Igrave: "\xCC",
    Iacute: "\xCD",
    Icirc: "\xCE",
    Iuml: "\xCF",
    ETH: "\xD0",
    Ntilde: "\xD1",
    Ograve: "\xD2",
    Oacute: "\xD3",
    Ocirc: "\xD4",
    Otilde: "\xD5",
    Ouml: "\xD6",
    times: "\xD7",
    Oslash: "\xD8",
    Ugrave: "\xD9",
    Uacute: "\xDA",
    Ucirc: "\xDB",
    Uuml: "\xDC",
    Yacute: "\xDD",
    THORN: "\xDE",
    szlig: "\xDF",
    agrave: "\xE0",
    aacute: "\xE1",
    acirc: "\xE2",
    atilde: "\xE3",
    auml: "\xE4",
    aring: "\xE5",
    aelig: "\xE6",
    ccedil: "\xE7",
    egrave: "\xE8",
    eacute: "\xE9",
    ecirc: "\xEA",
    euml: "\xEB",
    igrave: "\xEC",
    iacute: "\xED",
    icirc: "\xEE",
    iuml: "\xEF",
    eth: "\xF0",
    ntilde: "\xF1",
    ograve: "\xF2",
    oacute: "\xF3",
    ocirc: "\xF4",
    otilde: "\xF5",
    ouml: "\xF6",
    divide: "\xF7",
    oslash: "\xF8",
    ugrave: "\xF9",
    uacute: "\xFA",
    ucirc: "\xFB",
    uuml: "\xFC",
    yacute: "\xFD",
    thorn: "\xFE",
    yuml: "\xFF",
    fnof: "\u0192",
    Alpha: "\u0391",
    Beta: "\u0392",
    Gamma: "\u0393",
    Delta: "\u0394",
    Epsilon: "\u0395",
    Zeta: "\u0396",
    Eta: "\u0397",
    Theta: "\u0398",
    Iota: "\u0399",
    Kappa: "\u039A",
    Lambda: "\u039B",
    Mu: "\u039C",
    Nu: "\u039D",
    Xi: "\u039E",
    Omicron: "\u039F",
    Pi: "\u03A0",
    Rho: "\u03A1",
    Sigma: "\u03A3",
    Tau: "\u03A4",
    Upsilon: "\u03A5",
    Phi: "\u03A6",
    Chi: "\u03A7",
    Psi: "\u03A8",
    Omega: "\u03A9",
    alpha: "\u03B1",
    beta: "\u03B2",
    gamma: "\u03B3",
    delta: "\u03B4",
    epsilon: "\u03B5",
    zeta: "\u03B6",
    eta: "\u03B7",
    theta: "\u03B8",
    iota: "\u03B9",
    kappa: "\u03BA",
    lambda: "\u03BB",
    mu: "\u03BC",
    nu: "\u03BD",
    xi: "\u03BE",
    omicron: "\u03BF",
    pi: "\u03C0",
    rho: "\u03C1",
    sigmaf: "\u03C2",
    sigma: "\u03C3",
    tau: "\u03C4",
    upsilon: "\u03C5",
    phi: "\u03C6",
    chi: "\u03C7",
    psi: "\u03C8",
    omega: "\u03C9",
    thetasym: "\u03D1",
    upsih: "\u03D2",
    piv: "\u03D6",
    bull: "\u2022",
    hellip: "\u2026",
    prime: "\u2032",
    Prime: "\u2033",
    oline: "\u203E",
    frasl: "\u2044",
    weierp: "\u2118",
    image: "\u2111",
    real: "\u211C",
    trade: "\u2122",
    alefsym: "\u2135",
    larr: "\u2190",
    uarr: "\u2191",
    rarr: "\u2192",
    darr: "\u2193",
    harr: "\u2194",
    crarr: "\u21B5",
    lArr: "\u21D0",
    uArr: "\u21D1",
    rArr: "\u21D2",
    dArr: "\u21D3",
    hArr: "\u21D4",
    forall: "\u2200",
    part: "\u2202",
    exist: "\u2203",
    empty: "\u2205",
    nabla: "\u2207",
    isin: "\u2208",
    notin: "\u2209",
    ni: "\u220B",
    prod: "\u220F",
    sum: "\u2211",
    minus: "\u2212",
    lowast: "\u2217",
    radic: "\u221A",
    prop: "\u221D",
    infin: "\u221E",
    ang: "\u2220",
    and: "\u2227",
    or: "\u2228",
    cap: "\u2229",
    cup: "\u222A",
    int: "\u222B",
    there4: "\u2234",
    sim: "\u223C",
    cong: "\u2245",
    asymp: "\u2248",
    ne: "\u2260",
    equiv: "\u2261",
    le: "\u2264",
    ge: "\u2265",
    sub: "\u2282",
    sup: "\u2283",
    nsub: "\u2284",
    sube: "\u2286",
    supe: "\u2287",
    oplus: "\u2295",
    otimes: "\u2297",
    perp: "\u22A5",
    sdot: "\u22C5",
    lceil: "\u2308",
    rceil: "\u2309",
    lfloor: "\u230A",
    rfloor: "\u230B",
    lang: "\u2329",
    rang: "\u232A",
    loz: "\u25CA",
    spades: "\u2660",
    clubs: "\u2663",
    hearts: "\u2665",
    diams: "\u2666",
    quot: '"',
    amp: "&",
    lt: "<",
    gt: ">",
    OElig: "\u0152",
    oelig: "\u0153",
    Scaron: "\u0160",
    scaron: "\u0161",
    Yuml: "\u0178",
    circ: "\u02C6",
    tilde: "\u02DC",
    ensp: "\u2002",
    emsp: "\u2003",
    thinsp: "\u2009",
    zwnj: "\u200C",
    zwj: "\u200D",
    lrm: "\u200E",
    rlm: "\u200F",
    ndash: "\u2013",
    mdash: "\u2014",
    lsquo: "\u2018",
    rsquo: "\u2019",
    sbquo: "\u201A",
    ldquo: "\u201C",
    rdquo: "\u201D",
    bdquo: "\u201E",
    dagger: "\u2020",
    Dagger: "\u2021",
    permil: "\u2030",
    lsaquo: "\u2039",
    rsaquo: "\u203A",
    euro: "\u20AC"
  };

  // node_modules/.pnpm/stringify-entities@4.0.3/node_modules/stringify-entities/lib/constant/dangerous.js
  var dangerous = [
    "cent",
    "copy",
    "divide",
    "gt",
    "lt",
    "not",
    "para",
    "times"
  ];

  // node_modules/.pnpm/stringify-entities@4.0.3/node_modules/stringify-entities/lib/util/to-named.js
  var own6 = {}.hasOwnProperty;
  var characters = {};
  var key;
  for (key in characterEntitiesHtml4) {
    if (own6.call(characterEntitiesHtml4, key)) {
      characters[characterEntitiesHtml4[key]] = key;
    }
  }
  function toNamed(code, next2, omit, attribute2) {
    const character = String.fromCharCode(code);
    if (own6.call(characters, character)) {
      const name2 = characters[character];
      const value = "&" + name2;
      if (omit && characterEntitiesLegacy.includes(name2) && !dangerous.includes(name2) && (!attribute2 || next2 && next2 !== 61 && /[^\da-z]/i.test(String.fromCharCode(next2)))) {
        return value;
      }
      return value + ";";
    }
    return "";
  }

  // node_modules/.pnpm/stringify-entities@4.0.3/node_modules/stringify-entities/lib/util/format-smart.js
  function formatSmart(code, next2, options) {
    let numeric = toHexadecimal(code, next2, options.omitOptionalSemicolons);
    let named;
    if (options.useNamedReferences || options.useShortestReferences) {
      named = toNamed(
        code,
        next2,
        options.omitOptionalSemicolons,
        options.attribute
      );
    }
    if ((options.useShortestReferences || !named) && options.useShortestReferences) {
      const decimal = toDecimal(code, next2, options.omitOptionalSemicolons);
      if (decimal.length < numeric.length) {
        numeric = decimal;
      }
    }
    return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
  }

  // node_modules/.pnpm/stringify-entities@4.0.3/node_modules/stringify-entities/lib/index.js
  function stringifyEntities(value, options) {
    return core(value, Object.assign({ format: formatSmart }, options));
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/handle/comment.js
  function comment2(node, _1, _2, state) {
    return state.settings.bogusComments ? "<?" + stringifyEntities(
      node.value,
      Object.assign({}, state.settings.characterReferences, { subset: [">"] })
    ) + ">" : "<!--" + node.value.replace(/^>|^->|<!--|-->|--!>|<!-$/g, encode) + "-->";
    function encode($0) {
      return stringifyEntities(
        $0,
        Object.assign({}, state.settings.characterReferences, {
          subset: ["<", ">"]
        })
      );
    }
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/handle/doctype.js
  function doctype2(_1, _2, _3, state) {
    return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
  }

  // node_modules/.pnpm/ccount@2.0.1/node_modules/ccount/index.js
  function ccount(value, character) {
    const source = String(value);
    if (typeof character !== "string") {
      throw new TypeError("Expected character");
    }
    let count2 = 0;
    let index2 = source.indexOf(character);
    while (index2 !== -1) {
      count2++;
      index2 = source.indexOf(character, index2 + character.length);
    }
    return count2;
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/omission/util/siblings.js
  var siblingAfter = siblings(1);
  var siblingBefore = siblings(-1);
  var emptyChildren = [];
  function siblings(increment2) {
    return sibling;
    function sibling(parent, index2, includeWhitespace) {
      const siblings2 = parent ? parent.children : emptyChildren;
      let offset = (index2 || 0) + increment2;
      let next2 = siblings2[offset];
      if (!includeWhitespace) {
        while (next2 && whitespace(next2)) {
          offset += increment2;
          next2 = siblings2[offset];
        }
      }
      return next2;
    }
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/omission/omission.js
  var own7 = {}.hasOwnProperty;
  function omission(handlers) {
    return omit;
    function omit(node, index2, parent) {
      return own7.call(handlers, node.tagName) && handlers[node.tagName](node, index2, parent);
    }
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/omission/closing.js
  var closing = omission({
    body,
    caption: headOrColgroupOrCaption,
    colgroup: headOrColgroupOrCaption,
    dd,
    dt,
    head: headOrColgroupOrCaption,
    html: html3,
    li,
    optgroup,
    option,
    p,
    rp: rubyElement,
    rt: rubyElement,
    tbody,
    td: cells,
    tfoot,
    th: cells,
    thead,
    tr
  });
  function headOrColgroupOrCaption(_, index2, parent) {
    const next2 = siblingAfter(parent, index2, true);
    return !next2 || next2.type !== "comment" && !(next2.type === "text" && whitespace(next2.value.charAt(0)));
  }
  function html3(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type !== "comment";
  }
  function body(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type !== "comment";
  }
  function p(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return next2 ? next2.type === "element" && (next2.tagName === "address" || next2.tagName === "article" || next2.tagName === "aside" || next2.tagName === "blockquote" || next2.tagName === "details" || next2.tagName === "div" || next2.tagName === "dl" || next2.tagName === "fieldset" || next2.tagName === "figcaption" || next2.tagName === "figure" || next2.tagName === "footer" || next2.tagName === "form" || next2.tagName === "h1" || next2.tagName === "h2" || next2.tagName === "h3" || next2.tagName === "h4" || next2.tagName === "h5" || next2.tagName === "h6" || next2.tagName === "header" || next2.tagName === "hgroup" || next2.tagName === "hr" || next2.tagName === "main" || next2.tagName === "menu" || next2.tagName === "nav" || next2.tagName === "ol" || next2.tagName === "p" || next2.tagName === "pre" || next2.tagName === "section" || next2.tagName === "table" || next2.tagName === "ul") : !parent || // Confusing parent.
    !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
  }
  function li(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type === "element" && next2.tagName === "li";
  }
  function dt(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return Boolean(
      next2 && next2.type === "element" && (next2.tagName === "dt" || next2.tagName === "dd")
    );
  }
  function dd(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type === "element" && (next2.tagName === "dt" || next2.tagName === "dd");
  }
  function rubyElement(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type === "element" && (next2.tagName === "rp" || next2.tagName === "rt");
  }
  function optgroup(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type === "element" && next2.tagName === "optgroup";
  }
  function option(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type === "element" && (next2.tagName === "option" || next2.tagName === "optgroup");
  }
  function thead(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return Boolean(
      next2 && next2.type === "element" && (next2.tagName === "tbody" || next2.tagName === "tfoot")
    );
  }
  function tbody(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type === "element" && (next2.tagName === "tbody" || next2.tagName === "tfoot");
  }
  function tfoot(_, index2, parent) {
    return !siblingAfter(parent, index2);
  }
  function tr(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type === "element" && next2.tagName === "tr";
  }
  function cells(_, index2, parent) {
    const next2 = siblingAfter(parent, index2);
    return !next2 || next2.type === "element" && (next2.tagName === "td" || next2.tagName === "th");
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/omission/opening.js
  var opening = omission({
    body: body2,
    colgroup,
    head,
    html: html4,
    tbody: tbody2
  });
  function html4(node) {
    const head2 = siblingAfter(node, -1);
    return !head2 || head2.type !== "comment";
  }
  function head(node) {
    const children = node.children;
    const seen = [];
    let index2 = -1;
    while (++index2 < children.length) {
      const child = children[index2];
      if (child.type === "element" && (child.tagName === "title" || child.tagName === "base")) {
        if (seen.includes(child.tagName))
          return false;
        seen.push(child.tagName);
      }
    }
    return children.length > 0;
  }
  function body2(node) {
    const head2 = siblingAfter(node, -1, true);
    return !head2 || head2.type !== "comment" && !(head2.type === "text" && whitespace(head2.value.charAt(0))) && !(head2.type === "element" && (head2.tagName === "meta" || head2.tagName === "link" || head2.tagName === "script" || head2.tagName === "style" || head2.tagName === "template"));
  }
  function colgroup(node, index2, parent) {
    const previous = siblingBefore(parent, index2);
    const head2 = siblingAfter(node, -1, true);
    if (parent && previous && previous.type === "element" && previous.tagName === "colgroup" && closing(previous, parent.children.indexOf(previous), parent)) {
      return false;
    }
    return Boolean(head2 && head2.type === "element" && head2.tagName === "col");
  }
  function tbody2(node, index2, parent) {
    const previous = siblingBefore(parent, index2);
    const head2 = siblingAfter(node, -1);
    if (parent && previous && previous.type === "element" && (previous.tagName === "thead" || previous.tagName === "tbody") && closing(previous, parent.children.indexOf(previous), parent)) {
      return false;
    }
    return Boolean(head2 && head2.type === "element" && head2.tagName === "tr");
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/handle/element.js
  var constants = {
    // See: <https://html.spec.whatwg.org/#attribute-name-state>.
    name: [
      ["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")],
      [`\0	
\f\r "&'/<=>`.split(""), "\0	\n\f\r \"&'/<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
    unquoted: [
      ["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")],
      ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
    single: [
      ["&'".split(""), "\"&'`".split("")],
      ["\0&'".split(""), "\0\"&'`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
    double: [
      ['"&'.split(""), "\"&'`".split("")],
      ['\0"&'.split(""), "\0\"&'`".split("")]
    ]
  };
  function element2(node, index2, parent, state) {
    const schema = state.schema;
    const omit = schema.space === "svg" ? false : state.settings.omitOptionalTags;
    let selfClosing = schema.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node.tagName.toLowerCase());
    const parts = [];
    let last;
    if (schema.space === "html" && node.tagName === "svg") {
      state.schema = svg2;
    }
    const attrs = serializeAttributes(state, node.properties);
    const content = state.all(
      schema.space === "html" && node.tagName === "template" ? node.content : node
    );
    state.schema = schema;
    if (content)
      selfClosing = false;
    if (attrs || !omit || !opening(node, index2, parent)) {
      parts.push("<", node.tagName, attrs ? " " + attrs : "");
      if (selfClosing && (schema.space === "svg" || state.settings.closeSelfClosing)) {
        last = attrs.charAt(attrs.length - 1);
        if (!state.settings.tightSelfClosing || last === "/" || last && last !== '"' && last !== "'") {
          parts.push(" ");
        }
        parts.push("/");
      }
      parts.push(">");
    }
    parts.push(content);
    if (!selfClosing && (!omit || !closing(node, index2, parent))) {
      parts.push("</" + node.tagName + ">");
    }
    return parts.join("");
  }
  function serializeAttributes(state, props) {
    const values = [];
    let index2 = -1;
    let key2;
    if (props) {
      for (key2 in props) {
        if (props[key2] !== null && props[key2] !== void 0) {
          const value = serializeAttribute(state, key2, props[key2]);
          if (value)
            values.push(value);
        }
      }
    }
    while (++index2 < values.length) {
      const last = state.settings.tightAttributes ? values[index2].charAt(values[index2].length - 1) : void 0;
      if (index2 !== values.length - 1 && last !== '"' && last !== "'") {
        values[index2] += " ";
      }
    }
    return values.join("");
  }
  function serializeAttribute(state, key2, value) {
    const info = find(state.schema, key2);
    const x = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
    const y = state.settings.allowDangerousCharacters ? 0 : 1;
    let quote = state.quote;
    let result;
    if (info.overloadedBoolean && (value === info.attribute || value === "")) {
      value = true;
    } else if (info.boolean || info.overloadedBoolean && typeof value !== "string") {
      value = Boolean(value);
    }
    if (value === null || value === void 0 || value === false || typeof value === "number" && Number.isNaN(value)) {
      return "";
    }
    const name2 = stringifyEntities(
      info.attribute,
      Object.assign({}, state.settings.characterReferences, {
        // Always encode without parse errors in non-HTML.
        subset: constants.name[x][y]
      })
    );
    if (value === true)
      return name2;
    value = Array.isArray(value) ? (info.commaSeparated ? stringify : stringify2)(value, {
      padLeft: !state.settings.tightCommaSeparatedLists
    }) : String(value);
    if (state.settings.collapseEmptyAttributes && !value)
      return name2;
    if (state.settings.preferUnquoted) {
      result = stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          attribute: true,
          subset: constants.unquoted[x][y]
        })
      );
    }
    if (result !== value) {
      if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) {
        quote = state.alternative;
      }
      result = quote + stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          // Always encode without parse errors in non-HTML.
          subset: (quote === "'" ? constants.single : constants.double)[x][y],
          attribute: true
        })
      ) + quote;
    }
    return name2 + (result ? "=" + result : result);
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/handle/text.js
  function text2(node, _, parent, state) {
    return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node.value : stringifyEntities(
      node.value,
      Object.assign({}, state.settings.characterReferences, {
        subset: ["<", "&"]
      })
    );
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/handle/raw.js
  function raw(node, index2, parent, state) {
    return state.settings.allowDangerousHtml ? node.value : text2(node, index2, parent, state);
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/handle/root.js
  function root3(node, _1, _2, state) {
    return state.all(node);
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/handle/index.js
  var handle = zwitch("type", {
    invalid,
    unknown,
    handlers: { comment: comment2, doctype: doctype2, element: element2, raw, root: root3, text: text2 }
  });
  function invalid(node) {
    throw new Error("Expected node, not `" + node + "`");
  }
  function unknown(node_) {
    const node = (
      /** @type {Nodes} */
      node_
    );
    throw new Error("Cannot compile unknown node `" + node.type + "`");
  }

  // node_modules/.pnpm/hast-util-to-html@9.0.0/node_modules/hast-util-to-html/lib/index.js
  var emptyOptions = {};
  var emptyCharacterReferences = {};
  var emptyChildren2 = [];
  function toHtml(tree, options) {
    const options_ = options || emptyOptions;
    const quote = options_.quote || '"';
    const alternative = quote === '"' ? "'" : '"';
    if (quote !== '"' && quote !== "'") {
      throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
    }
    const state = {
      one: one4,
      all: all4,
      settings: {
        omitOptionalTags: options_.omitOptionalTags || false,
        allowParseErrors: options_.allowParseErrors || false,
        allowDangerousCharacters: options_.allowDangerousCharacters || false,
        quoteSmart: options_.quoteSmart || false,
        preferUnquoted: options_.preferUnquoted || false,
        tightAttributes: options_.tightAttributes || false,
        upperDoctype: options_.upperDoctype || false,
        tightDoctype: options_.tightDoctype || false,
        bogusComments: options_.bogusComments || false,
        tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
        tightSelfClosing: options_.tightSelfClosing || false,
        collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
        allowDangerousHtml: options_.allowDangerousHtml || false,
        voids: options_.voids || htmlVoidElements,
        characterReferences: options_.characterReferences || emptyCharacterReferences,
        closeSelfClosing: options_.closeSelfClosing || false,
        closeEmptyElements: options_.closeEmptyElements || false
      },
      schema: options_.space === "svg" ? svg2 : html2,
      quote,
      alternative
    };
    return state.one(
      Array.isArray(tree) ? { type: "root", children: tree } : tree,
      void 0,
      void 0
    );
  }
  function one4(node, index2, parent) {
    return handle(node, index2, parent, this);
  }
  function all4(parent) {
    const results = [];
    const children = parent && parent.children || emptyChildren2;
    let index2 = -1;
    while (++index2 < children.length) {
      results[index2] = this.one(children[index2], index2, parent);
    }
    return results.join("");
  }

  // node_modules/.pnpm/rehype-stringify@10.0.0/node_modules/rehype-stringify/lib/index.js
  function rehypeStringify(options) {
    const self = this;
    const settings = { ...self.data("settings"), ...options };
    self.compiler = compiler;
    function compiler(tree) {
      return toHtml(tree, settings);
    }
  }

  // src/process-html.ts
  async function processHTML(dom) {
    let domm = dom;
    const parser = new DOMParser();
    const reasons = {
      mathjax3: dom.querySelector("mjx-container") !== null
    };
    console.log(dom);
    if (Object.values(reasons).some((r) => r === true)) {
      let mjx3Data = globalThis.MathJax && globalThis.MathJax.startup.document.getMathItemsWithin(dom);
      console.log(mjx3Data);
      const vfile2 = await unified().use(parse5).use(rehypeStringify).use(lib_default, {
        rewrite: (node, index2, parent) => {
          if (node.type === "element" && node.tagName === "mjx-container") {
            if (!mjx3Data)
              return;
            const mjxIndex = Number(node.properties.ctxtmenu_counter);
            const tex = mjx3Data[Number.isNaN(mjxIndex) ? index2 : mjxIndex].math;
            node.tagName = "div";
            node.children = [{ type: "text", value: tex }];
            node.properties.className = "__mjx-turndown";
            console.log(node);
          }
        }
      }).process(dom?.documentElement?.innerHTML ?? dom.innerHTML);
      domm = parser.parseFromString(String(vfile2), "text/html");
      console.log(domm);
    }
    const { title, byline, content } = new import_readability.Readability(domm, {
      keepClasses: true
    }).parse();
    return content;
  }

  // node_modules/.pnpm/turndown@7.1.2/node_modules/turndown/lib/turndown.browser.es.js
  function extend2(destination) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key2 in source) {
        if (source.hasOwnProperty(key2))
          destination[key2] = source[key2];
      }
    }
    return destination;
  }
  function repeat(character, count2) {
    return Array(count2 + 1).join(character);
  }
  function trimLeadingNewlines(string) {
    return string.replace(/^\n*/, "");
  }
  function trimTrailingNewlines(string) {
    var indexEnd = string.length;
    while (indexEnd > 0 && string[indexEnd - 1] === "\n")
      indexEnd--;
    return string.substring(0, indexEnd);
  }
  var blockElements = [
    "ADDRESS",
    "ARTICLE",
    "ASIDE",
    "AUDIO",
    "BLOCKQUOTE",
    "BODY",
    "CANVAS",
    "CENTER",
    "DD",
    "DIR",
    "DIV",
    "DL",
    "DT",
    "FIELDSET",
    "FIGCAPTION",
    "FIGURE",
    "FOOTER",
    "FORM",
    "FRAMESET",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HEADER",
    "HGROUP",
    "HR",
    "HTML",
    "ISINDEX",
    "LI",
    "MAIN",
    "MENU",
    "NAV",
    "NOFRAMES",
    "NOSCRIPT",
    "OL",
    "OUTPUT",
    "P",
    "PRE",
    "SECTION",
    "TABLE",
    "TBODY",
    "TD",
    "TFOOT",
    "TH",
    "THEAD",
    "TR",
    "UL"
  ];
  function isBlock(node) {
    return is3(node, blockElements);
  }
  var voidElements = [
    "AREA",
    "BASE",
    "BR",
    "COL",
    "COMMAND",
    "EMBED",
    "HR",
    "IMG",
    "INPUT",
    "KEYGEN",
    "LINK",
    "META",
    "PARAM",
    "SOURCE",
    "TRACK",
    "WBR"
  ];
  function isVoid(node) {
    return is3(node, voidElements);
  }
  function hasVoid(node) {
    return has2(node, voidElements);
  }
  var meaningfulWhenBlankElements = [
    "A",
    "TABLE",
    "THEAD",
    "TBODY",
    "TFOOT",
    "TH",
    "TD",
    "IFRAME",
    "SCRIPT",
    "AUDIO",
    "VIDEO"
  ];
  function isMeaningfulWhenBlank(node) {
    return is3(node, meaningfulWhenBlankElements);
  }
  function hasMeaningfulWhenBlank(node) {
    return has2(node, meaningfulWhenBlankElements);
  }
  function is3(node, tagNames) {
    return tagNames.indexOf(node.nodeName) >= 0;
  }
  function has2(node, tagNames) {
    return node.getElementsByTagName && tagNames.some(function(tagName) {
      return node.getElementsByTagName(tagName).length;
    });
  }
  var rules = {};
  rules.paragraph = {
    filter: "p",
    replacement: function(content) {
      return "\n\n" + content + "\n\n";
    }
  };
  rules.lineBreak = {
    filter: "br",
    replacement: function(content, node, options) {
      return options.br + "\n";
    }
  };
  rules.heading = {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function(content, node, options) {
      var hLevel = Number(node.nodeName.charAt(1));
      if (options.headingStyle === "setext" && hLevel < 3) {
        var underline = repeat(hLevel === 1 ? "=" : "-", content.length);
        return "\n\n" + content + "\n" + underline + "\n\n";
      } else {
        return "\n\n" + repeat("#", hLevel) + " " + content + "\n\n";
      }
    }
  };
  rules.blockquote = {
    filter: "blockquote",
    replacement: function(content) {
      content = content.replace(/^\n+|\n+$/g, "");
      content = content.replace(/^/gm, "> ");
      return "\n\n" + content + "\n\n";
    }
  };
  rules.list = {
    filter: ["ul", "ol"],
    replacement: function(content, node) {
      var parent = node.parentNode;
      if (parent.nodeName === "LI" && parent.lastElementChild === node) {
        return "\n" + content;
      } else {
        return "\n\n" + content + "\n\n";
      }
    }
  };
  rules.listItem = {
    filter: "li",
    replacement: function(content, node, options) {
      content = content.replace(/^\n+/, "").replace(/\n+$/, "\n").replace(/\n/gm, "\n    ");
      var prefix = options.bulletListMarker + "   ";
      var parent = node.parentNode;
      if (parent.nodeName === "OL") {
        var start = parent.getAttribute("start");
        var index2 = Array.prototype.indexOf.call(parent.children, node);
        prefix = (start ? Number(start) + index2 : index2 + 1) + ".  ";
      }
      return prefix + content + (node.nextSibling && !/\n$/.test(content) ? "\n" : "");
    }
  };
  rules.indentedCodeBlock = {
    filter: function(node, options) {
      return options.codeBlockStyle === "indented" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
    },
    replacement: function(content, node, options) {
      return "\n\n    " + node.firstChild.textContent.replace(/\n/g, "\n    ") + "\n\n";
    }
  };
  rules.fencedCodeBlock = {
    filter: function(node, options) {
      return options.codeBlockStyle === "fenced" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
    },
    replacement: function(content, node, options) {
      var className2 = node.firstChild.getAttribute("class") || "";
      var language = (className2.match(/language-(\S+)/) || [null, ""])[1];
      var code = node.firstChild.textContent;
      var fenceChar = options.fence.charAt(0);
      var fenceSize = 3;
      var fenceInCodeRegex = new RegExp("^" + fenceChar + "{3,}", "gm");
      var match;
      while (match = fenceInCodeRegex.exec(code)) {
        if (match[0].length >= fenceSize) {
          fenceSize = match[0].length + 1;
        }
      }
      var fence = repeat(fenceChar, fenceSize);
      return "\n\n" + fence + language + "\n" + code.replace(/\n$/, "") + "\n" + fence + "\n\n";
    }
  };
  rules.horizontalRule = {
    filter: "hr",
    replacement: function(content, node, options) {
      return "\n\n" + options.hr + "\n\n";
    }
  };
  rules.inlineLink = {
    filter: function(node, options) {
      return options.linkStyle === "inlined" && node.nodeName === "A" && node.getAttribute("href");
    },
    replacement: function(content, node) {
      var href = node.getAttribute("href");
      var title = cleanAttribute(node.getAttribute("title"));
      if (title)
        title = ' "' + title + '"';
      return "[" + content + "](" + href + title + ")";
    }
  };
  rules.referenceLink = {
    filter: function(node, options) {
      return options.linkStyle === "referenced" && node.nodeName === "A" && node.getAttribute("href");
    },
    replacement: function(content, node, options) {
      var href = node.getAttribute("href");
      var title = cleanAttribute(node.getAttribute("title"));
      if (title)
        title = ' "' + title + '"';
      var replacement;
      var reference;
      switch (options.linkReferenceStyle) {
        case "collapsed":
          replacement = "[" + content + "][]";
          reference = "[" + content + "]: " + href + title;
          break;
        case "shortcut":
          replacement = "[" + content + "]";
          reference = "[" + content + "]: " + href + title;
          break;
        default:
          var id2 = this.references.length + 1;
          replacement = "[" + content + "][" + id2 + "]";
          reference = "[" + id2 + "]: " + href + title;
      }
      this.references.push(reference);
      return replacement;
    },
    references: [],
    append: function(options) {
      var references = "";
      if (this.references.length) {
        references = "\n\n" + this.references.join("\n") + "\n\n";
        this.references = [];
      }
      return references;
    }
  };
  rules.emphasis = {
    filter: ["em", "i"],
    replacement: function(content, node, options) {
      if (!content.trim())
        return "";
      return options.emDelimiter + content + options.emDelimiter;
    }
  };
  rules.strong = {
    filter: ["strong", "b"],
    replacement: function(content, node, options) {
      if (!content.trim())
        return "";
      return options.strongDelimiter + content + options.strongDelimiter;
    }
  };
  rules.code = {
    filter: function(node) {
      var hasSiblings = node.previousSibling || node.nextSibling;
      var isCodeBlock = node.parentNode.nodeName === "PRE" && !hasSiblings;
      return node.nodeName === "CODE" && !isCodeBlock;
    },
    replacement: function(content) {
      if (!content)
        return "";
      content = content.replace(/\r?\n|\r/g, " ");
      var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? " " : "";
      var delimiter = "`";
      var matches2 = content.match(/`+/gm) || [];
      while (matches2.indexOf(delimiter) !== -1)
        delimiter = delimiter + "`";
      return delimiter + extraSpace + content + extraSpace + delimiter;
    }
  };
  rules.image = {
    filter: "img",
    replacement: function(content, node) {
      var alt = cleanAttribute(node.getAttribute("alt"));
      var src = node.getAttribute("src") || "";
      var title = cleanAttribute(node.getAttribute("title"));
      var titlePart = title ? ' "' + title + '"' : "";
      return src ? "![" + alt + "](" + src + titlePart + ")" : "";
    }
  };
  function cleanAttribute(attribute2) {
    return attribute2 ? attribute2.replace(/(\n+\s*)+/g, "\n") : "";
  }
  function Rules(options) {
    this.options = options;
    this._keep = [];
    this._remove = [];
    this.blankRule = {
      replacement: options.blankReplacement
    };
    this.keepReplacement = options.keepReplacement;
    this.defaultRule = {
      replacement: options.defaultReplacement
    };
    this.array = [];
    for (var key2 in options.rules)
      this.array.push(options.rules[key2]);
  }
  Rules.prototype = {
    add: function(key2, rule) {
      this.array.unshift(rule);
    },
    keep: function(filter) {
      this._keep.unshift({
        filter,
        replacement: this.keepReplacement
      });
    },
    remove: function(filter) {
      this._remove.unshift({
        filter,
        replacement: function() {
          return "";
        }
      });
    },
    forNode: function(node) {
      if (node.isBlank)
        return this.blankRule;
      var rule;
      if (rule = findRule(this.array, node, this.options))
        return rule;
      if (rule = findRule(this._keep, node, this.options))
        return rule;
      if (rule = findRule(this._remove, node, this.options))
        return rule;
      return this.defaultRule;
    },
    forEach: function(fn) {
      for (var i = 0; i < this.array.length; i++)
        fn(this.array[i], i);
    }
  };
  function findRule(rules3, node, options) {
    for (var i = 0; i < rules3.length; i++) {
      var rule = rules3[i];
      if (filterValue(rule, node, options))
        return rule;
    }
    return void 0;
  }
  function filterValue(rule, node, options) {
    var filter = rule.filter;
    if (typeof filter === "string") {
      if (filter === node.nodeName.toLowerCase())
        return true;
    } else if (Array.isArray(filter)) {
      if (filter.indexOf(node.nodeName.toLowerCase()) > -1)
        return true;
    } else if (typeof filter === "function") {
      if (filter.call(rule, node, options))
        return true;
    } else {
      throw new TypeError("`filter` needs to be a string, array, or function");
    }
  }
  function collapseWhitespace(options) {
    var element3 = options.element;
    var isBlock2 = options.isBlock;
    var isVoid2 = options.isVoid;
    var isPre = options.isPre || function(node2) {
      return node2.nodeName === "PRE";
    };
    if (!element3.firstChild || isPre(element3))
      return;
    var prevText = null;
    var keepLeadingWs = false;
    var prev = null;
    var node = next(prev, element3, isPre);
    while (node !== element3) {
      if (node.nodeType === 3 || node.nodeType === 4) {
        var text3 = node.data.replace(/[ \r\n\t]+/g, " ");
        if ((!prevText || / $/.test(prevText.data)) && !keepLeadingWs && text3[0] === " ") {
          text3 = text3.substr(1);
        }
        if (!text3) {
          node = remove(node);
          continue;
        }
        node.data = text3;
        prevText = node;
      } else if (node.nodeType === 1) {
        if (isBlock2(node) || node.nodeName === "BR") {
          if (prevText) {
            prevText.data = prevText.data.replace(/ $/, "");
          }
          prevText = null;
          keepLeadingWs = false;
        } else if (isVoid2(node) || isPre(node)) {
          prevText = null;
          keepLeadingWs = true;
        } else if (prevText) {
          keepLeadingWs = false;
        }
      } else {
        node = remove(node);
        continue;
      }
      var nextNode = next(prev, node, isPre);
      prev = node;
      node = nextNode;
    }
    if (prevText) {
      prevText.data = prevText.data.replace(/ $/, "");
      if (!prevText.data) {
        remove(prevText);
      }
    }
  }
  function remove(node) {
    var next2 = node.nextSibling || node.parentNode;
    node.parentNode.removeChild(node);
    return next2;
  }
  function next(prev, current, isPre) {
    if (prev && prev.parentNode === current || isPre(current)) {
      return current.nextSibling || current.parentNode;
    }
    return current.firstChild || current.nextSibling || current.parentNode;
  }
  var root4 = typeof window !== "undefined" ? window : {};
  function canParseHTMLNatively() {
    var Parser = root4.DOMParser;
    var canParse = false;
    try {
      if (new Parser().parseFromString("", "text/html")) {
        canParse = true;
      }
    } catch (e) {
    }
    return canParse;
  }
  function createHTMLParser() {
    var Parser = function() {
    };
    {
      if (shouldUseActiveX()) {
        Parser.prototype.parseFromString = function(string) {
          var doc = new window.ActiveXObject("htmlfile");
          doc.designMode = "on";
          doc.open();
          doc.write(string);
          doc.close();
          return doc;
        };
      } else {
        Parser.prototype.parseFromString = function(string) {
          var doc = document.implementation.createHTMLDocument("");
          doc.open();
          doc.write(string);
          doc.close();
          return doc;
        };
      }
    }
    return Parser;
  }
  function shouldUseActiveX() {
    var useActiveX = false;
    try {
      document.implementation.createHTMLDocument("").open();
    } catch (e) {
      if (window.ActiveXObject)
        useActiveX = true;
    }
    return useActiveX;
  }
  var HTMLParser = canParseHTMLNatively() ? root4.DOMParser : createHTMLParser();
  function RootNode(input, options) {
    var root5;
    if (typeof input === "string") {
      var doc = htmlParser().parseFromString(
        // DOM parsers arrange elements in the <head> and <body>.
        // Wrapping in a custom element ensures elements are reliably arranged in
        // a single element.
        '<x-turndown id="turndown-root">' + input + "</x-turndown>",
        "text/html"
      );
      root5 = doc.getElementById("turndown-root");
    } else {
      root5 = input.cloneNode(true);
    }
    collapseWhitespace({
      element: root5,
      isBlock,
      isVoid,
      isPre: options.preformattedCode ? isPreOrCode : null
    });
    return root5;
  }
  var _htmlParser;
  function htmlParser() {
    _htmlParser = _htmlParser || new HTMLParser();
    return _htmlParser;
  }
  function isPreOrCode(node) {
    return node.nodeName === "PRE" || node.nodeName === "CODE";
  }
  function Node(node, options) {
    node.isBlock = isBlock(node);
    node.isCode = node.nodeName === "CODE" || node.parentNode.isCode;
    node.isBlank = isBlank(node);
    node.flankingWhitespace = flankingWhitespace(node, options);
    return node;
  }
  function isBlank(node) {
    return !isVoid(node) && !isMeaningfulWhenBlank(node) && /^\s*$/i.test(node.textContent) && !hasVoid(node) && !hasMeaningfulWhenBlank(node);
  }
  function flankingWhitespace(node, options) {
    if (node.isBlock || options.preformattedCode && node.isCode) {
      return { leading: "", trailing: "" };
    }
    var edges = edgeWhitespace(node.textContent);
    if (edges.leadingAscii && isFlankedByWhitespace("left", node, options)) {
      edges.leading = edges.leadingNonAscii;
    }
    if (edges.trailingAscii && isFlankedByWhitespace("right", node, options)) {
      edges.trailing = edges.trailingNonAscii;
    }
    return { leading: edges.leading, trailing: edges.trailing };
  }
  function edgeWhitespace(string) {
    var m = string.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
    return {
      leading: m[1],
      // whole string for whitespace-only strings
      leadingAscii: m[2],
      leadingNonAscii: m[3],
      trailing: m[4],
      // empty for whitespace-only strings
      trailingNonAscii: m[5],
      trailingAscii: m[6]
    };
  }
  function isFlankedByWhitespace(side, node, options) {
    var sibling;
    var regExp;
    var isFlanked;
    if (side === "left") {
      sibling = node.previousSibling;
      regExp = / $/;
    } else {
      sibling = node.nextSibling;
      regExp = /^ /;
    }
    if (sibling) {
      if (sibling.nodeType === 3) {
        isFlanked = regExp.test(sibling.nodeValue);
      } else if (options.preformattedCode && sibling.nodeName === "CODE") {
        isFlanked = false;
      } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
        isFlanked = regExp.test(sibling.textContent);
      }
    }
    return isFlanked;
  }
  var reduce = Array.prototype.reduce;
  var escapes = [
    [/\\/g, "\\\\"],
    [/\*/g, "\\*"],
    [/^-/g, "\\-"],
    [/^\+ /g, "\\+ "],
    [/^(=+)/g, "\\$1"],
    [/^(#{1,6}) /g, "\\$1 "],
    [/`/g, "\\`"],
    [/^~~~/g, "\\~~~"],
    [/\[/g, "\\["],
    [/\]/g, "\\]"],
    [/^>/g, "\\>"],
    [/_/g, "\\_"],
    [/^(\d+)\. /g, "$1\\. "]
  ];
  function TurndownService(options) {
    if (!(this instanceof TurndownService))
      return new TurndownService(options);
    var defaults = {
      rules,
      headingStyle: "setext",
      hr: "* * *",
      bulletListMarker: "*",
      codeBlockStyle: "indented",
      fence: "```",
      emDelimiter: "_",
      strongDelimiter: "**",
      linkStyle: "inlined",
      linkReferenceStyle: "full",
      br: "  ",
      preformattedCode: false,
      blankReplacement: function(content, node) {
        return node.isBlock ? "\n\n" : "";
      },
      keepReplacement: function(content, node) {
        return node.isBlock ? "\n\n" + node.outerHTML + "\n\n" : node.outerHTML;
      },
      defaultReplacement: function(content, node) {
        return node.isBlock ? "\n\n" + content + "\n\n" : content;
      }
    };
    this.options = extend2({}, defaults, options);
    this.rules = new Rules(this.options);
  }
  TurndownService.prototype = {
    /**
     * The entry point for converting a string or DOM node to Markdown
     * @public
     * @param {String|HTMLElement} input The string or DOM node to convert
     * @returns A Markdown representation of the input
     * @type String
     */
    turndown: function(input) {
      if (!canConvert(input)) {
        throw new TypeError(
          input + " is not a string, or an element/document/fragment node."
        );
      }
      if (input === "")
        return "";
      var output = process.call(this, new RootNode(input, this.options));
      return postProcess.call(this, output);
    },
    /**
     * Add one or more plugins
     * @public
     * @param {Function|Array} plugin The plugin or array of plugins to add
     * @returns The Turndown instance for chaining
     * @type Object
     */
    use: function(plugin) {
      if (Array.isArray(plugin)) {
        for (var i = 0; i < plugin.length; i++)
          this.use(plugin[i]);
      } else if (typeof plugin === "function") {
        plugin(this);
      } else {
        throw new TypeError("plugin must be a Function or an Array of Functions");
      }
      return this;
    },
    /**
     * Adds a rule
     * @public
     * @param {String} key The unique key of the rule
     * @param {Object} rule The rule
     * @returns The Turndown instance for chaining
     * @type Object
     */
    addRule: function(key2, rule) {
      this.rules.add(key2, rule);
      return this;
    },
    /**
     * Keep a node (as HTML) that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */
    keep: function(filter) {
      this.rules.keep(filter);
      return this;
    },
    /**
     * Remove a node that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */
    remove: function(filter) {
      this.rules.remove(filter);
      return this;
    },
    /**
     * Escapes Markdown syntax
     * @public
     * @param {String} string The string to escape
     * @returns A string with Markdown syntax escaped
     * @type String
     */
    escape: function(string) {
      return escapes.reduce(function(accumulator, escape) {
        return accumulator.replace(escape[0], escape[1]);
      }, string);
    }
  };
  function process(parentNode) {
    var self = this;
    return reduce.call(parentNode.childNodes, function(output, node) {
      node = new Node(node, self.options);
      var replacement = "";
      if (node.nodeType === 3) {
        replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
      } else if (node.nodeType === 1) {
        replacement = replacementForNode.call(self, node);
      }
      return join2(output, replacement);
    }, "");
  }
  function postProcess(output) {
    var self = this;
    this.rules.forEach(function(rule) {
      if (typeof rule.append === "function") {
        output = join2(output, rule.append(self.options));
      }
    });
    return output.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
  }
  function replacementForNode(node) {
    var rule = this.rules.forNode(node);
    var content = process.call(this, node);
    var whitespace3 = node.flankingWhitespace;
    if (whitespace3.leading || whitespace3.trailing)
      content = content.trim();
    return whitespace3.leading + rule.replacement(content, node, this.options) + whitespace3.trailing;
  }
  function join2(output, replacement) {
    var s1 = trimTrailingNewlines(output);
    var s2 = trimLeadingNewlines(replacement);
    var nls = Math.max(output.length - s1.length, replacement.length - s2.length);
    var separator = "\n\n".substring(0, nls);
    return s1 + separator + s2;
  }
  function canConvert(input) {
    return input != null && (typeof input === "string" || input.nodeType && (input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11));
  }
  var turndown_browser_es_default = TurndownService;

  // node_modules/.pnpm/turndown-plugin-gfm@1.0.2/node_modules/turndown-plugin-gfm/lib/turndown-plugin-gfm.es.js
  var highlightRegExp = /highlight-(?:text|source)-([a-z0-9]+)/;
  function highlightedCodeBlock(turndownService2) {
    turndownService2.addRule("highlightedCodeBlock", {
      filter: function(node) {
        var firstChild2 = node.firstChild;
        return node.nodeName === "DIV" && highlightRegExp.test(node.className) && firstChild2 && firstChild2.nodeName === "PRE";
      },
      replacement: function(content, node, options) {
        var className2 = node.className || "";
        var language = (className2.match(highlightRegExp) || [null, ""])[1];
        return "\n\n" + options.fence + language + "\n" + node.firstChild.textContent + "\n" + options.fence + "\n\n";
      }
    });
  }
  function strikethrough(turndownService2) {
    turndownService2.addRule("strikethrough", {
      filter: ["del", "s", "strike"],
      replacement: function(content) {
        return "~" + content + "~";
      }
    });
  }
  var indexOf = Array.prototype.indexOf;
  var every = Array.prototype.every;
  var rules2 = {};
  rules2.tableCell = {
    filter: ["th", "td"],
    replacement: function(content, node) {
      return cell(content, node);
    }
  };
  rules2.tableRow = {
    filter: "tr",
    replacement: function(content, node) {
      var borderCells = "";
      var alignMap = { left: ":--", right: "--:", center: ":-:" };
      if (isHeadingRow(node)) {
        for (var i = 0; i < node.childNodes.length; i++) {
          var border = "---";
          var align = (node.childNodes[i].getAttribute("align") || "").toLowerCase();
          if (align)
            border = alignMap[align] || border;
          borderCells += cell(border, node.childNodes[i]);
        }
      }
      return "\n" + content + (borderCells ? "\n" + borderCells : "");
    }
  };
  rules2.table = {
    // Only convert tables with a heading row.
    // Tables with no heading row are kept using `keep` (see below).
    filter: function(node) {
      return node.nodeName === "TABLE" && isHeadingRow(node.rows[0]);
    },
    replacement: function(content) {
      content = content.replace("\n\n", "\n");
      return "\n\n" + content + "\n\n";
    }
  };
  rules2.tableSection = {
    filter: ["thead", "tbody", "tfoot"],
    replacement: function(content) {
      return content;
    }
  };
  function isHeadingRow(tr2) {
    var parentNode = tr2.parentNode;
    return parentNode.nodeName === "THEAD" || parentNode.firstChild === tr2 && (parentNode.nodeName === "TABLE" || isFirstTbody(parentNode)) && every.call(tr2.childNodes, function(n) {
      return n.nodeName === "TH";
    });
  }
  function isFirstTbody(element3) {
    var previousSibling = element3.previousSibling;
    return element3.nodeName === "TBODY" && (!previousSibling || previousSibling.nodeName === "THEAD" && /^\s*$/i.test(previousSibling.textContent));
  }
  function cell(content, node) {
    var index2 = indexOf.call(node.parentNode.childNodes, node);
    var prefix = " ";
    if (index2 === 0)
      prefix = "| ";
    return prefix + content + " |";
  }
  function tables(turndownService2) {
    turndownService2.keep(function(node) {
      return node.nodeName === "TABLE" && !isHeadingRow(node.rows[0]);
    });
    for (var key2 in rules2)
      turndownService2.addRule(key2, rules2[key2]);
  }
  function taskListItems(turndownService2) {
    turndownService2.addRule("taskListItems", {
      filter: function(node) {
        return node.type === "checkbox" && node.parentNode.nodeName === "LI";
      },
      replacement: function(content, node) {
        return (node.checked ? "[x]" : "[ ]") + " ";
      }
    });
  }
  function gfm(turndownService2) {
    turndownService2.use([
      highlightedCodeBlock,
      strikethrough,
      tables,
      taskListItems
    ]);
  }

  // src/process-markdown.ts
  var turndownService = new turndown_browser_es_default({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*"
  });
  turndownService.use(gfm);
  function majaxScriptBlockType(node) {
    if (node.nodeName !== "SCRIPT")
      return null;
    const a = node.getAttribute("type");
    if (!a || a.indexOf("math/tex") < 0)
      return null;
    return a.indexOf("display") >= 0 ? "block" : "inline";
  }
  turndownService.addRule("mathjax2Rendered", {
    filter: function(node) {
      return node.nodeName === "SPAN" && node.getAttribute("class") === "MathJax";
    },
    replacement: () => ""
  });
  turndownService.addRule("mathjax2ScriptInline", {
    filter: function(node) {
      return majaxScriptBlockType(node) === "inline";
    },
    escapeContent: function() {
      return false;
    },
    replacement: function(content, node, options) {
      return "$" + content + "$";
    }
  });
  turndownService.addRule("validMathjax", {
    filter: function(node) {
      return node.classList.contains("__mjx-turndown") || majaxScriptBlockType(node) === "block";
    },
    escapeContent: function() {
      return false;
    },
    replacement: function(content, node, options) {
      return "$$\n" + content + "\n$$";
    }
  });
  function processMarkdown(htmlString) {
    const markdownBody = turndownService.turndown(htmlString);
    return markdownBody;
  }

  // src/processor.ts
  function convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd2 = date.getDate().toString();
    var mmChars = mm.split("");
    var ddChars = dd2.split("");
    return yyyy + "-" + (mmChars[1] ? mm : "0" + mmChars[0]) + "-" + (ddChars[1] ? dd2 : "0" + ddChars[0]);
  }
  function getSelectionHtml() {
    var html5 = "";
    if (typeof window.getSelection != "undefined") {
      var sel = window.getSelection();
      if (sel.rangeCount) {
        var container = document.createElement("div");
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html5 = container.innerHTML;
      }
    } else if (typeof document.selection != "undefined") {
      if (document.selection.type == "Text") {
        html5 = document.selection.createRange().htmlText;
      }
    }
    return html5;
  }
  async function process2(dom) {
    const vault = "";
    const folder = "Clippings/";
    let tags = ["clippings"];
    const meta = {
      title: document.querySelector(`meta[property="og:title"]`)?.getAttribute("content") || document.title,
      source: document.querySelector(`meta[property="og:url"]`)?.getAttribute("content") || document.URL,
      clipped: convertDate(/* @__PURE__ */ new Date()),
      topics: ""
    };
    const metaSelectors = {
      "description": { qs: `meta[name="description"]`, attr: "content" },
      "subtitle": { qs: `meta[property="og:description"]`, attr: "content" },
      "published": { qs: `meta[property="article:published_time"]`, attr: "content" },
      "modified": { qs: `meta[property="article:modified_time"]`, attr: "content" },
      "author": { qs: 'meta[property="author"]', attr: "content" },
      "tags": { qs: `meta[name="parsely-tags"]`, attr: "content", deli: "," }
    };
    for (const [key2, info] of Object.entries(metaSelectors)) {
      const el = document.querySelector(info.qs);
      if (el === null)
        continue;
      let value = "attr" in info ? el.getAttribute(info.attr) : el.textContent;
      if ("deli" in info)
        value = value.split(info.deli);
      if (Array.isArray(meta[key2])) {
        meta[key2].push(...Array.isArray(value) ? value : [value]);
      } else {
        meta[key2] ??= value;
      }
    }
    meta.tags ??= [];
    if (Array.isArray(meta.tags))
      meta.tags.push("clippings");
    const content = await processHTML(dom);
    const selection = getSelectionHtml();
    const markdownify = selection || content;
    let vaultName = vault ? "&vault=" + encodeURIComponent(`${vault}`) : "";
    const markdownBody = processMarkdown(markdownify);
    const fileContent = "---\n" + Object.entries(meta).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(",")}]` : v}`).join("\n") + "\n---\n\n" + markdownBody;
  }

  // src/content.ts
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      process2(document.documentElement.cloneNode(true));
    }
  );
})();
