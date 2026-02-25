/**
 * RST Abstract Syntax Tree node types
 *
 * Defines the complete set of node types produced by rstFullParser
 * and consumed by htmlEmitter.
 */

// ---------------------------------------------------------------------------
// Inline nodes
// ---------------------------------------------------------------------------

export interface TextNode {
  type: 'text';
  value: string;
}

export interface StrongNode {
  type: 'strong';
  children: InlineNode[];
}

export interface EmphasisNode {
  type: 'emphasis';
  children: InlineNode[];
}

export interface InlineCodeNode {
  type: 'inline_code';
  value: string;
}

export interface RoleNode {
  type: 'role';
  name: string;    // e.g. 'item', 'paramval', 'termref', 'ref'
  target: string;  // the content inside backticks
}

export interface HyperlinkNode {
  type: 'hyperlink';
  text: string;
  uri: string;
}

export type InlineNode =
  | TextNode
  | StrongNode
  | EmphasisNode
  | InlineCodeNode
  | RoleNode
  | HyperlinkNode;

// ---------------------------------------------------------------------------
// Block nodes
// ---------------------------------------------------------------------------

export interface SectionNode {
  type: 'section';
  depth: number;         // 1-based heading level
  title: string;         // raw title text
  titleInline: InlineNode[];  // parsed inline markup in title
  children: BlockNode[];
  id?: string;           // auto-generated anchor id
}

export interface ParagraphNode {
  type: 'paragraph';
  children: InlineNode[];
}

export interface BulletListNode {
  type: 'bullet_list';
  items: ListItemNode[];
}

export interface EnumListNode {
  type: 'enum_list';
  items: ListItemNode[];
  start?: number;
}

export interface ListItemNode {
  type: 'list_item';
  children: BlockNode[];
}

export interface DefinitionListNode {
  type: 'definition_list';
  items: DefinitionItemNode[];
}

export interface DefinitionItemNode {
  type: 'definition_item';
  term: InlineNode[];
  definition: BlockNode[];
}

export interface CodeBlockNode {
  type: 'code_block';
  language: string;
  code: string;
  caption?: string;
}

export interface LiteralBlockNode {
  type: 'literal_block';
  content: string;
}

export interface BlockQuoteNode {
  type: 'block_quote';
  children: BlockNode[];
}

export interface ImageNode {
  type: 'image';
  uri: string;
  alt?: string;
  scale?: string;
  width?: string;
  height?: string;
}

export interface AdmonitionNode {
  type: 'admonition';
  kind: string;          // 'note', 'warning', 'tip', 'important', 'caution', 'danger'
  title?: string;
  children: BlockNode[];
}

export interface ToctreeNode {
  type: 'toctree';
  entries: string[];     // file paths (without .rst extension)
  maxdepth?: number;
  caption?: string;
}

export interface TransitionNode {
  type: 'transition';
}

export interface CommentNode {
  type: 'comment';
  text: string;
}

export interface FieldListNode {
  type: 'field_list';
  fields: FieldNode[];
}

export interface FieldNode {
  type: 'field';
  name: string;
  body: InlineNode[];
}

export interface TableNode {
  type: 'table';
  headers: TableCellNode[][];
  rows: TableCellNode[][];
}

export interface TableCellNode {
  type: 'table_cell';
  children: InlineNode[];
}

export interface RawHtmlNode {
  type: 'raw_html';
  content: string;
}

// ---------------------------------------------------------------------------
// Rigr custom directive nodes
// ---------------------------------------------------------------------------

export interface ItemDirectiveNode {
  type: 'item_directive';
  title: string;
  id: string;
  itemType: string;
  level: string;
  status: string;
  options: Record<string, string>;  // all directive options
  content: string[];                // raw RST content lines
  contentNodes: BlockNode[];        // parsed content
}

export interface GraphicDirectiveNode {
  type: 'graphic_directive';
  title: string;
  id: string;
  level: string;
  status: string;
  file: string;
  alt: string;
  scale: string;
  caption: string;
  options: Record<string, string>;
  content: string[];                // PlantUML source lines or other content
  contentNodes: BlockNode[];
}

export interface ListingDirectiveNode {
  type: 'listing_directive';
  title: string;
  id: string;
  level: string;
  status: string;
  language: string;
  caption: string;
  options: Record<string, string>;
  code: string;
}

// ---------------------------------------------------------------------------
// Generic directive (for unknown directives)
// ---------------------------------------------------------------------------

export interface GenericDirectiveNode {
  type: 'generic_directive';
  name: string;
  argument: string;
  options: Record<string, string>;
  content: string[];
}

// ---------------------------------------------------------------------------
// Union types
// ---------------------------------------------------------------------------

export type BlockNode =
  | SectionNode
  | ParagraphNode
  | BulletListNode
  | EnumListNode
  | DefinitionListNode
  | CodeBlockNode
  | LiteralBlockNode
  | BlockQuoteNode
  | ImageNode
  | AdmonitionNode
  | ToctreeNode
  | TransitionNode
  | CommentNode
  | FieldListNode
  | TableNode
  | RawHtmlNode
  | ItemDirectiveNode
  | GraphicDirectiveNode
  | ListingDirectiveNode
  | GenericDirectiveNode;

export type RstNode = BlockNode | InlineNode;

// ---------------------------------------------------------------------------
// Document root
// ---------------------------------------------------------------------------

export interface RstDocument {
  children: BlockNode[];
  title?: string;       // document title (first section title)
}
