(() => {
  const replacements = new Map([
    ['30+', '70+'],
    ['Ciencia de Datos (en curso)', 'Ciencia de Datos (completado)']
  ]);

  function apply(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const current = node.nodeValue || '';
      let updated = current;
      for (const [from, to] of replacements) {
        updated = updated.split(from).join(to);
      }
      if (updated !== current) node.nodeValue = updated;
    }
  }

  function start() {
    apply();
    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();