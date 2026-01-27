#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

# Read the plan file
with open('.cursor/plans/event_guest_management_saas_94b10d1b.plan.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Add todos after phase2-premium-enrichment
todos_to_add = '''  - id: phase2-export
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

# Insert todos
content = content.replace(
    '  - id: phase2-premium-enrichment\n    content: "Phase 2.6 (Post-MVP): Add structured API integration (Clearbit, etc.) as premium tier feature"\n    status: pending\n  - id: phase3-expo-setup',
    '  - id: phase2-premium-enrichment\n    content: "Phase 2.6 (Post-MVP): Add structured API integration (Clearbit, etc.) as premium tier feature"\n    status: pending' + todos_to_add + '  - id: phase3-expo-setup'
)

# Read the content sections from a separate file (we'll create it)
# For now, let's add it inline
sections_content = '''

### 2.7 Export Functionality

**Features:**

- Export guest lists to CSV, Excel, and PDF formats
- Export event data and reports
- Custom export fields selection
- Bulk export for multiple events
- Scheduled/automated exports (optional)
- Export templates for common formats

**Export Formats:**

- **CSV**: Standard comma-separated values for spreadsheet import
- **Excel (.xlsx)**: Formatted Excel files with multiple sheets
- **PDF**: Formatted reports with branding, charts, and summaries

**Files to create:**

- `app/api/export/guests/route.ts` - Guest list export endpoint
- `app/api/export/events/route.ts` - Event data export endpoint
- `components/export/ExportModal.tsx` - Export configuration modal
- `components/export/ExportButton.tsx` - Export trigger button
- `lib/services/export/csv-exporter.ts` - CSV export service
- `lib/services/export/excel-exporter.ts` - Excel export service (using xlsx library)
- `lib/services/export/pdf-exporter.ts` - PDF export service (using pdfkit or similar)
- `lib/types/export.ts` - Export-related TypeScript types

**Export Options:**

- Select fields to include in export
- Filter guests by status, importance, tags, etc.
- Include/exclude columns (name, email, company, importance score, etc.)
- Format options (date formats, number formats)
- Include event metadata in exports

### 2.8 Data Deduplication & Merging

**Features:**

- Automatic duplicate detection during CSV import
- Manual duplicate detection and review
- Smart matching algorithms (email, name+company, phone)
- Merge duplicate records with conflict resolution
- Preview merge results before applying
- Preserve data from both records intelligently

**Matching Strategies:**

- **Exact email match**: Primary matching method
- **Fuzzy name + company match**: Levenshtein distance for names
- **Phone number match**: Normalized phone number comparison
- **Custom matching rules**: Configurable matching criteria

**Merge Conflict Resolution:**

- Show side-by-side comparison of duplicate records
- Allow user to choose which data to keep for each field
- Auto-select best data (most recent, most complete)
- Merge notes and metadata from both records
- Preserve event-guest relationships from both records

**Files to create:**

- `app/guests/duplicates/page.tsx` - Duplicate detection and review page
- `components/duplicates/DuplicateList.tsx` - List of detected duplicates
- `components/duplicates/MergePreview.tsx` - Preview merge results
- `components/duplicates/ConflictResolver.tsx` - Field-by-field conflict resolution
- `lib/services/deduplication.ts` - Duplicate detection service
- `lib/services/merge.ts` - Record merging service
- `lib/utils/matching.ts` - Matching algorithm utilities
- `app/api/guests/duplicates/route.ts` - Duplicate detection API
- `app/api/guests/merge/route.ts` - Merge records API

**Database Schema Addition:**

```sql
-- Track duplicate detection results
CREATE TABLE duplicate_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  guest_id_1 UUID REFERENCES guests(id),
  guest_id_2 UUID REFERENCES guests(id),
  match_confidence DECIMAL(5,2), -- 0-100 confidence score
  match_reason TEXT, -- Why these were matched
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'merged', 'ignored'
  merged_into UUID REFERENCES guests(id), -- If merged, which record was kept
  detected_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX idx_duplicate_detections_org ON duplicate_detections(organization_id);
CREATE INDEX idx_duplicate_detections_status ON duplicate_detections(status);
```

### 2.9 Guest Segmentation & Tags

**Features:**

- Create custom tags for guests
- Bulk tag assignment
- Create and manage guest segments/lists
- Filter guests by tags, segments, or custom criteria
- Tag-based importance scoring adjustments
- Export segments
- Tag analytics and insights

**Tag Management:**

- Create, edit, and delete tags
- Tag colors and icons for visual organization
- Tag categories/groups
- Tag usage statistics

**Segments:**

- Create dynamic segments (auto-update based on criteria)
- Create static segments (manual guest lists)
- Segment templates
- Share segments with team members
- Use segments for bulk operations

**Files to create:**

- `app/guests/tags/page.tsx` - Tag management page
- `app/guests/segments/page.tsx` - Segment management page
- `components/tags/TagManager.tsx` - Tag management component
- `components/tags/TagSelector.tsx` - Tag selection component
- `components/tags/TagBadge.tsx` - Tag display badge
- `components/segments/SegmentBuilder.tsx` - Segment creation interface
- `components/segments/SegmentList.tsx` - List of segments
- `lib/services/tags.ts` - Tag management service
- `lib/services/segments.ts` - Segment management service
- `lib/db/tags.ts` - Tag database operations
- `lib/db/segments.ts` - Segment database operations
- `app/api/tags/route.ts` - Tags API endpoints
- `app/api/segments/route.ts` - Segments API endpoints

**Database Schema Addition:**

```sql
-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7), -- Hex color
  icon VARCHAR(50), -- Icon name
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- Guest Tags (many-to-many)
CREATE TABLE guest_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(guest_id, tag_id)
);

-- Segments
CREATE TABLE segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'static', -- 'static' or 'dynamic'
  criteria JSONB, -- For dynamic segments: filter criteria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Segment Guests (for static segments)
CREATE TABLE segment_guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  segment_id UUID REFERENCES segments(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(segment_id, guest_id)
);

CREATE INDEX idx_guest_tags_guest ON guest_tags(guest_id);
CREATE INDEX idx_guest_tags_tag ON guest_tags(tag_id);
CREATE INDEX idx_segment_guests_segment ON segment_guests(segment_id);
```

### 2.10 Event Templates

**Features:**

- Save event configurations as reusable templates
- Quick event creation from templates
- Template library with categories
- Share templates within organization
- Template variables and placeholders
- Duplicate events from existing events

**Template Components:**

- Event details (name, location, date patterns)
- Default guest list segments
- Default supplier assignments
- Default importance scoring settings
- Default tags and segments to apply
- Custom fields and settings

**Files to create:**

- `app/events/templates/page.tsx` - Template management page
- `app/events/templates/[id]/page.tsx` - Template detail/edit
- `components/templates/TemplateCard.tsx` - Template card component
- `components/templates/TemplateBuilder.tsx` - Template creation interface
- `components/templates/TemplateSelector.tsx` - Template selection for new events
- `lib/services/templates.ts` - Template management service
- `lib/db/templates.ts` - Template database operations
- `app/api/templates/route.ts` - Templates API endpoints
- `app/api/templates/[id]/route.ts` - Single template API

**Database Schema Addition:**

```sql
-- Event Templates
CREATE TABLE event_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  template_data JSONB, -- Store event configuration
  -- Include: name pattern, location, default segments, default suppliers, etc.
  is_shared BOOLEAN DEFAULT FALSE, -- Share with organization
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_event_templates_org ON event_templates(organization_id);
CREATE INDEX idx_event_templates_category ON event_templates(category);
```

### 2.11 Team Collaboration Features

**Features:**

- Invite team members to organization
- Role-based permissions (Admin, Editor, Viewer)
- Activity logs and audit trails
- Comments and notes on guests and events
- @mentions and notifications
- Shared notes and internal communication
- Team member management

**Team Member Management:**

- Invite team members via email
- Assign roles and permissions
- Remove team members
- View team member activity
- Team member profiles

**Activity Logs:**

- Track all changes (create, update, delete)
- Show who made changes and when
- Filter by user, date, action type
- Export activity logs
- Real-time activity feed

**Comments System:**

- Add comments to guests and events
- @mention team members in comments
- Threaded conversations
- Mark comments as resolved
- Email notifications for mentions

**Files to create:**

- `app/team/page.tsx` - Team management page
- `app/team/invite/page.tsx` - Invite team members
- `components/team/TeamMemberList.tsx` - List of team members
- `components/team/InviteModal.tsx` - Invite team member modal
- `components/activity/ActivityLog.tsx` - Activity log component
- `components/activity/ActivityFeed.tsx` - Real-time activity feed
- `components/comments/CommentsSection.tsx` - Comments component
- `components/comments/CommentThread.tsx` - Comment thread display
- `lib/services/team.ts` - Team management service
- `lib/services/activity.ts` - Activity logging service
- `lib/services/comments.ts` - Comments service
- `lib/db/team-members.ts` - Team member database operations
- `lib/db/activity-logs.ts` - Activity log database operations
- `lib/db/comments.ts` - Comments database operations
- `app/api/team/invite/route.ts` - Team invitation API
- `app/api/activity/route.ts` - Activity log API
- `app/api/comments/route.ts` - Comments API

**Database Schema Addition:**

```sql
-- Team Members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(50) DEFAULT 'viewer', -- 'admin', 'editor', 'viewer'
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP DEFAULT NOW(),
  joined_at TIMESTAMP,
  UNIQUE(organization_id, user_id)
);

-- Activity Logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  action_type VARCHAR(50), -- 'create', 'update', 'delete', 'export', etc.
  entity_type VARCHAR(50), -- 'event', 'guest', 'segment', etc.
  entity_id UUID,
  changes JSONB, -- Store what changed (before/after)
  metadata JSONB, -- Additional context
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  entity_type VARCHAR(50), -- 'event', 'guest', etc.
  entity_id UUID,
  parent_id UUID REFERENCES comments(id), -- For threaded comments
  content TEXT NOT NULL,
  mentions UUID[], -- Array of user IDs mentioned
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_org ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
```

### 2.12 Guest History & Cross-Event Analytics

**Features:**

- View guest's event history across all events
- Track guest attendance patterns
- Guest lifetime value metrics
- Cross-event analytics and insights
- Guest relationship tracking
- Event frequency analysis

**Guest History View:**

- List of all events guest attended
- RSVP history and patterns
- Check-in/attendance history
- Importance score trends over time
- Notes and interactions history

**Analytics:**

- Most frequent guests
- Guest retention rate
- Event-to-event guest overlap
- Guest engagement metrics
- VIP identification across events

**Files to create:**

- `app/guests/[id]/history/page.tsx` - Guest history page
- `components/guest-history/EventHistory.tsx` - Event history component
- `components/guest-history/AttendanceChart.tsx` - Attendance visualization
- `components/analytics/GuestAnalytics.tsx` - Guest analytics dashboard
- `components/analytics/CrossEventInsights.tsx` - Cross-event insights
- `lib/services/guest-history.ts` - Guest history service
- `lib/services/cross-event-analytics.ts` - Analytics service
- `lib/db/guest-history.ts` - Guest history database operations
- `app/api/guests/[id]/history/route.ts` - Guest history API
- `app/api/analytics/guests/route.ts` - Guest analytics API

**Database Schema Addition:**

```sql
-- Guest Event History (denormalized for quick access)
CREATE TABLE guest_event_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  rsvp_status VARCHAR(50),
  check_in_status VARCHAR(50),
  importance_score DECIMAL(5,2),
  attended BOOLEAN DEFAULT FALSE,
  event_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(guest_id, event_id)
);

CREATE INDEX idx_guest_history_guest ON guest_event_history(guest_id);
CREATE INDEX idx_guest_history_org ON guest_event_history(organization_id);
CREATE INDEX idx_guest_history_date ON guest_event_history(event_date);
```

### 2.13 Advanced Search & Filtering

**Features:**

- Full-text search across all guest fields
- Advanced filter builder with multiple criteria
- Saved filter presets
- Search history
- Filter combinations (AND/OR logic)
- Search within specific events or organization-wide

**Search Capabilities:**

- Search by name, email, company, job title, notes
- Fuzzy matching for typos
- Search across tags and segments
- Search by importance score ranges
- Date range filtering

**Filter Builder:**

- Multiple filter criteria
- Combine filters with AND/OR logic
- Filter by: status, tags, segments, importance, dates, custom fields
- Save frequently used filters
- Share filters with team

**Files to create:**

- `components/search/AdvancedSearch.tsx` - Advanced search component
- `components/search/FilterBuilder.tsx` - Filter builder interface
- `components/search/SavedFilters.tsx` - Saved filter presets
- `components/search/SearchBar.tsx` - Main search bar component
- `lib/services/search.ts` - Search service
- `lib/services/filtering.ts` - Filtering service
- `lib/db/saved-filters.ts` - Saved filter database operations
- `app/api/search/guests/route.ts` - Guest search API
- `app/api/search/events/route.ts` - Event search API
- `app/api/filters/route.ts` - Saved filters API

**Database Schema Addition:**

```sql
-- Saved Filters
CREATE TABLE saved_filters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  filter_criteria JSONB, -- Store filter configuration
  is_shared BOOLEAN DEFAULT FALSE, -- Share with organization
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_saved_filters_org ON saved_filters(organization_id);
CREATE INDEX idx_saved_filters_user ON saved_filters(user_id);
```

'''

# Insert content sections before Phase 3
content = content.replace(
    '- `app/settings/enrichment/page.tsx` - Enrichment settings (premium)\n\n## Phase 3: Supplier Mobile Apps (Expo)',
    '- `app/settings/enrichment/page.tsx` - Enrichment settings (premium)' + sections_content + '\n## Phase 3: Supplier Mobile Apps (Expo)'
)

# Write the updated content
with open('.cursor/plans/event_guest_management_saas_94b10d1b.plan.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully added Phase 2 features!")
