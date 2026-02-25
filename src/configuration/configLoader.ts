/**
 * Configuration loader for Rigr
 * Loads requirements configuration from rigr.json
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {
  RigrConfig,
  ObjectType,
  Level,
  IdConfig,
  LinkType,
  Status,
  CustomFields,
  CustomFieldValue,
  ConfigLoadResult,
} from '../types';
import { DEFAULT_CONFIG, buildIdRegex } from './defaults';
import { getSettings } from './settingsManager';

/**
 * Locate rigr.json file in the workspace
 */
export async function findRigrJsonPath(workspaceRoot: string): Promise<string | null> {
  const possiblePaths = [
    path.join(workspaceRoot, 'docs', 'rigr.json'),
    path.join(workspaceRoot, 'doc', 'rigr.json'),
    path.join(workspaceRoot, 'source', 'rigr.json'),
    path.join(workspaceRoot, 'rigr.json'),
  ];

  for (const jsonPath of possiblePaths) {
    if (fs.existsSync(jsonPath)) {
      return jsonPath;
    }
  }

  // Search for rigr.json in subdirectories (limited depth)
  try {
    const files = await vscode.workspace.findFiles('**/rigr.json', '**/node_modules/**', 10);
    if (files.length > 0) {
      return files[0].fsPath;
    }
  } catch {
    // Ignore search errors
  }

  return null;
}

/**
 * Parse raw config JSON into typed config
 */
function parseRawConfig(raw: {
  objectTypes?: Array<Record<string, unknown>>;
  levels?: Array<Record<string, unknown>>;
  idConfig?: Record<string, unknown> | null;
  linkTypes?: Array<Record<string, unknown>>;
  statuses?: Array<Record<string, unknown>>;
  customFields?: Record<string, Array<Record<string, unknown>>>;
  extraOptions?: string[];
  defaultStatus?: string;
  idRegex?: string;
  relationships?: Record<string, string>;
}): RigrConfig {
  const objectTypes: ObjectType[] = (raw.objectTypes || []).map((t) => ({
    type: String(t.type || ''),
    title: String(t.title || t.type || ''),
    color: t.color ? String(t.color) : undefined,
    style: t.style ? String(t.style) : undefined,
  })).filter(t => t.type);

  const levels: Level[] = (raw.levels || []).map((l) => ({
    level: String(l.level || ''),
    title: String(l.title || l.level || ''),
  })).filter(l => l.level);

  const rawIdConfig = raw.idConfig;
  const idConfig: IdConfig = rawIdConfig ? {
    prefix: String(rawIdConfig.prefix || ''),
    separator: String(rawIdConfig.separator || ''),
    padding: Number(rawIdConfig.padding) || 4,
    start: Number(rawIdConfig.start) || 1,
  } : DEFAULT_CONFIG.idConfig;

  const linkTypes: LinkType[] = (raw.linkTypes || []).map((l) => ({
    option: String(l.option || ''),
    incoming: String(l.incoming || l.option || ''),
    outgoing: String(l.outgoing || l.option || ''),
    style: l.style ? String(l.style) : undefined,
  })).filter(l => l.option);

  const statuses: Status[] = (raw.statuses || []).map((s) => ({
    status: String(s.status || ''),
    color: s.color ? String(s.color) : undefined,
  })).filter(s => s.status);

  // Parse custom fields
  const customFields: CustomFields = {};
  if (raw.customFields && typeof raw.customFields === 'object') {
    for (const [fieldName, values] of Object.entries(raw.customFields)) {
      if (Array.isArray(values)) {
        customFields[fieldName] = values.map((v): CustomFieldValue => ({
          value: String(v.value || ''),
          title: String(v.title || v.value || ''),
        })).filter(v => v.value);
      }
    }
  }

  // Build ID regex from idConfig
  const id_regex = buildIdRegex(idConfig);

  return {
    objectTypes: objectTypes.length > 0 ? objectTypes : DEFAULT_CONFIG.objectTypes,
    levels: levels.length > 0 ? levels : DEFAULT_CONFIG.levels,
    idConfig,
    linkTypes: linkTypes.length > 0 ? linkTypes : DEFAULT_CONFIG.linkTypes,
    statuses: statuses.length > 0 ? statuses : DEFAULT_CONFIG.statuses,
    customFields,
    id_regex,
    traceability_item_id_regex: raw.idRegex,
    traceability_relationships: raw.relationships,
  };
}

/**
 * Load configuration from rigr.json
 */
export async function loadConfigFromJson(jsonPath: string): Promise<ConfigLoadResult> {
  try {
    const content = await fs.promises.readFile(jsonPath, 'utf-8');
    const rawConfig = JSON.parse(content);
    const config = parseRawConfig(rawConfig);
    const theme = typeof rawConfig.theme === 'string' ? rawConfig.theme : undefined;

    return {
      success: true,
      config,
      source: 'rigr.json',
      theme,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      source: 'rigr.json',
    };
  }
}

/**
 * Load configuration from VS Code settings (custom types override)
 */
export function loadConfigFromSettings(): ConfigLoadResult {
  const settings = getSettings();

  if (!settings.config.overrideConfig || settings.config.customTypes.length === 0) {
    return {
      success: false,
      error: 'Settings override not enabled or no custom types defined',
      source: 'settings',
    };
  }

  const config: RigrConfig = {
    ...DEFAULT_CONFIG,
    objectTypes: settings.config.customTypes,
  };

  return {
    success: true,
    config,
    source: 'settings',
  };
}

/**
 * Main configuration loading function
 * Tries sources in order: VS Code settings (if override enabled) -> rigr.json -> defaults
 */
export async function loadConfiguration(workspaceRoot: string): Promise<ConfigLoadResult> {
  // Check if settings override is enabled
  const settings = getSettings();
  if (settings.config.overrideConfig && settings.config.customTypes.length > 0) {
    const settingsResult = loadConfigFromSettings();
    if (settingsResult.success) {
      return settingsResult;
    }
  }

  // Try to find and load rigr.json
  const jsonPath = await findRigrJsonPath(workspaceRoot);
  if (jsonPath) {
    const jsonResult = await loadConfigFromJson(jsonPath);
    if (jsonResult.success) {
      return jsonResult; // includes theme if present
    }
    // Log error but continue to defaults
    console.warn(`Failed to load rigr.json: ${jsonResult.error}`);
  }

  // Fall back to defaults
  return {
    success: true,
    config: DEFAULT_CONFIG,
    source: 'defaults',
  };
}

/**
 * Create a file watcher for rigr.json changes
 */
export function createConfigWatcher(
  workspaceRoot: string,
  onConfigChange: () => void
): vscode.Disposable {
  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspaceRoot, '**/rigr.json')
  );

  const disposables = [
    watcher,
    watcher.onDidChange(onConfigChange),
    watcher.onDidCreate(onConfigChange),
    watcher.onDidDelete(onConfigChange),
  ];

  return vscode.Disposable.from(...disposables);
}

/**
 * Configuration manager singleton
 */
export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: RigrConfig = DEFAULT_CONFIG;
  private configSource: 'rigr.json' | 'settings' | 'defaults' = 'defaults';
  private rigrJsonPath: string | null = null;
  private themeName: string = 'default';
  private disposables: vscode.Disposable[] = [];
  private onConfigChangeEmitter = new vscode.EventEmitter<RigrConfig>();

  public readonly onConfigChange = this.onConfigChangeEmitter.event;

  private constructor() {}

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  /**
   * Initialize the configuration manager
   */
  public async initialize(workspaceRoot: string): Promise<void> {
    // Load initial configuration
    await this.reload(workspaceRoot);

    // Set up rigr.json watcher
    this.disposables.push(
      createConfigWatcher(workspaceRoot, () => this.reload(workspaceRoot))
    );

    // Set up settings change listener
    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('requirements.config')) {
          this.reload(workspaceRoot);
        }
      })
    );
  }

  /**
   * Reload configuration
   */
  public async reload(workspaceRoot: string): Promise<void> {
    const result = await loadConfiguration(workspaceRoot);

    if (result.success && result.config) {
      this.config = result.config;
      this.configSource = result.source;
      this.themeName = result.theme || 'default';
      this.onConfigChangeEmitter.fire(this.config);
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): RigrConfig {
    return this.config;
  }

  /**
   * Get configuration source
   */
  public getConfigSource(): 'rigr.json' | 'settings' | 'defaults' {
    return this.configSource;
  }

  /**
   * Get the selected theme name
   */
  public getThemeName(): string {
    return this.themeName;
  }

  /**
   * Get rigr.json path if found
   */
  public getRigrJsonPath(): string | null {
    return this.rigrJsonPath;
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
    this.onConfigChangeEmitter.dispose();
  }
}
