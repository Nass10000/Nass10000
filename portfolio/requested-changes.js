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

  function normalize(value) {
    return (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function markCloudModuleComplete() {
    const expected = normalize(cloudModuleText);

    const candidates = [...document.querySelectorAll('body *')]
      .filter(element => normalize(element.textContent) === expected)
      .sort((a, b) => a.children.length - b.children.length);

    const title = candidates[0];
    if (!title) return;

    title.style.setProperty('text-decoration-line', 'line-through', 'important');
    title.style.setProperty('text-decoration-thickness', '2px', 'important');
    title.style.setProperty('opacity', '0.72', 'important');

    let row = title;
    for (let level = 0; level < 6 && row.parentElement; level += 1) {
      const parent = row.parentElement;
      const parentText = normalize(parent.textContent);
      if (parentText.includes(expected) && parentText.length < expected.length + 140) {
        row = parent;
      } else {
        break;
      }
    }

    row.setAttribute('data-cloud-module-completed', 'true');

    if (!row.querySelector('[data-cloud-check="true"]')) {
      const check = document.createElement('span');
      check.setAttribute('data-cloud-check', 'true');
      check.setAttribute('aria-label', 'Completado');
      check.textContent = '✓';
      check.style.setProperty('display', 'inline-flex', 'important');
      check.style.setProperty('align-items', 'center', 'important');
      check.style.setProperty('justify-content', 'center', 'important');
      check.style.setProperty('width', '22px', 'important');
      check.style.setProperty('height', '22px', 'important');
      check.style.setProperty('min-width', '22px', 'important');
      check.style.setProperty('border-radius', '9999px', 'important');
      check.style.setProperty('background', '#16a34a', 'important');
      check.style.setProperty('color', '#ffffff', 'important');
      check.style.setProperty('font-weight', '700', 'important');
      check.style.setProperty('font-size', '14px', 'important');
      check.style.setProperty('line-height', '1', 'important');
      check.style.setProperty('margin-right', '8px', 'important');

      const titleParent = title.parentElement;
      if (titleParent) {
        titleParent.style.setProperty('display', 'flex', 'important');
        titleParent.style.setProperty('align-items', 'center', 'important');
        titleParent.insertBefore(check, title);
      }
    }
  }

  function removeManusBadge() {
    for (const element of document.querySelectorAll('body *')) {
      const text = normalize(element.textContent);
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
