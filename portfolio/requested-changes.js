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
      const current = node.nodeValue || '';
      let updated = current;
      for (const [from, to] of replacements) {
        updated = updated.split(from).join(to);
      }
      if (updated !== current) node.nodeValue = updated;
    }
  }

  function findGoHomeControl() {
    return [...document.querySelectorAll('a, button')].find(element =>
      (element.textContent || '').trim().toLowerCase() === 'go home'
    );
  }

  let routeCorrected = false;

  function correctInitialRoute() {
    if (routeCorrected) return;
    if (!window.location.pathname.startsWith(projectPath)) return;

    const goHome = findGoHomeControl();
    if (!goHome) return;

    routeCorrected = true;
    goHome.click();

    window.setTimeout(() => {
      window.history.replaceState(
        window.history.state,
        '',
        projectPath + window.location.hash
      );
    }, 500);
  }

  function applyEverything() {
    applyTextChanges();
    correctInitialRoute();
  }

  function start() {
    applyEverything();
    const observer = new MutationObserver(applyEverything);
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 20000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
