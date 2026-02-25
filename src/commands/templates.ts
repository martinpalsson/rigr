/**
 * Project templates for new RMS projects
 */

/**
 * Default rigr.json content for a new Rigr project
 */
export const RIGR_JSON_TEMPLATE = JSON.stringify({
  project: 'Requirements',
  version: '0.1',

  objectTypes: [
    { type: 'requirement', title: 'Requirement' },
    { type: 'specification', title: 'Specification' },
    { type: 'rationale', title: 'Rationale' },
    { type: 'information', title: 'Information' },
    { type: 'parameter', title: 'Parameter' },
    { type: 'term', title: 'Term' },
    { type: 'graphic', title: 'Graphic' },
    { type: 'code', title: 'Code' },
    { type: 'design_element', title: 'Design Element' },
  ],

  levels: [
    { level: 'stakeholder', title: 'Stakeholder' },
    { level: 'system', title: 'System' },
    { level: 'component', title: 'Component' },
    { level: 'software', title: 'Software' },
    { level: 'hardware', title: 'Hardware' },
  ],

  idConfig: {
    prefix: '',
    separator: '',
    padding: 4,
    start: 1,
  },

  linkTypes: [
    { option: 'satisfies', incoming: 'satisfied_by', outgoing: 'satisfies', style: '#0000AA' },
    { option: 'implements', incoming: 'implemented_by', outgoing: 'implements', style: '#00AA00' },
    { option: 'derives_from', incoming: 'derives_to', outgoing: 'derives_from' },
    { option: 'tests', incoming: 'tested_by', outgoing: 'tests', style: '#AA0000' },
    { option: 'links', incoming: 'linked_from', outgoing: 'links_to' },
    { option: 'depends_on', incoming: 'blocks', outgoing: 'depends_on' },
    { option: 'references', incoming: 'referenced_by', outgoing: 'references' },
  ],

  statuses: [
    { status: 'draft', color: '#FFEB3B' },
    { status: 'review', color: '#FF9800' },
    { status: 'approved', color: '#4CAF50' },
    { status: 'implemented', color: '#2196F3' },
    { status: 'verified', color: '#9C27B0' },
    { status: 'deprecated', color: '#9E9E9E' },
    { status: 'rejected', color: '#F44336' },
  ],

  defaultStatus: 'draft',

  extraOptions: ['author', 'version', 'baseline'],

  customFields: {
    product: [
      { value: 'widget-pro', title: 'Widget Pro' },
      { value: 'widget-lite', title: 'Widget Lite' },
      { value: 'platform', title: 'Platform Core' },
    ],
    priority: [
      { value: 'critical', title: 'Critical' },
      { value: 'high', title: 'High' },
      { value: 'medium', title: 'Medium' },
      { value: 'low', title: 'Low' },
    ],
    complexity: [
      { value: 'trivial', title: 'Trivial' },
      { value: 'simple', title: 'Simple' },
      { value: 'moderate', title: 'Moderate' },
      { value: 'complex', title: 'Complex' },
    ],
  },

  plantuml: {
    mode: 'local',
    command: 'plantuml',
    server: 'https://www.plantuml.com/plantuml/svg/',
  },
}, null, 2);

/**
 * Rigr CSS template for styling requirements
 */
export const RIGR_CSS_TEMPLATE = `/* =============================================================================
   Rigr Requirements Styling
   =============================================================================
   Theme-compatible styles for requirement items.
   All colours use var(--rigr-*) custom properties injected by the theme.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   Item Container
   ----------------------------------------------------------------------------- */
.rigr-item {
    border: 1px solid var(--rigr-border-color);
    border-radius: 4px;
    margin: 1.5em 0;
    background: var(--rigr-bg-light);
    overflow: hidden;
}

/* Type-specific left border accent */
.rigr-type-requirement {
    border-left: 4px solid #1976d2;
}

.rigr-type-specification {
    border-left: 4px solid #388e3c;
}

.rigr-type-rationale {
    border-left: 4px solid #f57c00;
}

.rigr-type-information {
    border-left: 4px solid #7b1fa2;
}

.rigr-type-parameter {
    border-left: 4px solid #0097a7;
}

.rigr-type-term {
    border-left: 4px solid #98D8AA;
}

.rigr-type-design_element {
    border-left: 4px solid #455a64;
}

/* -----------------------------------------------------------------------------
   Title (rubric element)
   ----------------------------------------------------------------------------- */
.rigr-item .rigr-title,
.rigr-graphic .rigr-title,
.rigr-code .rigr-title {
    margin: 0;
    padding: 0.5em 0.75em;
    background: var(--rigr-bg-header);
    border-bottom: 1px solid var(--rigr-border-color);
    font-size: 1.1em;
    font-weight: 600;
    color: var(--rigr-text-primary);
}

/* ID displayed in title */
.rigr-title-id {
    font-family: ui-monospace, 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-weight: 600;
    color: var(--rigr-id-color);
    background: var(--rigr-id-bg);
    padding: 0.1em 0.35em;
    border-radius: 3px;
    font-size: 0.9em;
    margin-right: 0.3em;
}

/* -----------------------------------------------------------------------------
   ID and Type styling in table cells
   ----------------------------------------------------------------------------- */
.rigr-id {
    font-family: ui-monospace, 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-weight: 600;
    color: var(--rigr-id-color);
    background: var(--rigr-id-bg);
    padding: 0.15em 0.4em;
    border-radius: 3px;
    font-size: 0.95em;
}

.rigr-type-label {
    color: var(--rigr-text-secondary);
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.85em;
    letter-spacing: 0.05em;
}

/* -----------------------------------------------------------------------------
   Content Wrapper - body on left, metadata on right
   ----------------------------------------------------------------------------- */
.rigr-content-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
}

.rigr-body {
    flex: 1 1 70%;
    min-width: 300px;
    padding: 0.5em 0.75em 0.5em 1em !important;
    background: var(--rigr-bg-content);
    color: var(--rigr-text-primary);
}

.rigr-body > *:first-child {
    margin-top: 0;
}

.rigr-body > *:last-child {
    margin-bottom: 0;
}

.rigr-metadata-wrapper {
    flex: 0 0 auto;
    width: 25%;
    min-width: 180px;
    max-width: 280px;
    background: var(--rigr-bg-light);
    border-left: 1px solid var(--rigr-border-color);
    display: flex;
    flex-direction: column;
}

.rigr-metadata-wrapper .rigr-metadata-table,
.rigr-metadata-wrapper table {
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.rigr-metadata-wrapper tbody,
.rigr-metadata-wrapper tgroup {
    margin: 0 !important;
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.rigr-metadata-wrapper tr {
    display: flex;
    width: 100%;
}

.rigr-metadata-wrapper tr:last-child {
    flex: 1;
}

.rigr-metadata-wrapper td:first-child {
    flex: 0 0 auto;
    width: 40%;
}

.rigr-metadata-wrapper td:last-child {
    flex: 1;
}

/* -----------------------------------------------------------------------------
   Metadata Table - compact styling
   ----------------------------------------------------------------------------- */
.rigr-metadata-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8em;
    margin: 0 !important;
    padding: 0;
    background: transparent;
    border: none;
}

.rigr-metadata-table td {
    padding: 0.25em 0.5em;
    border-bottom: 1px solid var(--rigr-border-color);
    vertical-align: top;
    color: var(--rigr-text-primary);
}

.rigr-metadata-table td:first-child {
    width: 40%;
    font-weight: 500;
    color: var(--rigr-text-secondary);
    white-space: nowrap;
}

.rigr-metadata-table td:last-child {
    background: var(--rigr-bg-content);
}

.rigr-metadata-table tr:last-child td {
    border-bottom: none;
}

/* Clickable link references */
.rigr-link-ref {
    color: var(--rigr-id-color);
    text-decoration: none;
}

.rigr-link-ref:hover {
    text-decoration: underline;
}

/* =============================================================================
   GRAPHIC DIRECTIVE STYLES
   ============================================================================= */

.rigr-graphic {
    margin: 2em 0;
    padding: 0;
    background: var(--rigr-bg-light);
    border: 1px solid var(--rigr-border-color);
    border-radius: 4px;
    overflow: hidden;
}

.rigr-graphic-content {
    padding: 1em;
    background: var(--rigr-bg-content);
    overflow-x: auto;
    text-align: center;
}

.rigr-graphic-link {
    display: block;
    cursor: zoom-in;
}

.rigr-graphic-link:hover img {
    opacity: 0.9;
}

.rigr-graphic-content img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    transition: opacity 0.2s;
}

.rigr-graphic-content object,
.rigr-graphic-content svg {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
}

.rigr-graphic-uml {
    width: 100%;
}

.rigr-graphic-uml .plantuml {
    width: 100%;
    overflow-x: auto;
}

.rigr-graphic-uml object {
    max-width: 100%;
    width: auto !important;
    height: auto !important;
}

.rigr-graphic-caption {
    padding: 0.75em 1em;
    background: var(--rigr-bg-header);
    border-top: 1px solid var(--rigr-border-color);
    text-align: center;
    font-style: italic;
    color: var(--rigr-text-secondary);
}

.rigr-graphic-caption p {
    margin: 0;
}

/* =============================================================================
   CODE DIRECTIVE STYLES
   ============================================================================= */

.rigr-code {
    margin: 2em 0;
    padding: 0;
    background: var(--rigr-bg-light);
    border: 1px solid var(--rigr-border-color);
    border-radius: 4px;
    overflow: hidden;
}

.rigr-code-content {
    margin: 0;
    padding: 0;
}

.rigr-code-content .highlight {
    margin: 0;
    border-radius: 0;
}

.rigr-code-content pre {
    margin: 0;
    border-radius: 0;
    border: none;
    border-top: 1px solid var(--rigr-border-color);
    border-bottom: 1px solid var(--rigr-border-color);
}

.rigr-code-caption {
    padding: 0.75em 1em;
    background: var(--rigr-bg-header);
    border-top: 1px solid var(--rigr-border-color);
    text-align: center;
    font-style: italic;
    color: var(--rigr-text-secondary);
}

.rigr-code-caption p {
    margin: 0;
}

/* -----------------------------------------------------------------------------
   Admonitions
   ----------------------------------------------------------------------------- */
.admonition {
    border: 1px solid var(--rigr-border-color);
    border-radius: 4px;
    margin: 1em 0;
    padding: 0.75em 1em;
    background: var(--rigr-bg-light);
}

.admonition-title {
    font-weight: 600;
    margin: 0 0 0.5em 0;
}

.admonition.note { border-left: 4px solid #2196F3; }
.admonition.warning { border-left: 4px solid #FF9800; }
.admonition.tip { border-left: 4px solid #4CAF50; }
.admonition.important { border-left: 4px solid #F44336; }
.admonition.caution { border-left: 4px solid #FF9800; }
.admonition.danger { border-left: 4px solid #F44336; }

/* -----------------------------------------------------------------------------
   Status Theming
   ----------------------------------------------------------------------------- */
.rigr-status-draft { border-top: 2px solid #CFB53B; }
.rigr-status-review { border-top: 2px solid #E08A00; }
.rigr-status-approved { border-top: 2px solid #388E3C; }
.rigr-status-implemented { border-top: 2px solid #1976D2; }
.rigr-status-verified { border-top: 2px solid #7B1FA2; }
.rigr-status-deprecated { border-top: 2px solid #9E9E9E; }
.rigr-status-rejected { border-top: 2px solid #C62828; }

.rigr-field-status { font-weight: 600; }
.rigr-status-draft .rigr-field-status { color: #CFB53B; }
.rigr-status-review .rigr-field-status { color: #E08A00; }
.rigr-status-approved .rigr-field-status { color: #388E3C; }
.rigr-status-implemented .rigr-field-status { color: #1976D2; }
.rigr-status-verified .rigr-field-status { color: #7B1FA2; }
.rigr-status-deprecated .rigr-field-status { color: #9E9E9E; }
.rigr-status-rejected .rigr-field-status { color: #C62828; }

/* -----------------------------------------------------------------------------
   PlantUML Diagrams
   ----------------------------------------------------------------------------- */
.rigr-graphic-uml {
    padding: 1em;
    text-align: center;
    background: var(--rigr-bg-content);
}

.rigr-graphic-uml img.plantuml-diagram {
    max-width: 100%;
    height: auto;
    display: inline-block;
}

/* -----------------------------------------------------------------------------
   Syntax Highlighting (highlight.js)
   ----------------------------------------------------------------------------- */
.hljs {
    background: var(--rigr-code-block-bg);
}

.hljs-keyword, .hljs-built_in, .hljs-name { color: #0000ff; }
.hljs-string, .hljs-attr, .hljs-symbol { color: #a31515; }
.hljs-type, .hljs-title, .hljs-section, .hljs-title.class_, .hljs-title.function_ { color: #267f99; }
.hljs-number, .hljs-literal { color: #098658; }
.hljs-comment, .hljs-quote { color: #008000; font-style: italic; }
.hljs-meta { color: #795E26; }
.hljs-variable, .hljs-template-variable { color: #001080; }
.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: bold; }

/* -----------------------------------------------------------------------------
   Print Styles
   ----------------------------------------------------------------------------- */
@media print {
    .rigr-item {
        break-inside: avoid;
        border: 1px solid #ccc;
        box-shadow: none;
    }

    .rigr-graphic {
        break-inside: avoid;
    }

    .rigr-code {
        break-inside: avoid;
    }
}
`;

/**
 * Rigr JavaScript template for clickable graphics
 */
export const RIGR_JS_TEMPLATE = `/**
 * Rigr - Make graphics clickable to view full-size
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all clickable graphic images
    document.querySelectorAll('.rigr-clickable img').forEach(function(img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            window.open(img.src, '_blank');
        });
    });

    // Find all PlantUML diagrams (rendered as <object> with SVG)
    document.querySelectorAll('.rigr-graphic-uml .plantuml').forEach(function(container) {
        var obj = container.querySelector('object');
        if (obj) {
            var overlay = document.createElement('div');
            overlay.className = 'rigr-uml-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.cursor = 'zoom-in';
            overlay.title = 'Click to view full-size';

            container.style.position = 'relative';
            container.style.display = 'inline-block';

            overlay.addEventListener('click', function() {
                window.open(obj.data, '_blank');
            });

            container.appendChild(overlay);
        }
    });

    // Handle PlantUML fallback images
    document.querySelectorAll('.rigr-graphic-uml img').forEach(function(img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            window.open(img.src, '_blank');
        });
    });
});
`;

/**
 * Sample requirements RST file template
 */
export const SAMPLE_RST_TEMPLATE = `Requirements
============

This document contains the system requirements.

Stakeholder Requirements
------------------------

.. item:: Sample Stakeholder Requirement
   :id: 0001
   :type: requirement
   :level: stakeholder
   :status: draft

   This is a sample stakeholder requirement. Replace this with your actual requirements.

   **Acceptance Criteria:**

   - Criterion 1
   - Criterion 2

System Requirements
-------------------

.. item:: System Requirement
   :id: 0002
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 0001

   This system requirement satisfies stakeholder requirement 0001.

.. item:: Another System Requirement
   :id: 0003
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 0001

   This requirement also satisfies 0001, demonstrating traceability.

Design Elements
---------------

.. item:: Sample Design Element
   :id: 0004
   :type: design_element
   :level: component
   :status: draft
   :implements: 0002

   This design element implements system requirement 0002.

Rationales
----------

.. item:: Rationale for Requirement 0001
   :id: 0005
   :type: rationale
   :level: stakeholder
   :status: draft
   :links: 0001

   This rationale explains why requirement 0001 exists.

   The requirement is needed because of regulatory compliance
   and customer expectations for system reliability.

Graphics Example
----------------

Below is an example of the graphic directive with PlantUML:

.. graphic:: System Overview
   :id: 0006
   :caption: This diagram shows the basic system architecture.

   @startuml
   actor User
   component "Frontend" as FE
   component "Backend" as BE
   database "Database" as DB

   User --> FE
   FE --> BE
   BE --> DB
   @enduml

Code Example
------------

Below is an example of the code directive with syntax highlighting:

.. listing:: User Data Model
   :id: 0007
   :language: python
   :caption: Python class representing the user data model.
   :implements: 0002

   class User:
       """Represents a system user."""

       def __init__(self, name: str, email: str):
           self.name = name
           self.email = email

       def validate(self) -> bool:
           return "@" in self.email
`;

/**
 * Index RST template
 */
export const INDEX_RST_TEMPLATE = `Welcome to Requirements Documentation
=====================================

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   requirements
`;
