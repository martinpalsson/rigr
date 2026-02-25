# Configuration file for testing Precept

# Precept configuration
precept_object_types = [
    {"type": "requirement", "title": "Requirement"},
    {"type": "specification", "title": "Specification"},
    {"type": "rationale", "title": "Rationale"},
    {"type": "information", "title": "Information"},
    {"type": "parameter", "title": "Parameter"},
]

precept_levels = [
    {"level": "stakeholder", "title": "Stakeholder"},
    {"level": "system", "title": "System"},
    {"level": "component", "title": "Component"},
    {"level": "software", "title": "Software"},
]

precept_id_config = {
    "prefix": "",
    "separator": "",
    "padding": 4,
    "start": 1,
}

precept_link_types = [
    {
        "option": "satisfies",
        "incoming": "satisfied_by",
        "outgoing": "satisfies",
        "style": "#black"
    },
    {
        "option": "implements",
        "incoming": "implemented_by",
        "outgoing": "implements"
    },
    {
        "option": "derives_from",
        "incoming": "derives_to",
        "outgoing": "derives_from"
    },
    {
        "option": "tests",
        "incoming": "tested_by",
        "outgoing": "tests"
    },
    {
        "option": "links",
        "incoming": "links",
        "outgoing": "links"
    },
]

precept_statuses = [
    {"status": "draft", "color": "#FFEB3B"},
    {"status": "review", "color": "#FF9800"},
    {"status": "approved", "color": "#4CAF50"},
    {"status": "implemented", "color": "#2196F3"},
]

# Optional Melexis.trace configuration
traceability_item_id_regex = r'[0-9]{4}'
traceability_relationships = {
    'fulfills': 'fulfilled_by',
    'depends_on': 'impacts',
}
