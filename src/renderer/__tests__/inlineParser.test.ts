import { parseInline, inlineToPlainText } from '../inlineParser';

describe('inlineParser', () => {
  describe('parseInline', () => {
    it('should parse plain text', () => {
      const nodes = parseInline('Hello world');
      expect(nodes).toEqual([{ type: 'text', value: 'Hello world' }]);
    });

    it('should parse strong emphasis (**bold**)', () => {
      const nodes = parseInline('This is **bold** text');
      expect(nodes).toHaveLength(3);
      expect(nodes[0]).toEqual({ type: 'text', value: 'This is ' });
      expect(nodes[1]).toEqual({
        type: 'strong',
        children: [{ type: 'text', value: 'bold' }],
      });
      expect(nodes[2]).toEqual({ type: 'text', value: ' text' });
    });

    it('should parse emphasis (*italic*)', () => {
      const nodes = parseInline('This is *italic* text');
      expect(nodes).toHaveLength(3);
      expect(nodes[0]).toEqual({ type: 'text', value: 'This is ' });
      expect(nodes[1]).toEqual({
        type: 'emphasis',
        children: [{ type: 'text', value: 'italic' }],
      });
      expect(nodes[2]).toEqual({ type: 'text', value: ' text' });
    });

    it('should parse inline code (``code``)', () => {
      const nodes = parseInline('Use ``foo()`` here');
      expect(nodes).toHaveLength(3);
      expect(nodes[0]).toEqual({ type: 'text', value: 'Use ' });
      expect(nodes[1]).toEqual({ type: 'inline_code', value: 'foo()' });
      expect(nodes[2]).toEqual({ type: 'text', value: ' here' });
    });

    it('should parse roles (:name:`target`)', () => {
      const nodes = parseInline('See :item:`REQ-001`');
      expect(nodes).toHaveLength(2);
      expect(nodes[0]).toEqual({ type: 'text', value: 'See ' });
      expect(nodes[1]).toEqual({ type: 'role', name: 'item', target: 'REQ-001' });
    });

    it('should parse paramval role', () => {
      const nodes = parseInline(':paramval:`PARAM-001`');
      expect(nodes).toEqual([
        { type: 'role', name: 'paramval', target: 'PARAM-001' },
      ]);
    });

    it('should parse termref role', () => {
      const nodes = parseInline(':termref:`TERM-001`');
      expect(nodes).toEqual([
        { type: 'role', name: 'termref', target: 'TERM-001' },
      ]);
    });

    it('should parse hyperlinks (`text <url>`_)', () => {
      const nodes = parseInline('Visit `Google <https://google.com>`_ for info');
      expect(nodes).toHaveLength(3);
      expect(nodes[0]).toEqual({ type: 'text', value: 'Visit ' });
      expect(nodes[1]).toEqual({
        type: 'hyperlink',
        text: 'Google',
        uri: 'https://google.com',
      });
      expect(nodes[2]).toEqual({ type: 'text', value: ' for info' });
    });

    it('should handle escaped characters', () => {
      const nodes = parseInline('Use \\* for bullets');
      // "Use " is accumulated as text, then \* produces "*" text node,
      // then " for bullets" is accumulated — the parser merges adjacent text nodes.
      const plainText = nodes.map(n => n.type === 'text' ? n.value : '').join('');
      expect(plainText).toBe('Use * for bullets');
      // Should not produce emphasis
      expect(nodes.every(n => n.type === 'text')).toBe(true);
    });

    it('should handle multiple inline elements', () => {
      const nodes = parseInline('**bold** and *italic* and ``code``');
      expect(nodes).toHaveLength(5);
      expect(nodes[0].type).toBe('strong');
      expect(nodes[1]).toEqual({ type: 'text', value: ' and ' });
      expect(nodes[2].type).toBe('emphasis');
      expect(nodes[3]).toEqual({ type: 'text', value: ' and ' });
      expect(nodes[4].type).toBe('inline_code');
    });

    it('should handle empty input', () => {
      const nodes = parseInline('');
      expect(nodes).toEqual([]);
    });
  });

  describe('inlineToPlainText', () => {
    it('should strip markup from text', () => {
      const nodes = parseInline('**bold** and *italic* and ``code``');
      expect(inlineToPlainText(nodes)).toBe('bold and italic and code');
    });

    it('should handle roles', () => {
      const nodes = parseInline('See :item:`REQ-001`');
      expect(inlineToPlainText(nodes)).toBe('See REQ-001');
    });

    it('should handle hyperlinks', () => {
      const nodes = parseInline('Visit `Google <https://google.com>`_');
      expect(inlineToPlainText(nodes)).toBe('Visit Google');
    });
  });
});
