(() => {
  const projectPath = '/Nass10000/';
  const replacements = new Map([
    ['30+', '70+'],
    ['Ciencia de Datos (en curso)', 'Ciencia de Datos (completado)']
  ]);

  function applyTextChanges(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement?.tagName)) continue;
      const current = node.nodeValue || '';
      let updated = current;
      for (const [from, to] of replacements) {
        updated = updated.split(from).join(to);
      }
      if (updated !== current) node.nodeValue = updated;
    }
  }

  function removeManusBadge() {
    const elements = [...document.querySelectorAll('body *')];
    for (const element of elements) {
      const text = (element.textContent || '').trim().toLowerCase();
      if (text !== 'made with manus' && text !== 'create with manus' && text !== 'created with manus') continue;

      let target = element.closest('a, button') || element;
      let parent = target.parentElement;

      while (parent && parent !== document.body) {
        const parentText = (parent.textContent || '').trim().toLowerCase();
        const style = window.getComputedStyle(parent);
        if (
          style.position === 'fixed' ||
          style.position === 'sticky' ||
          parentText === 'made with manus' ||
          parentText === 'create with manus' ||
          parentText === 'created with manus'
        ) {
          target = parent;
          break;
        }
        parent = parent.parentElement;
      }

      target.style.setProperty('display', 'none', 'important');
      target.setAttribute('aria-hidden', 'true');
    }
  }

  function restoreProjectUrl() {
    if (!window.__PORTFOLIO_PROJECT_PATH__) return;
    if (window.location.pathname !== '/') return;
    window.history.replaceState(
      window.history.state,
      '',
      projectPath + window.location.search + window.location.hash
    );
  }

  function applyEverything() {
    applyTextChanges();
    removeManusBadge();
  }

  function start() {
    applyEverything();

    const observer = new MutationObserver(applyEverything);
    observer.observe(document.body, { childList: true, subtree: true });

    window.setTimeout(restoreProjectUrl, 1200);
    window.setTimeout(applyEverything, 1600);
    window.setTimeout(() => observer.disconnect(), 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();