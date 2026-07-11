(() => {
  const replacements = new Map([
    ['30+', '70+'],
    ['Ciencia de Datos (en curso)', 'Ciencia de Datos (completado)']
  ]);

  function update(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement?.tagName)) continue;
      let value = node.nodeValue || '';
      for (const [from, to] of replacements) value = value.split(from).join(to);
      node.nodeValue = value;
    }

    for (const element of document.querySelectorAll('body *')) {
      const text = (element.textContent || '').trim().toLowerCase();
      if (!['made with manus', 'create with manus', 'created with manus'].includes(text)) continue;
      let target = element.closest('a,button') || element;
      while (target.parentElement && target.parentElement !== document.body) {
        const style = getComputedStyle(target.parentElement);
        if (style.position === 'fixed' || style.position === 'sticky') {
          target = target.parentElement;
          break;
        }
        target = target.parentElement;
      }
      target.style.setProperty('display', 'none', 'important');
    }
  }

  function start() {
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();