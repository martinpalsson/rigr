/**
 * Asset copier for static builds
 *
 * Copies CSS, JS, and referenced images to the build output directory.
 */

import * as fs from 'fs';
import * as path from 'path';
import { RIGR_CSS_TEMPLATE, RIGR_JS_TEMPLATE } from '../commands/templates';
import { STATIC_PAGE_CSS } from './templateEngine';
import { generateStaticThemeCss } from '../themes';

/**
 * Copy all static assets to the build output directory.
 *
 * Creates `_static/` with CSS and JS files.
 * Prepends theme CSS custom properties (light + dark media query).
 */
export function copyStaticAssets(outputDir: string, themeName: string = 'default'): void {
  const staticDir = path.join(outputDir, '_static');
  mkdirSync(staticDir);

  // Combined CSS: theme vars + page layout + rigr component styles
  const themeCss = generateStaticThemeCss(themeName);
  const combinedCss = `${themeCss}\n\n${STATIC_PAGE_CSS}\n\n${RIGR_CSS_TEMPLATE}`;
  fs.writeFileSync(path.join(staticDir, 'rigr.css'), combinedCss, 'utf-8');

  // JavaScript
  fs.writeFileSync(path.join(staticDir, 'rigr.js'), RIGR_JS_TEMPLATE, 'utf-8');
}

/**
 * Copy referenced images from the source directory to the build output.
 *
 * Scans for common image directories (images/, _images/, img/) and copies them.
 */
export function copyImages(sourceDir: string, outputDir: string): void {
  const imageDirs = ['images', '_images', 'img'];

  for (const dir of imageDirs) {
    const srcPath = path.join(sourceDir, dir);
    if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
      const destPath = path.join(outputDir, dir);
      copyDirRecursive(srcPath, destPath);
    }
  }
}

/**
 * Recursively copy a directory.
 */
function copyDirRecursive(src: string, dest: string): void {
  mkdirSync(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Create a directory if it doesn't exist (recursive).
 */
function mkdirSync(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
