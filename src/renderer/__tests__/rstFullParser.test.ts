import { parseRstDocument } from '../rstFullParser';

describe('rstFullParser', () => {
  describe('sections', () => {
    it('should parse a single section', () => {
      const doc = parseRstDocument('Title\n=====\n\nSome text.');
      expect(doc.title).toBe('Title');
      expect(doc.children).toHaveLength(1);

      const section = doc.children[0];
      expect(section.type).toBe('section');
      if (section.type === 'section') {
        expect(section.title).toBe('Title');
        expect(section.depth).toBe(1);
        expect(section.children).toHaveLength(1);
        expect(section.children[0].type).toBe('paragraph');
      }
    });

    it('should parse nested sections', () => {
      const rst = [
        'Chapter',
        '=======',
        '',
        'Intro text.',
        '',
        'Section',
        '-------',
        '',
        'Section text.',
      ].join('\n');

      const doc = parseRstDocument(rst);
      expect(doc.title).toBe('Chapter');
      const chapter = doc.children[0];
      if (chapter.type === 'section') {
        expect(chapter.depth).toBe(1);
        // Should contain the intro paragraph and the subsection
        const subsections = chapter.children.filter(n => n.type === 'section');
        expect(subsections.length).toBe(1);
        if (subsections[0].type === 'section') {
          expect(subsections[0].depth).toBe(2);
          expect(subsections[0].title).toBe('Section');
        }
      }
    });
  });

  describe('paragraphs', () => {
    it('should parse a simple paragraph', () => {
      const doc = parseRstDocument('This is a paragraph.');
      expect(doc.children).toHaveLength(1);
      expect(doc.children[0].type).toBe('paragraph');
    });

    it('should parse multiple paragraphs separated by blank lines', () => {
      const doc = parseRstDocument('First paragraph.\n\nSecond paragraph.');
      expect(doc.children).toHaveLength(2);
      expect(doc.children[0].type).toBe('paragraph');
      expect(doc.children[1].type).toBe('paragraph');
    });
  });

  describe('bullet lists', () => {
    it('should parse a bullet list', () => {
      const rst = '- Item one\n- Item two\n- Item three';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const list = doc.children[0];
      expect(list.type).toBe('bullet_list');
      if (list.type === 'bullet_list') {
        expect(list.items).toHaveLength(3);
      }
    });

    it('should parse bullet list with * marker', () => {
      const rst = '* First\n* Second';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);
      expect(doc.children[0].type).toBe('bullet_list');
    });
  });

  describe('enumerated lists', () => {
    it('should parse a numbered list', () => {
      const rst = '1. First\n2. Second\n3. Third';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const list = doc.children[0];
      expect(list.type).toBe('enum_list');
      if (list.type === 'enum_list') {
        expect(list.items).toHaveLength(3);
      }
    });

    it('should parse auto-numbered list (#.)', () => {
      const rst = '#. First\n#. Second';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);
      expect(doc.children[0].type).toBe('enum_list');
    });
  });

  describe('code blocks', () => {
    it('should parse code-block directive', () => {
      const rst = '.. code-block:: python\n\n   def hello():\n       print("hi")';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const code = doc.children[0];
      expect(code.type).toBe('code_block');
      if (code.type === 'code_block') {
        expect(code.language).toBe('python');
        expect(code.code).toContain('def hello()');
      }
    });

    it('should parse literal block (::)', () => {
      const rst = 'Example::\n\n   some code\n   more code';
      const doc = parseRstDocument(rst);
      // Should produce a paragraph (with "Example") and a literal block
      const literals = doc.children.filter(n => n.type === 'literal_block');
      expect(literals.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('images', () => {
    it('should parse image directive', () => {
      const rst = '.. image:: path/to/image.png\n   :alt: My Image\n   :scale: 50';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const img = doc.children[0];
      expect(img.type).toBe('image');
      if (img.type === 'image') {
        expect(img.uri).toBe('path/to/image.png');
        expect(img.alt).toBe('My Image');
        expect(img.scale).toBe('50');
      }
    });
  });

  describe('admonitions', () => {
    it('should parse a note admonition', () => {
      const rst = '.. note::\n\n   This is a note.';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const adm = doc.children[0];
      expect(adm.type).toBe('admonition');
      if (adm.type === 'admonition') {
        expect(adm.kind).toBe('note');
        expect(adm.children.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should parse a warning admonition', () => {
      const rst = '.. warning::\n\n   Be careful!';
      const doc = parseRstDocument(rst);
      const adm = doc.children[0];
      expect(adm.type).toBe('admonition');
      if (adm.type === 'admonition') {
        expect(adm.kind).toBe('warning');
      }
    });
  });

  describe('toctree', () => {
    it('should parse a toctree directive', () => {
      const rst = '.. toctree::\n   :maxdepth: 2\n   :caption: Contents\n\n   intro\n   chapter1\n   chapter2';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const toc = doc.children[0];
      expect(toc.type).toBe('toctree');
      if (toc.type === 'toctree') {
        expect(toc.entries).toEqual(['intro', 'chapter1', 'chapter2']);
        expect(toc.caption).toBe('Contents');
        expect(toc.maxdepth).toBe(2);
      }
    });
  });

  describe('transitions', () => {
    it('should parse a transition', () => {
      const rst = 'Before.\n\n----\n\nAfter.';
      const doc = parseRstDocument(rst);
      const transitions = doc.children.filter(n => n.type === 'transition');
      expect(transitions.length).toBe(1);
    });
  });

  describe('comments', () => {
    it('should parse a comment', () => {
      const rst = '.. This is a comment';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);
      expect(doc.children[0].type).toBe('comment');
    });
  });

  describe('field lists', () => {
    it('should parse a field list', () => {
      const rst = ':Author: John Doe\n:Version: 1.0';
      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const fl = doc.children[0];
      expect(fl.type).toBe('field_list');
      if (fl.type === 'field_list') {
        expect(fl.fields).toHaveLength(2);
        expect(fl.fields[0].name).toBe('Author');
        expect(fl.fields[1].name).toBe('Version');
      }
    });
  });

  describe('tables', () => {
    it('should parse a simple RST table', () => {
      const rst = [
        '=====  =====',
        'Col 1  Col 2',
        '=====  =====',
        'A      B',
        'C      D',
        '=====  =====',
      ].join('\n');

      const doc = parseRstDocument(rst);
      const tables = doc.children.filter(n => n.type === 'table');
      expect(tables.length).toBe(1);
      if (tables[0].type === 'table') {
        expect(tables[0].headers.length).toBeGreaterThanOrEqual(1);
        expect(tables[0].rows.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Precept directives', () => {
    it('should parse an item directive', () => {
      const rst = [
        '.. item:: My Requirement',
        '   :id: REQ-001',
        '   :type: requirement',
        '   :status: draft',
        '',
        '   This is the requirement description.',
      ].join('\n');

      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const item = doc.children[0];
      expect(item.type).toBe('item_directive');
      if (item.type === 'item_directive') {
        expect(item.title).toBe('My Requirement');
        expect(item.id).toBe('REQ-001');
        expect(item.itemType).toBe('requirement');
        expect(item.status).toBe('draft');
        expect(item.contentNodes.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should parse a graphic directive', () => {
      const rst = [
        '.. graphic:: Architecture Diagram',
        '   :id: FIG-001',
        '   :status: draft',
        '   :file: images/arch.png',
        '   :alt: Architecture overview',
      ].join('\n');

      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const graphic = doc.children[0];
      expect(graphic.type).toBe('graphic_directive');
      if (graphic.type === 'graphic_directive') {
        expect(graphic.title).toBe('Architecture Diagram');
        expect(graphic.id).toBe('FIG-001');
        expect(graphic.file).toBe('images/arch.png');
      }
    });

    it('should parse a listing directive', () => {
      const rst = [
        '.. listing:: Example Code',
        '   :id: CODE-001',
        '   :status: draft',
        '   :language: python',
        '',
        '   def hello():',
        '       print("world")',
      ].join('\n');

      const doc = parseRstDocument(rst);
      expect(doc.children).toHaveLength(1);

      const listing = doc.children[0];
      expect(listing.type).toBe('listing_directive');
      if (listing.type === 'listing_directive') {
        expect(listing.title).toBe('Example Code');
        expect(listing.id).toBe('CODE-001');
        expect(listing.language).toBe('python');
        expect(listing.code).toContain('def hello()');
      }
    });

    it('should parse item directive with link options', () => {
      const rst = [
        '.. item:: Sub Requirement',
        '   :id: REQ-002',
        '   :type: requirement',
        '   :status: draft',
        '   :satisfies: REQ-001',
        '',
        '   This satisfies REQ-001.',
      ].join('\n');

      const doc = parseRstDocument(rst);
      const item = doc.children[0];
      if (item.type === 'item_directive') {
        expect(item.options.satisfies).toBe('REQ-001');
      }
    });
  });

  describe('definition lists', () => {
    it('should handle definition-like text (parsed as paragraphs currently)', () => {
      // Definition lists are not yet fully supported by the parser;
      // the term + indented definition is merged into a paragraph.
      const rst = 'Term 1\n   Definition of term 1.\n\nTerm 2\n   Definition of term 2.';
      const doc = parseRstDocument(rst);
      // Should produce some nodes (paragraphs in current implementation)
      expect(doc.children.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('block quotes', () => {
    it('should parse indented text as block quote', () => {
      const rst = 'Normal text.\n\n   This is quoted.';
      const doc = parseRstDocument(rst);
      const quotes = doc.children.filter(n => n.type === 'block_quote');
      expect(quotes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('document title', () => {
    it('should extract document title from first section', () => {
      const rst = 'My Document\n===========\n\nContent here.';
      const doc = parseRstDocument(rst);
      expect(doc.title).toBe('My Document');
    });

    it('should return undefined title for document without sections', () => {
      const doc = parseRstDocument('Just a paragraph.');
      expect(doc.title).toBeUndefined();
    });
  });
});
