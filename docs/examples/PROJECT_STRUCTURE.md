# Example Project Structure

This document shows the recommended project structure for a requirements management project using Precept.

## Basic Structure

```
my-project/
├── docs/                          # Documentation root
│   ├── precept.json                  # Precept configuration
│   ├── index.rst                  # Documentation home page
│   │
│   ├── requirements/              # Requirements documents
│   │   ├── index.rst              # Requirements overview
│   │   ├── stakeholder.rst        # Stakeholder requirements
│   │   ├── system.rst             # System requirements
│   │   └── design.rst             # Design specifications
│   │
│   ├── tests/                     # Test documentation
│   │   ├── index.rst              # Test overview
│   │   └── test_cases.rst         # Test cases
│   │
│   ├── releases/                  # Generated release reports
│   │   ├── release-v1.0.0.md
│   │   └── release-v1.1.0.md
│   │
│   ├── _static/                   # Static assets (CSS, JS)
│   ├── images/                    # Images and diagrams
│   │
│   └── _build/                    # Built documentation (gitignored)
│
├── src/                           # Source code
│   └── ...
│
├── tests/                         # Automated tests
│   └── ...
│
├── .vscode/                       # VS Code configuration
│   ├── settings.json              # Extension settings
│   └── requirements-index.json    # Cached index (gitignored)
│
├── .gitignore
└── README.md
```

## Automotive/Safety-Critical Structure

For projects following automotive standards (ISO 26262, ASPICE):

```
automotive-project/
├── docs/
│   ├── precept.json
│   │
│   ├── srs/                       # Software Requirements Specification
│   │   ├── index.rst
│   │   ├── stakeholder/
│   │   │   ├── user_needs.rst
│   │   │   └── business_reqs.rst
│   │   ├── system/
│   │   │   ├── functional.rst
│   │   │   ├── performance.rst
│   │   │   └── safety.rst
│   │   └── software/
│   │       ├── sw_requirements.rst
│   │       └── interfaces.rst
│   │
│   ├── sds/                       # Software Design Specification
│   │   ├── index.rst
│   │   ├── architecture.rst
│   │   ├── components/
│   │   │   ├── component_a.rst
│   │   │   └── component_b.rst
│   │   └── interfaces.rst
│   │
│   ├── sts/                       # Software Test Specification
│   │   ├── index.rst
│   │   ├── unit_tests.rst
│   │   ├── integration_tests.rst
│   │   └── system_tests.rst
│   │
│   └── traceability/              # Traceability reports
│       ├── matrix.rst
│       └── coverage.rst
│
└── ...
```

## Requirement ID Conventions

### By Level
| Level | Prefix | Example | Description |
|-------|--------|---------|-------------|
| Stakeholder | STK_ | STK_001 | User needs, business requirements |
| System | SYS_ | SYS_001 | System-level requirements |
| Software | SWREQ_ | SWREQ_001 | Software requirements |
| Hardware | HWREQ_ | HWREQ_001 | Hardware requirements |
| Design | DSG_ | DSG_001 | Design specifications |
| Test | TEST_ | TEST_001 | Test cases |

### By Domain (Alternative)
| Domain | Prefix | Example | Description |
|--------|--------|---------|-------------|
| Functional | FREQ_ | FREQ_001 | Functional requirements |
| Performance | PREQ_ | PREQ_001 | Performance requirements |
| Security | SREQ_ | SREQ_001 | Security requirements |
| Safety | SAFREQ_ | SAFREQ_001 | Safety requirements |
| Interface | IREQ_ | IREQ_001 | Interface requirements |

## VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "requirements.validation.automatic": true,
  "requirements.validation.onSave": true,
  "requirements.treeView.groupBy": "type",
  "requirements.indexing.excludePatterns": [
    "**/build/**",
    "**/_build/**",
    "**/node_modules/**"
  ]
}
```

## .gitignore Additions

Add to your `.gitignore`:

```gitignore
# Build output
_build/

# VS Code requirements cache
.vscode/requirements-index.json
```

## Building Documentation

Use the VS Code command palette:

- **Precept: Build Documentation** - generates static HTML in `_build/html/`
- **Precept: View Documentation** - opens the built docs in your browser
- **Precept: Open RST Preview** - live preview in VS Code

## Tips

1. **One file per category**: Keep related requirements together
2. **Use includes**: Split large files using `.. include::` directive
3. **Add navigation**: Use `.. toctree::` for document hierarchy
4. **Cross-reference**: Use `:item:`ID`` for inline references
5. **Add rationale**: Document why requirements exist using `.. rationale::`
6. **Track changes**: Use baselines before releases
7. **Generate reports**: Create release reports for each version
