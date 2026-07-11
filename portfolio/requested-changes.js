(() => {
  const replacements = new Map([
    ['30+', '70+'],
    ['Ciencia de Datos (en curso)', 'Ciencia de Datos (completado)'],
    [
      'Desarrollador Web Full Stack enfocado en backend, especializado en NestJS, PostgreSQL y TypeORM. En formación activa en Ciencia de Datos con competencias en Power BI, ETL y Data Warehousing.',
      'Desarrollador Web Full Stack enfocado en backend y Científico de Datos certificado, especializado en NestJS, PostgreSQL y TypeORM, con competencias en Power BI, ETL, Data Warehousing y análisis de datos.'
    ]
  ]);

  const cloudModuleText = 'Fundamentos de nube y ciencia de datos de producción';

  function markCloudModuleComplete() {
    const textNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    for (const node of textNodes) {
      if ((node.nodeValue || '').trim() !== cloudModuleText) continue;

      let container = node.parentElement;
      for (let level = 0; level < 5 && container; level += 1) {
        const text = container.textContent || '';
        if (text.includes(cloudModuleText) && text.includes('○')) {
          const innerWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
          while (innerWalker.nextNode()) {
            const innerNode = innerWalker.currentNode;
            if ((innerNode.nodeValue || '').includes('○')) {
              innerNode.nodeValue = innerNode.nodeValue.replace('○', '✓');
              return;
            }
          }
        }
        container = container.parentElement;
      }
    }
  }

  function removeManusBadge() {
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

  function update(root = document.body) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement?.tagName)) continue;

      let value = node.nodeValue || '';
      for (const [from, to] of replacements) {
        value = value.split(from).join(to);
      }
      node.nodeValue = value;
    }

    markCloudModuleComplete();
    removeManusBadge();
  }

  function start() {
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
