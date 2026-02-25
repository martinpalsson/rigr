# Precept Example Requirements

This directory contains example requirements documentation demonstrating the Precept format.

## Getting Started

1. Open this folder in VS Code with the Precept extension installed
2. Open any `.rst` file and use **Precept: Open RST Preview** (or click the preview icon in the editor toolbar) for live preview
3. Use **Precept: Build Documentation** to generate a static HTML site in `_build/html/`

## Building HTML Documentation

Use the VS Code command palette:
- **Precept: Build Documentation** - generates static HTML in `_build/html/`
- **Precept: View Documentation** - opens the built HTML in your browser

## Structure

- **precept.json** - Configuration file defining object types, levels, and link types
- **requirements/** - Example RST files with requirements
  - **index.rst** - Main index and traceability matrices
  - **architecture.rst** - Architecture requirements
  - **configuration.rst** - Configuration requirements
  - And more...

## Format

All requirements use the unified `.. item::` directive with a `:type:` field:

```rst
.. item:: Title of the requirement
   :id: 0001
   :type: requirement
   :level: stakeholder
   :status: draft

   Detailed description of the requirement.
```

### Object Types

- **requirement** - Requirements at any level
- **specification** - Technical design specifications
- **parameter** - Parameters with values
- **rationale** - Justification and reasoning
- **information** - Supporting information
- **term** - Terminology definitions

### Link Types

- `:satisfies:` - Stakeholder to system traceability
- `:implements:` - System to design traceability
- `:tests:` - Design to test traceability
- `:links:` - General links
- `:depends_on:` - Dependency tracking
