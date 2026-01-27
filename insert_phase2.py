#!/usr/bin/env python3
# -*- coding: utf-8 -*-

file_path = '.cursor/plans/event_guest_management_saas_94b10d1b.plan.md'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add todos
todos = '''  - id: phase2-export
    content: "Phase 2.7: Implement export functionality for guest lists and event data (CSV, Excel, PDF)"
    status: pending
  - id: phase2-deduplication
    content: "Phase 2.8: Build data deduplication and merging system for guest records"
    status: pending
  - id: phase2-segmentation
    content: "Phase 2.9: Implement guest segmentation, tags, and advanced filtering"
    status: pending
  - id: phase2-templates
    content: "Phase 2.10: Create event templates system for recurring events"
    status: pending
  - id: phase2-collaboration
    content: "Phase 2.11: Add team collaboration features (team member invites, activity logs, comments)"
    status: pending
  - id: phase2-guest-history
    content: "Phase 2.12: Implement guest history tracking and cross-event analytics"
    status: pending
  - id: phase2-advanced-search
    content: "Phase 2.13: Build advanced search and filtering with saved filter presets"
    status: pending
'''

content = content.replace(
    '    status: pending\n  - id: phase3-expo-setup',
    '    status: pending' + todos + '  - id: phase3-expo-setup'
)

# Read sections content from the other file
with open('add_phase2_features.py', 'r', encoding='utf-8') as f:
    script_content = f.read()
    
# Extract sections_content from the script
start_marker = "sections_content = '''"
end_marker = "'''"
start_idx = script_content.find(start_marker) + len(start_marker)
end_idx = script_content.find(end_marker, start_idx)
sections = script_content[start_idx:end_idx]

# Add content sections
content = content.replace(
    '- `app/settings/enrichment/page.tsx` - Enrichment settings (premium)\n\n## Phase 3: Supplier Mobile Apps (Expo)',
    '- `app/settings/enrichment/page.tsx` - Enrichment settings (premium)' + sections + '\n## Phase 3: Supplier Mobile Apps (Expo)'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully added Phase 2 features!")
