# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Precept is a lightweight VS Code extension for requirements management using RST (reStructuredText) files. It provides IntelliSense, validation, navigation, live preview, and static HTML documentation — all self-contained with no external dependencies.

## Build & Development Commands

```bash
npm run compile          # One-time TypeScript compilation
npm run watch            # Watch mode for development
npm run lint             # Run ESLint
npm run lint -- --fix    # Auto-fix linting issues
npm run test:unit        # Run Jest unit tests
npm run test:unit -- --coverage  # With coverage report (80% threshold)
npm run test             # Full integration tests (requires VS Code)
```

**Debug**: Press F5 in VS Code to launch Extension Development Host (uses `.vscode/launch.json`).

## Architecture

```
src/
├── extension.ts              # Entry point - activation, provider registration
├── types.ts                  # Core interfaces (ObjectType, RequirementObject, etc.)
├── configuration/            # Config loading from precept.json + defaults
├── indexing/                 # RST parsing and in-memory index
├── providers/                # VS Code language providers (completion, hover, definition, etc.)
├── views/                    # UI (Item Explorer & Link Explorer tree views)
├── commands/                 # Command implementations (validation, baseline, reports)
├── renderer/                 # Pure TypeScript RST-to-HTML rendering engine
├── preview/                  # Live preview webview panel
├── build/                    # Static HTML site builder
├── themes/                   # Selectable theme definitions (default, readthedocs, alabaster, furo, pydata)
├── validation/               # Deep validation analyzers
└── utils/                    # ID generation, graph analysis
```

### Key Patterns

**Dependency Injection**: All providers receive `IndexBuilder` and `PreceptConfig` via constructor, with `updateConfig()` method for config changes.

**Index Architecture**: `IndexBuilder` maintains multiple maps:
- `objects`: Map<id, RequirementObject> - primary lookup
- `fileIndex`, `typeIndex`, `statusIndex`: secondary indexes
- `linkGraph`: dependency tracking for traceability

**Configuration Layer**: Loads from `precept.json` (JSON) with fallback to built-in defaults. No external tools required. Search order: `docs/precept.json`, `doc/precept.json`, `source/precept.json`, `precept.json`, then recursive search.

**Rendering**: Pure TypeScript renderer converts RST to HTML for both live preview and static site. Supports themes via CSS custom properties (`--precept-*`).

**Validation**: Automatic (on save, lightweight) vs Deep (command-triggered, circular deps, coverage analysis).

## Coding Standards

- TypeScript strict mode enabled
- Prefer `interface` over `type` for object shapes
- Explicit return types on public functions
- Avoid `any` - use `unknown` with type guards
- JSDoc comments for public APIs
- Conventional Commits for commit messages

## Adding New Features

**New Provider**: Create class in `src/providers/` implementing VS Code interface, register in `extension.ts`, add export to `providers/index.ts`.

**New Command**: Declare in `package.json` contributes.commands, implement in `src/commands/`, register in `extension.ts`.

**New Setting**: Add to `package.json` contributes.configuration, handle in `settingsManager.ts`.
