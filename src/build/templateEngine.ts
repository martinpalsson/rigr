/**
 * HTML page template engine for static builds
 *
 * Wraps rendered RST body content in a full HTML page with navigation,
 * sidebar, and asset references.
 */

import { TocEntry, flattenTocTree } from '../renderer/tocBuilder';

export interface PageTemplateContext {
  title: string;
  bodyHtml: string;
  currentSlug: string;
  tocEntries: TocEntry[];
  prevSlug: string | null;
  nextSlug: string | null;
  projectName: string;
  cssPath: string;
  jsPath: string;
  /** Relative prefix to reach root from current page (e.g. "../../" for nested pages) */
  pathPrefix?: string;
}

/**
 * Render a full HTML page from body content and navigation context.
 */
export function renderPage(ctx: PageTemplateContext): string {
  const prefix = ctx.pathPrefix || '';
  const sidebar = renderSidebar(ctx.tocEntries, ctx.currentSlug, prefix);
  const navHtml = renderNavigation(ctx.prevSlug, ctx.nextSlug, prefix);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(ctx.title)} &mdash; ${escapeHtml(ctx.projectName)}</title>
  <link rel="stylesheet" href="${escapeAttr(ctx.cssPath)}">
</head>
<body>
<div class="precept-page">
  <nav class="precept-sidebar">
    <div class="precept-sidebar-header">
      <h2>${escapeHtml(ctx.projectName)}</h2>
    </div>
    ${sidebar}
  </nav>
  <main class="precept-main">
    ${ctx.bodyHtml}
    ${navHtml}
  </main>
</div>
<script src="${escapeAttr(ctx.jsPath)}"></script>
</body>
</html>`;
}

function renderSidebar(entries: TocEntry[], currentSlug: string, pathPrefix: string): string {
  const flat = flattenTocTree(entries);
  if (flat.length === 0) return '';

  const items = flat.map(item => {
    const active = item.slug === currentSlug ? ' class="active"' : '';
    const indent = `padding-left: ${0.75 + item.depth * 1}em`;
    return `<li${active}><a href="${escapeAttr(pathPrefix + item.slug)}.html" style="${indent}">${escapeHtml(item.title)}</a></li>`;
  });

  return `<ul class="precept-nav">\n${items.join('\n')}\n</ul>`;
}

function renderNavigation(prevSlug: string | null, nextSlug: string | null, pathPrefix: string): string {
  if (!prevSlug && !nextSlug) return '';

  const parts: string[] = ['<nav class="precept-page-nav">'];
  if (prevSlug) {
    parts.push(`<a class="precept-nav-prev" href="${escapeAttr(pathPrefix + prevSlug)}.html">&laquo; Previous</a>`);
  }
  if (nextSlug) {
    parts.push(`<a class="precept-nav-next" href="${escapeAttr(pathPrefix + nextSlug)}.html">Next &raquo;</a>`);
  }
  parts.push('</nav>');
  return parts.join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * CSS for static HTML builds (page layout: sidebar + main).
 */
export const STATIC_PAGE_CSS = `
/* Page layout */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--precept-text-primary);
  background: var(--precept-page-bg);
}

a { color: var(--precept-link-color); text-decoration: none; }
a:hover { color: var(--precept-link-hover); text-decoration: underline; }

.precept-page {
  display: flex;
  min-height: 100vh;
}

.precept-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--precept-sidebar-bg);
  border-right: 1px solid var(--precept-sidebar-border);
  padding: 1em 0;
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100vh;
}

.precept-sidebar-header {
  padding: 0 1em 0.5em;
  border-bottom: 1px solid var(--precept-sidebar-border);
  margin-bottom: 0.5em;
  color: var(--precept-sidebar-text);
}

.precept-sidebar-header h2 {
  margin: 0;
  font-size: 1.1em;
  border-bottom: none;
  padding-bottom: 0;
}

.precept-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.precept-nav li a {
  display: block;
  padding: 0.35em 0.75em;
  color: var(--precept-sidebar-text);
  text-decoration: none;
  font-size: 0.9em;
}

.precept-nav li a:hover {
  background: var(--precept-sidebar-active-bg);
}

.precept-nav li.active a {
  background: var(--precept-sidebar-active-bg);
  color: var(--precept-sidebar-active-text);
  font-weight: 500;
}

.precept-main {
  flex: 1;
  padding: 1.5em 2em;
  max-width: 860px;
  background: var(--precept-page-bg);
}

.precept-page-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 2em;
  padding-top: 1em;
  border-top: 1px solid var(--precept-border-color);
}

.precept-page-nav a {
  color: var(--precept-link-color);
  text-decoration: none;
}

.precept-page-nav a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .precept-page { flex-direction: column; }
  .precept-sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--precept-sidebar-border);
  }
  .precept-main { max-width: 100%; }
}
`;
