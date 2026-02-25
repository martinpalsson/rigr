/**
 * RST inline markup parser
 *
 * Parses inline markup within text: bold, italic, inline code, roles, hyperlinks.
 */

import { InlineNode } from './rstNodes';

/**
 * Parse a text string into an array of inline nodes.
 */
export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let pos = 0;
  const len = text.length;

  while (pos < len) {
    // Try each inline pattern in order of priority

    // Escaped character: \*  \`  \\
    if (text[pos] === '\\' && pos + 1 < len) {
      const next = text[pos + 1];
      if ('*`\\|:'.includes(next)) {
        // Flush any pending text would be handled by the text accumulation
        nodes.push({ type: 'text', value: next });
        pos += 2;
        continue;
      }
    }

    // Inline literal: ``text``
    if (text[pos] === '`' && pos + 1 < len && text[pos + 1] === '`') {
      const end = text.indexOf('``', pos + 2);
      if (end !== -1) {
        nodes.push({ type: 'inline_code', value: text.slice(pos + 2, end) });
        pos = end + 2;
        continue;
      }
    }

    // Interpreted text role: :rolename:`content`
    if (text[pos] === ':') {
      const roleMatch = text.slice(pos).match(/^:([a-zA-Z_][a-zA-Z0-9_-]*):`([^`]+)`/);
      if (roleMatch) {
        nodes.push({ type: 'role', name: roleMatch[1], target: roleMatch[2] });
        pos += roleMatch[0].length;
        continue;
      }
    }

    // Strong emphasis: **text**
    if (text[pos] === '*' && pos + 1 < len && text[pos + 1] === '*') {
      const end = text.indexOf('**', pos + 2);
      if (end !== -1) {
        const inner = text.slice(pos + 2, end);
        nodes.push({ type: 'strong', children: parseInline(inner) });
        pos = end + 2;
        continue;
      }
    }

    // Emphasis: *text*  (but not ** which is strong)
    if (text[pos] === '*' && !(pos + 1 < len && text[pos + 1] === '*')) {
      // Find closing * that is not part of **
      let end = pos + 1;
      while (end < len) {
        if (text[end] === '*' && !(end + 1 < len && text[end + 1] === '*')) {
          break;
        }
        end++;
      }
      if (end < len) {
        const inner = text.slice(pos + 1, end);
        if (inner.length > 0) {
          nodes.push({ type: 'emphasis', children: parseInline(inner) });
          pos = end + 1;
          continue;
        }
      }
    }

    // Hyperlink: `text <url>`_
    if (text[pos] === '`') {
      const hyperlinkMatch = text.slice(pos).match(/^`([^<]+)<([^>]+)>`_/);
      if (hyperlinkMatch) {
        nodes.push({
          type: 'hyperlink',
          text: hyperlinkMatch[1].trim(),
          uri: hyperlinkMatch[2].trim(),
        });
        pos += hyperlinkMatch[0].length;
        continue;
      }
    }

    // Plain text: accumulate characters until next special character
    let textEnd = pos + 1;
    while (textEnd < len) {
      const ch = text[textEnd];
      if (ch === '*' || ch === '`' || ch === ':' || ch === '\\') {
        break;
      }
      textEnd++;
    }

    const textContent = text.slice(pos, textEnd);
    // Merge with previous text node if possible
    if (nodes.length > 0 && nodes[nodes.length - 1].type === 'text') {
      (nodes[nodes.length - 1] as { type: 'text'; value: string }).value += textContent;
    } else {
      nodes.push({ type: 'text', value: textContent });
    }
    pos = textEnd;
  }

  return nodes;
}

/**
 * Convert inline nodes to plain text (stripping markup).
 */
export function inlineToPlainText(nodes: InlineNode[]): string {
  return nodes.map(node => {
    switch (node.type) {
      case 'text': return node.value;
      case 'strong': return inlineToPlainText(node.children);
      case 'emphasis': return inlineToPlainText(node.children);
      case 'inline_code': return node.value;
      case 'role': return node.target;
      case 'hyperlink': return node.text;
    }
  }).join('');
}
