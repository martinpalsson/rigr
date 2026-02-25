/**
 * Renderer module barrel exports
 */

// AST node types
export * from './rstNodes';

// Parsers
export { parseRstDocument } from './rstFullParser';
export { parseInline, inlineToPlainText } from './inlineParser';

// HTML rendering
export { renderDocument, renderBlockNodes, renderInlineNodes } from './htmlEmitter';
export {
  renderItemDirective,
  renderGraphicDirective,
  renderListingDirective,
  highlightCode,
  escapeHtml,
  escapeAttr,
  type RenderContext,
} from './directiveRenderer';

// PlantUML
export {
  renderPlantUml,
  encodePlantUml,
  plantUmlFallbackHtml,
  type PlantUmlConfig,
} from './plantumlRenderer';

// Toctree
export {
  buildTocTree,
  getNavLinks,
  flattenTocTree,
  type TocTree,
  type TocEntry,
} from './tocBuilder';
