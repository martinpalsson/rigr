/**
 * Project Commands - Create and initialize Precept RMS projects
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {
  PRECEPT_JSON_TEMPLATE,
  SAMPLE_RST_TEMPLATE,
  INDEX_RST_TEMPLATE,
  PRECEPT_CSS_TEMPLATE,
  PRECEPT_JS_TEMPLATE,
} from './templates';

/**
 * Create a new Precept RMS project
 */
export function registerCreateProjectCommand(
  context: vscode.ExtensionContext
): vscode.Disposable {
  return vscode.commands.registerCommand('requirements.createProject', async () => {
    // Get workspace root
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (!workspaceRoot) {
      vscode.window.showErrorMessage('Please open a folder first to create a Precept RMS project.');
      return;
    }

    // Check if project already exists
    const preceptJsonPath = path.join(workspaceRoot, 'docs', 'precept.json');
    const altPreceptJsonPath = path.join(workspaceRoot, 'precept.json');

    if (fs.existsSync(preceptJsonPath) || fs.existsSync(altPreceptJsonPath)) {
      const overwrite = await vscode.window.showWarningMessage(
        'A precept.json file already exists. Do you want to overwrite it?',
        'Yes',
        'No'
      );

      if (overwrite !== 'Yes') {
        return;
      }
    }

    // Prompt user to confirm project creation
    const confirm = await vscode.window.showInformationMessage(
      'Create a new Precept RMS project in this workspace?',
      'Yes',
      'No'
    );

    if (confirm !== 'Yes') {
      return;
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Creating Precept RMS project...',
        cancellable: false,
      },
      async (progress) => {
        try {
          // Create docs directory
          const docsDir = path.join(workspaceRoot, 'docs');
          if (!fs.existsSync(docsDir)) {
            progress.report({ message: 'Creating docs directory...' });
            await fs.promises.mkdir(docsDir, { recursive: true });
          }

          // Create _static directory with CSS and JS
          progress.report({ message: 'Creating static files...' });
          const staticDir = path.join(docsDir, '_static');
          if (!fs.existsSync(staticDir)) {
            await fs.promises.mkdir(staticDir, { recursive: true });
          }
          await fs.promises.writeFile(
            path.join(staticDir, 'precept.css'),
            PRECEPT_CSS_TEMPLATE,
            'utf-8'
          );
          await fs.promises.writeFile(
            path.join(staticDir, 'precept.js'),
            PRECEPT_JS_TEMPLATE,
            'utf-8'
          );

          // Create images directory for graphics
          const imagesDir = path.join(docsDir, 'images');
          if (!fs.existsSync(imagesDir)) {
            await fs.promises.mkdir(imagesDir, { recursive: true });
          }

          // Create precept.json
          progress.report({ message: 'Creating precept.json...' });
          await fs.promises.writeFile(
            path.join(docsDir, 'precept.json'),
            PRECEPT_JSON_TEMPLATE,
            'utf-8'
          );

          // Create sample requirements file
          progress.report({ message: 'Creating sample requirements...' });
          await fs.promises.writeFile(
            path.join(docsDir, 'requirements.rst'),
            SAMPLE_RST_TEMPLATE,
            'utf-8'
          );

          // Create index.rst
          await fs.promises.writeFile(
            path.join(docsDir, 'index.rst'),
            INDEX_RST_TEMPLATE,
            'utf-8'
          );

          vscode.window.showInformationMessage(
            'Precept RMS project created successfully! Open docs/requirements.rst to get started.'
          );

          // Open the sample requirements file
          const sampleFile = vscode.Uri.file(path.join(docsDir, 'requirements.rst'));
          await vscode.window.showTextDocument(sampleFile);

          // Reload configuration to pick up the new precept.json
          await vscode.commands.executeCommand('requirements.reloadConfiguration');

        } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to create project: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    );
  });
}
