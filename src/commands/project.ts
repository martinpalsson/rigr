/**
 * Project Commands - Create and initialize Rigr RMS projects
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {
  RIGR_JSON_TEMPLATE,
  SAMPLE_RST_TEMPLATE,
  INDEX_RST_TEMPLATE,
  RIGR_CSS_TEMPLATE,
  RIGR_JS_TEMPLATE,
} from './templates';

/**
 * Create a new Rigr RMS project
 */
export function registerCreateProjectCommand(
  context: vscode.ExtensionContext
): vscode.Disposable {
  return vscode.commands.registerCommand('requirements.createProject', async () => {
    // Get workspace root
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (!workspaceRoot) {
      vscode.window.showErrorMessage('Please open a folder first to create a Rigr RMS project.');
      return;
    }

    // Check if project already exists
    const rigrJsonPath = path.join(workspaceRoot, 'docs', 'rigr.json');
    const altRigrJsonPath = path.join(workspaceRoot, 'rigr.json');

    if (fs.existsSync(rigrJsonPath) || fs.existsSync(altRigrJsonPath)) {
      const overwrite = await vscode.window.showWarningMessage(
        'A rigr.json file already exists. Do you want to overwrite it?',
        'Yes',
        'No'
      );

      if (overwrite !== 'Yes') {
        return;
      }
    }

    // Prompt user to confirm project creation
    const confirm = await vscode.window.showInformationMessage(
      'Create a new Rigr RMS project in this workspace?',
      'Yes',
      'No'
    );

    if (confirm !== 'Yes') {
      return;
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Creating Rigr RMS project...',
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
            path.join(staticDir, 'rigr.css'),
            RIGR_CSS_TEMPLATE,
            'utf-8'
          );
          await fs.promises.writeFile(
            path.join(staticDir, 'rigr.js'),
            RIGR_JS_TEMPLATE,
            'utf-8'
          );

          // Create images directory for graphics
          const imagesDir = path.join(docsDir, 'images');
          if (!fs.existsSync(imagesDir)) {
            await fs.promises.mkdir(imagesDir, { recursive: true });
          }

          // Create rigr.json
          progress.report({ message: 'Creating rigr.json...' });
          await fs.promises.writeFile(
            path.join(docsDir, 'rigr.json'),
            RIGR_JSON_TEMPLATE,
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
            'Rigr RMS project created successfully! Open docs/requirements.rst to get started.'
          );

          // Open the sample requirements file
          const sampleFile = vscode.Uri.file(path.join(docsDir, 'requirements.rst'));
          await vscode.window.showTextDocument(sampleFile);

          // Reload configuration to pick up the new rigr.json
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
