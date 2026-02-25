/**
 * RST live preview webview provider
 *
 * Creates a side-panel webview that renders the active RST file using the
 * TypeScript renderer. Updates live as the user types.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { parseRstDocument } from '../renderer/rstFullParser';
import { renderDocument } from '../renderer/htmlEmitter';
import { RenderContext } from '../renderer/directiveRenderer';
import { RigrConfig, RequirementIndex } from '../types';
import { IndexBuilder } from '../indexing';
import { PREVIEW_CSS } from './previewStyles';
import { getTheme, generateThemeVars } from '../themes';

/**
 * Manages the RST preview webview panel.
 */
export class RstPreviewProvider implements vscode.Disposable {
  private panel: vscode.WebviewPanel | undefined;
  private config: RigrConfig;
  private indexBuilder: IndexBuilder;
  private disposables: vscode.Disposable[] = [];
  private updateTimeout: ReturnType<typeof setTimeout> | undefined;
  private currentUri: vscode.Uri | undefined;
  private themeName: string;

  constructor(config: RigrConfig, indexBuilder: IndexBuilder, themeName: string = 'default') {
    this.config = config;
    this.indexBuilder = indexBuilder;
    this.themeName = themeName;
  }

  /**
   * Update the config (called when config changes).
   */
  updateConfig(config: RigrConfig): void {
    this.config = config;
    this.scheduleUpdate();
  }

  /**
   * Update the theme (called when config changes).
   */
  updateTheme(themeName: string): void {
    this.themeName = themeName;
    this.scheduleUpdate();
  }

  /**
   * Open or reveal the preview panel for the active RST editor.
   */
  open(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'restructuredtext') {
      vscode.window.showInformationMessage('Open an RST file to preview.');
      return;
    }

    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.Beside, true);
      this.updatePreview(editor.document);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'rigrPreview',
      'RST Preview',
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      {
        enableScripts: false,
        localResourceRoots: [],
      },
    );

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    }, null, this.disposables);

    // Subscribe to document changes (live update)
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(e => {
        if (
          e.document.languageId === 'restructuredtext' &&
          e.document.uri.toString() === this.currentUri?.toString()
        ) {
          this.scheduleUpdate();
        }
      }),
    );

    // Subscribe to active editor changes
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.languageId === 'restructuredtext') {
          this.updatePreview(editor.document);
        }
      }),
    );

    // Subscribe to index updates (incoming links, paramval, etc.)
    this.disposables.push(
      this.indexBuilder.onIndexUpdate(() => {
        this.scheduleUpdate();
      }),
    );

    this.updatePreview(editor.document);
  }

  /**
   * Schedule a debounced preview update (300ms).
   */
  private scheduleUpdate(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = setTimeout(() => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === 'restructuredtext') {
        this.updatePreview(editor.document);
      } else if (this.currentUri) {
        // Active editor isn't RST, keep the last preview
      }
    }, 300);
  }

  /**
   * Render and push HTML to the webview.
   */
  private updatePreview(document: vscode.TextDocument): void {
    if (!this.panel) return;

    this.currentUri = document.uri;

    const fileName = path.basename(document.uri.fsPath);
    this.panel.title = `Preview: ${fileName}`;

    const rstText = document.getText();
    const bodyHtml = this.renderRst(rstText, document.uri);

    this.panel.webview.html = this.wrapHtml(bodyHtml);
  }

  /**
   * Parse and render RST text to HTML body content.
   */
  private renderRst(text: string, uri: vscode.Uri): string {
    try {
      const doc = parseRstDocument(text);
      const index = this.indexBuilder.getIndex();
      const ctx: RenderContext = {
        config: this.config,
        index: index || undefined,
        basePath: path.dirname(uri.fsPath),
        plantumlServer: 'https://www.plantuml.com/plantuml/svg/',
      };
      return renderDocument(doc, ctx);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return `<div class="render-error"><p><strong>Render error:</strong></p><pre>${escapeHtml(msg)}</pre></div>`;
    }
  }

  /**
   * Wrap body HTML in a full HTML page with styles and CSP.
   */
  private wrapHtml(body: string): string {
    // CSP: allow inline styles and images from PlantUML server + local resources
    const csp = [
      "default-src 'none'",
      "style-src 'unsafe-inline'",
      "img-src data: vscode-resource: https://www.plantuml.com https:",
    ].join('; ');

    // Detect VS Code colour theme kind for light/dark variant
    const themeKind = vscode.window.activeColorTheme.kind;
    const isDark = themeKind === vscode.ColorThemeKind.Dark ||
                   themeKind === vscode.ColorThemeKind.HighContrast;
    const mode = isDark ? 'dark' : 'light';

    const theme = getTheme(this.themeName);
    const themeVarsCss = generateThemeVars(theme, mode);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RST Preview</title>
  <style>${themeVarsCss}\n${PREVIEW_CSS}</style>
</head>
<body>
${body}
</body>
</html>`;
  }

  dispose(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    if (this.panel) {
      this.panel.dispose();
    }
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
