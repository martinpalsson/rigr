.. _precept-configuration:

======================
Configuration System
======================

This document specifies requirements for the Precept configuration system,
including precept.json parsing, VS Code settings, and configuration management.

.. contents:: Table of Contents
   :local:
   :depth: 2

Stakeholder Requirements
========================

.. item:: Single source of truth for configuration
   :id: 00001
   :type: requirement
   :level: stakeholder
   :status: approved
   :product: widget-pro
   :priority: high

   The extension shall use a single, authoritative source for project configuration
   to avoid synchronization issues and ensure consistency across tools.

.. item:: Zero-configuration startup
   :id: 00002
   :type: requirement
   :level: stakeholder
   :status: approved

   Users shall be able to use the extension immediately without mandatory
   configuration, with sensible defaults for common use cases.

.. item:: Rationale for JSON configuration
   :id: 00003
   :type: rationale
   :level: stakeholder
   :status: approved
   :justifies: 00001

   A JSON configuration file (precept.json) is chosen as the primary
   configuration source because:

   - JSON is universally supported and easy to edit
   - No external tooling or runtime dependencies required
   - Enables consistent behavior between live preview and static HTML build
   - Can be version-controlled alongside the requirements

JSON Configuration Parsing
============================

.. item:: Primary configuration source
   :id: 00004
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00001

   The extension SHALL read its primary configuration from a ``precept.json``
   file to provide a self-contained, dependency-free configuration mechanism.

.. item:: Configuration file discovery
   :id: 00005
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00004

   The extension shall search for precept.json in the following locations (in order):

   1. ``docs/precept.json`` relative to workspace root
   2. ``doc/precept.json`` relative to workspace root
   3. ``source/precept.json`` relative to workspace root
   4. ``precept.json`` in workspace root
   5. Recursive search in subdirectories

.. item:: JSON configuration parsing
   :id: 00006
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00004

   The extension shall parse the JSON configuration file directly using
   the built-in JSON parser, requiring no external tools or runtimes.

.. item:: Configuration fields to extract
   :id: 00007
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00004

   The extension shall extract the following configuration from precept.json:

   - ``objectTypes``: Object type definitions
   - ``levels``: Hierarchy level definitions
   - ``linkTypes``: Relationship type definitions
   - ``statuses``: Status value definitions
   - ``idConfig``: ID format configuration
   - ``customFields``: Custom metadata field definitions
   - ``theme``: Visual theme selection

Object Type Configuration
=========================

.. item:: Configurable object types
   :id: 00008
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00001

   The extension shall support user-defined object types with the following
   properties: type (identifier), title (display name), color (visualization),
   and style (rendering hint).

.. item:: Default object types
   :id: 00009
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00008, 00002

   Default object types shall include:

   - requirement: Primary functional requirements
   - rationale: Justification for requirements
   - information: Supporting context
   - parameter: Configurable values
   - term: Glossary and terminology definitions
   - design_element: Architectural decisions

Parameter Value References
==========================

.. item:: Single source of truth for parameter values
   :id: 00312
   :type: requirement
   :level: stakeholder
   :status: draft

   As a requirements engineer I want to be able to define parameters
   which can be referenced by value in other items (requirements, tests,
   etc.), with a single source of truth, such that if necessary only one
   change needs to be made to adjust the value at a later time.

.. item:: Parameter value attribute
   :id: 00313
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00312

   The ``.. item::`` directive shall support a ``:value:`` option that
   stores the parameter's actual value. This option is intended for
   items of type ``parameter`` but is available on all item types.

   Example::

      .. item:: Maximum Response Time
         :id: 0042
         :type: parameter
         :value: 200ms

         The maximum allowed response time for API calls.

.. item:: Parameter value reference role
   :id: 00314
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00312

   The renderer shall provide a ``:paramval:`` role that renders
   the value of a parameter item inline. The role takes the parameter's
   ID as argument and resolves to the parameter's ``:value:`` at render time.

   Example::

      The system shall respond within :paramval:`0042`.

   Renders as: "The system shall respond within 200ms."

.. item:: Parameter value reference with link
   :id: 00315
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00314

   The rendered parameter value shall be a hyperlink to the parameter's
   definition, allowing readers to navigate to the full parameter
   specification for context.

.. item:: Missing parameter value handling
   :id: 00316
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00314

   When a ``:paramval:`` reference cannot be resolved (unknown ID or
   parameter has no ``:value:`` defined), the renderer shall:

   - Display the reference as "???" or "[unknown: ID]"
   - Not break the page rendering

Terminology References
======================

.. item:: Single source of truth for terminology
   :id: 00317
   :type: requirement
   :level: stakeholder
   :status: draft

   As a requirements engineer I want to be able to define terms in a
   glossary which can be referenced by name in other items (requirements,
   specifications, etc.), with a single source of truth, such that if a
   term definition changes or a term is renamed, only one change needs
   to be made.

.. item:: Term definition attribute
   :id: 00318
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00317

   The ``.. item::`` directive shall support a ``:term:`` option that
   stores the term text. This option is intended for items of type
   ``term`` but is available on all item types.

   Example::

      .. item:: Application Programming Interface
         :id: 0050
         :type: term
         :term: API

         A set of protocols and tools for building software applications.

.. item:: Term reference role
   :id: 00319
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00317

   The renderer shall provide a ``:termref:`` role that renders
   the term text of a terminology item inline. The role takes the term's
   ID as argument and resolves to the term's ``:term:`` value at render time.

   Example::

      The system communicates via the :termref:`0050`.

   Renders as: "The system communicates via the API."

.. item:: Term reference with link
   :id: 00320
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00319

   The rendered term shall be a hyperlink to the term's definition,
   allowing readers to navigate to the full glossary entry for context.

.. item:: Missing term handling
   :id: 00321
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00319

   When a ``:termref:`` reference cannot be resolved (unknown ID or
   item has no ``:term:`` defined), the renderer shall:

   - Display the reference as "???" or "[unknown: ID]"
   - Not break the page rendering

Level Configuration
===================

.. item:: Configurable hierarchy levels
   :id: 00010
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00001

   The extension shall support user-defined hierarchy levels defining
   abstraction tiers in the requirements structure. Levels are stored
   as a ``:level:`` attribute, independent of the ID.

.. item:: Default hierarchy levels
   :id: 00011
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00010, 00002

   Default hierarchy levels shall include:

   - stakeholder: High-level user/business requirements
   - system: System-level functional requirements
   - component: Component-level specifications
   - software: Software implementation requirements
   - hardware: Hardware implementation requirements

Link Type Configuration
=======================

.. item:: Configurable link types
   :id: 00012
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00001

   The extension shall support user-defined link types with:

   - option: Field name used in RST (e.g., "satisfies")
   - incoming: Reverse link name (e.g., "satisfied_by")
   - outgoing: Forward link name (e.g., "satisfies")
   - style: Optional visual styling

.. item:: Default link types
   :id: 00013
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00012, 00002

   Default link types shall include:

   - satisfies/satisfied_by: Vertical traceability
   - implements/implemented_by: Implementation links
   - derives_from/derives_to: Derivation relationships
   - tests/tested_by: Verification links
   - references/referenced_by: Inline reference tracking (auto-injected)

Status Configuration
====================

.. item:: Configurable status values
   :id: 00014
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00001

   The extension shall support user-defined status values with labels and
   optional colors for visual indication.

.. item:: Default status values
   :id: 00015
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00014, 00002

   Default status values shall include:

   - draft: Initial creation
   - review: Under review
   - approved: Approved for implementation
   - implemented: Implementation complete
   - deprecated: No longer valid

Custom Fields Configuration
===========================

.. item:: User-defined custom fields with enumerated values
   :id: 00324
   :type: requirement
   :level: stakeholder
   :status: draft

   As a requirements engineer I want to be able to define custom fields
   (e.g., product, priority, component) with a predefined list of valid
   values, such that IntelliSense provides suggestions when editing these
   fields and documentation remains consistent.

.. item:: Custom fields configuration structure
   :id: 00325
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00324

   The extension shall support a ``customFields`` configuration
   in precept.json that maps field names to lists of valid values. Each value
   entry shall have:

   - value: The string value used in RST (e.g., "widget-pro")
   - title: Display name for documentation (e.g., "Widget Pro")

   Example::

      "customFields": {
          "product": [
              {"value": "widget-pro", "title": "Widget Pro"},
              {"value": "widget-lite", "title": "Widget Lite"}
          ],
          "priority": [
              {"value": "high", "title": "High"},
              {"value": "medium", "title": "Medium"},
              {"value": "low", "title": "Low"}
          ]
      }

.. item:: Custom field IntelliSense completion
   :id: 00326
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00324

   When editing an item directive and the cursor is on a custom field
   line (e.g., ``:product:``), the extension shall provide completion
   suggestions for all valid values defined in ``customFields``.

.. item:: Custom field directive acceptance
   :id: 00327
   :type: requirement
   :level: system
   :status: draft
   :satisfies: 00324

   The renderer shall accept any custom field defined in
   ``customFields`` as a valid option on item directives,
   without requiring code changes.

ID Configuration
================

.. item:: Configurable ID format
   :id: 00016
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00001

   The extension shall support configurable ID format with:

   - prefix: Optional prefix string (e.g., "REQ")
   - separator: Character between prefix and number (e.g., "-")
   - padding: Number of digits with leading zeros (e.g., 5 for "00001")
   - start: Starting number for auto-increment

.. item:: Project-unique IDs
   :id: 00017
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00016

   IDs shall be semantically neutral and globally unique within the project.
   The ID does not encode type, level, or location information.

.. item:: ID format parameters
   :id: 00018
   :type: parameter
   :level: system
   :status: approved
   :derives_from: 00016

   Default ID configuration parameters:

   - prefix: "" (empty, no prefix)
   - separator: "-"
   - padding: 5 (e.g., "00001")
   - start: 1

Default Configuration
=====================

.. item:: Fallback configuration
   :id: 00019
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00002

   If no precept.json is found or parsing fails, the extension shall use a
   minimal default configuration that enables basic functionality.

.. item:: Graceful degradation
   :id: 00020
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00019

   The extension shall continue operating with defaults when configuration
   parsing fails, displaying a notification about the fallback.

VS Code Settings
================

.. item:: Extension-specific settings
   :id: 00021
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00001

   The extension shall support VS Code settings.json for user-configurable
   extension behavior that is separate from project configuration.

.. item:: Validation settings
   :id: 00022
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00021

   Validation behavior settings shall include:

   - ``requirements.validation.automatic``: Enable/disable automatic validation
   - ``requirements.validation.onSave``: Validate on file save
   - ``requirements.validation.debounceMs``: Debounce interval (default: 500ms)

.. item:: UI preference settings
   :id: 00023
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00021

   UI preference settings shall include:

   - ``requirements.treeView.groupBy``: Grouping mode (type/file/status/level)
   - ``requirements.treeView.showStatusIcons``: Show status icons in tree

.. item:: Performance settings
   :id: 00024
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00021

   Performance settings shall include:

   - ``requirements.indexing.maxFiles``: Maximum files to index (default: 1000)
   - ``requirements.indexing.excludePatterns``: Glob patterns to exclude

.. item:: Validation debounce parameter
   :id: 00025
   :type: parameter
   :level: system
   :status: approved
   :derives_from: 00022

   Default validation debounce: 500 milliseconds

.. item:: Max files parameter
   :id: 00026
   :type: parameter
   :level: system
   :status: approved
   :derives_from: 00024

   Default maximum files to index: 1000 files

Configuration Refresh
=====================

.. item:: Manual configuration reload
   :id: 00027
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00001

   The extension shall provide a command "Precept: Reload Configuration"
   to manually reload configuration from precept.json.

.. item:: Automatic configuration reload
   :id: 00028
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00027

   The extension shall automatically reload configuration when precept.json
   is saved, without requiring manual refresh.

.. item:: Configuration status indicator
   :id: 00029
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00027

   The status bar shall display configuration status:

   - "Precept: Ready (N objects)" when configuration is loaded successfully
   - "Precept: Config Error" when parsing failed (clickable to view error)

.. item:: Configuration change notification
   :id: 00030
   :type: requirement
   :level: system
   :status: approved
   :satisfies: 00028

   When configuration changes affect existing objects (e.g., removed type),
   the extension shall display a notification and re-validate all objects.
