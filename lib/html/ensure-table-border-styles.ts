const TABLE_BORDER = '1px solid #666666';

/** Adds portable table borders to answer HTML before API submission. */
export function ensureTableBorderStyles(html: string): string {
  if (!html.includes('<table')) {
    return html;
  }

  if (typeof DOMParser === 'undefined') {
    return html;
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');

  doc.querySelectorAll('table').forEach((table) => {
    table.setAttribute('border', '1');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('style', 'border-collapse: collapse;');

    table.querySelectorAll('td, th').forEach((cell) => {
      cell.setAttribute('style', `border: ${TABLE_BORDER};`);
    });
  });

  return doc.body.innerHTML;
}
