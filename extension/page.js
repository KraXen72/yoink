(() => {
  // src/page.ts
  function patchNode(node, mObj) {
    if (node.dataset.originalMjx)
      return;
    node.dataset.originalMjx = encodeURIComponent(`${mObj.delim}${mObj.tex}${mObj.delim}`);
  }
  function processMathObj(m) {
    const mObj = {
      delim: m?.start?.delim ?? m?.end?.delim ?? "$$",
      tex: m.math
    };
    if (!["$", "$$"].includes(mObj.delim))
      mObj.delim = mObj.tex.includes("\n") ? "$$" : "$";
    patchNode(m.typesetRoot, mObj);
    return mObj;
  }
  function mjx3CollectPath(mathObj, collectedMathObj) {
    if (!mathObj && !collectedMathObj)
      return null;
    const acc = [];
    if (collectedMathObj) {
      for (const m of collectedMathObj) {
        acc.push(processMathObj(m));
      }
      console.log(acc);
      return acc;
    } else {
      let next = true;
      let current = mathObj;
      while (next) {
        if (current.data?.typesetRoot?.dataset?.originalMjx) {
          break;
        }
        if (current.data.toString() !== "Symbol()") {
          acc.push(processMathObj(current.data));
        }
        current = current.next;
      }
      return acc;
    }
  }
  if (!(globalThis.MathJax?.startup?.document?.math?.list || globalThis.MathJax?.startup?.document?.getMathItemsWithin)) {
    window.postMessage({ type: "mathjax3", status: 404, data: "mjx3: MathJax global not found" });
  } else {
    const collected = mjx3CollectPath(
      globalThis.MathJax?.startup?.document?.math?.list,
      globalThis.MathJax?.startup?.document?.getMathItemsWithin(document.documentElement)
    );
    window.postMessage({ type: "mathjax3", status: 200, data: { math: collected } });
  }
})();
