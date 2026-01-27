---
name: Event Guest Management SaaS
overview: "Build a SaaS platform for event organizers to manage guest lists, analyze guest importance, and coordinate with suppliers. The project will be developed in phases: Phase 0 (Landing Page & Waitlist), Phase 1 (CRM), Phase 2 (Importance Algorithm), and Phase 3 (Supplier Mobile Apps)."
todos:
  - id: phase0-setup
    content: "Phase 0.1: Initialize Next.js project with TypeScript and set up Supabase project for waitlist"
    status: pending
  - id: phase0-landing-page
    content: "Phase 0.2: Design and implement landing page with hero, features, and waitlist form"
    status: pending
  - id: phase0-waitlist-db
    content: "Phase 0.3: Create waitlist table in Supabase and set up database operations"
    status: pending
  - id: phase0-waitlist-api
    content: "Phase 0.4: Implement waitlist API endpoint and form handling with validation"
    status: pending
  - id: phase0-success-page
    content: "Phase 0.5: Create thank you page and optional email confirmation"
    status: pending
  - id: phase0-vercel-deployment
    content: "Phase 0.6: Set up Vercel deployment with environment variables and GitHub integration"
    status: pending
  - id: phase1-setup
    content: "Phase 1.1: Set up Next.js API routes structure (using Vercel serverless functions) and development environment"
    status: pending
  - id: phase1-ui
    content: "Phase 1.2: Set up UI component library (shadcn/ui) and create responsive layout with navigation"
    status: pending
  - id: phase1-events-mock
    content: "Phase 1.3: Build event management CRUD UI with mock data (create, list, view, edit, delete events)"
    status: pending
  - id: phase1-guests-mock
    content: "Phase 1.4: Build guest management CRUD UI with mock data"
    status: pending
  - id: phase1-csv-import
    content: "Phase 1.4a: Build comprehensive CSV/Excel import system with column mapping, auto-detection, validation, and preview"
    status: pending
  - id: phase1-event-guests-mock
    content: "Phase 1.5: Build event-guest relationship management UI with mock data (assign, remove, RSVP tracking)"
    status: pending
  - id: phase1-database-design
    content: "Phase 1.6: Design PostgreSQL database schema based on CRM UI requirements discovered"
    status: pending
  - id: phase1-database-implementation
    content: "Phase 1.7: Set up Supabase, implement database schema, and create data access layer"
    status: pending
  - id: phase1-api-routes
    content: "Phase 1.8: Implement API routes with real database connections, replacing mock data"
    status: pending
  - id: phase1-auth
    content: "Phase 1.9: Implement Supabase Auth integration with user registration, login, and profile management"
    status: pending
  - id: phase1-whitelabel
    content: "Phase 1.10: Implement whitelabeling and custom branding (logo, colors, domain, supplier app branding)"
    status: pending
  - id: phase2-openai-setup
    content: "Phase 2.1: Set up OpenAI API integration, configure API keys, and create prompt templates for importance scoring"
    status: pending
  - id: phase2-scoring-implementation
    content: "Phase 2.2: Implement OpenAI-based scoring service with caching, error handling, and structured outputs"
    status: pending
  - id: phase2-batch-processing
    content: "Phase 2.3: Implement batch processing and background jobs for calculating scores with rate limiting"
    status: pending
  - id: phase2-prompt-config
    content: "Phase 2.4: Create optional UI for customizing scoring prompts per event/organization"
    status: pending
  - id: phase2-display
    content: "Phase 2.5: Add importance score display, sorting, and filtering to guest lists with reasoning"
    status: pending
  - id: phase2-premium-enrichment
    content: "Phase 2.6 (Post-MVP): Add structured API integration (Clearbit, etc.) as premium tier feature"
    status: pending
  - id: phase2-export
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
  - id: phase3-expo-setup
    content: "Phase 3.1: Initialize Expo project with TypeScript, navigation, and API client setup"
    status: pending
  - id: phase3-mobile-auth
    content: "Phase 3.2: Implement authentication flow in mobile app with secure token storage"
    status: pending
  - id: phase3-event-views
    content: "Phase 3.3: Build event list and guest list screens with importance sorting and search"
    status: pending
  - id: phase3-checkoff
    content: "Phase 3.4: Implement guest check-off functionality with notes and timestamp tracking"
    status: pending
  - id: phase3-realtime
    content: "Phase 3.5: Add real-time updates for guest status changes and offline sync support"
    status: pending
  - id: phase3-dashboard
    content: "Phase 3.6: Create supplier dashboard with progress tracking and statistics"
    status: pending
  - id: phase3-backend-api
    content: "Phase 3.7: Extend backend API with supplier-specific endpoints and check-off tracking"
    status: pending
isProject: false
---

# Event Guest Management SaaS - Development Plan

## Technology Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript
- **Backend**: Next.js API Routes (serverless functions on Vercel)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Mobile**: Expo (React Native) with TypeScript
- **Payment**: Stripe
- **Hosting**: Vercel (Next.js app with API routes)

## Architecture Overview

```
┌─────────────────┐
│   Next.js Web   │
│     (Admin)     │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐  ┌─────▼──────┐
│  Express API    │  │  Supabase  │
│   (Backend)     │  │ (Auth+DB)  │
└────────┬────────┘  └─────┬──────┘
         │                 │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │   PostgreSQL    │
         │    Database     │
         └─────────────────┘
                  │
         ┌────────▼────────┐
         │  Expo Mobile    │
         │ (Supplier Apps) │
         └─────────────────┘
```

## Phase 0: Landing Page & Waitlist

**Approach**: Create a simple, beautiful landing page to capture early interest and build a waitlist before the full product is ready.

### 0.1 Project Setup & Supabase Initialization

- Initialize Next.js project with TypeScript
- Set up Supabase project (minimal - just for waitlist table)
- Configure Supabase environment variables
- Set up basic project structure
- Configure Git repository
- Set up Vercel project configuration

**Files to create:**

- `package.json` - Project dependencies
- `.env.local` - Environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
- `.env.example` - Example environment file
- `.gitignore` - Git ignore rules
- `next.config.js` - Next.js configuration
- `vercel.json` - Vercel deployment configuration (optional, for custom settings)

### 0.2 Landing Page Design & Implementation

**Features:**

- Hero section with value proposition
- Key features/benefits section
- Waitlist signup form (email capture)
- Simple, modern, responsive design
- Call-to-action buttons

**Files to create:**

- `app/page.tsx` - Landing page (homepage)
- `app/layout.tsx` - Root layout
- `components/landing/Hero.tsx` - Hero section
- `components/landing/Features.tsx` - Features section
- `components/landing/WaitlistForm.tsx` - Waitlist signup form
- `components/ui/Button.tsx` - Button component
- `components/ui/Input.tsx` - Input component
- `lib/utils/cn.ts` - Utility functions (className merging)

### 0.3 Waitlist Database Setup

**Database Schema:**

- Create `waitlist` table in Supabase
- Store email, name (optional), signup date, referral source (optional)

**SQL Migration:**

```sql
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  referral_source VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  notified_at TIMESTAMP, -- When they were notified about launch
  converted_at TIMESTAMP -- When they signed up for the product
);

CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);
```

**Files to create:**

- `migrations/001_waitlist_table.sql` - Waitlist table migration
- `lib/db/waitlist.ts` - Waitlist database operations
- `lib/supabase/client.ts` - Supabase client setup

### 0.4 Waitlist API & Form Handling

**Features:**

- Email validation
- Duplicate email handling
- Success/error messaging
- Loading states
- Thank you message after signup

**Files to create:**

- `app/api/waitlist/route.ts` - Waitlist API endpoint (POST)
- `app/api/waitlist/route.ts` - Optional: GET endpoint for admin (protected)
- `components/landing/WaitlistForm.tsx` - Form with validation and submission
- `lib/validation/waitlist.ts` - Email validation schema

### 0.5 Success Page & Email Confirmation

**Features:**

- Thank you page after signup
- Optional: Email confirmation (using Supabase Edge Functions or Resend)
- Social sharing buttons (optional)

**Files to create:**

- `app/thank-you/page.tsx` - Thank you page
- `lib/emails/waitlist-confirmation.ts` - Email template (optional)

### 0.6 Vercel Deployment

**Deployment Setup:**

- Connect GitHub repository to Vercel
- Configure environment variables in Vercel dashboard
- Set up production and preview deployments
- Configure custom domain (optional)
- Set up Vercel Analytics (optional)

**Environment Variables to Configure in Vercel:**

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_APP_URL` - Application URL (for redirects, etc.)

**Files to create:**

- `vercel.json` - Vercel configuration (if needed for custom settings)
- `.vercelignore` - Files to exclude from deployment (optional)

**Deployment Steps:**

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically on push to main branch
5. Set up preview deployments for pull requests

## Phase 1: CRM Management Platform

**Approach**: Build CRM UI/functionality first using mock data to understand data requirements, then design database schema based on those needs, and finally implement authentication.

### 1.1 Project Setup & Infrastructure

- Set up Next.js API routes structure (replacing Express - using Vercel serverless functions)
- Set up development environment
- Configure additional environment variables
- **Note**: Supabase is already initialized from Phase 0 (waitlist), but we'll use mock data for CRM initially
- **Note**: All API routes will be in `app/api/` directory (Next.js App Router API routes)

### 1.2 UI Component Library & Layout

- Set up UI component library (shadcn/ui or similar)
- Create layout components (header, sidebar, navigation)
- Responsive design foundation
- Loading states and error handling patterns
- Form validation utilities

**Files to create:**

- `components/ui/` - Reusable UI components (Button, Input, Card, Table, etc.)
- `components/layout/` - Layout components (Header, Sidebar, Navigation)
- `lib/utils/cn.ts` - Utility functions (className merging, etc.)
- `app/layout.tsx` - Root layout
- `lib/types/ui.ts` - UI-related TypeScript types

### 1.3 Event Management (CRM Core) - Mock Data

**Features:**

- Create, read, update, delete events (using in-memory/mock data)
- Event dashboard/list view
- Event detail pages
- Event status management (draft, active, completed)
- Form validation and error handling

**Data Requirements to Document:**

- What fields are needed for events? (name, date, location, description, status, etc.)
- What validation rules apply?
- What relationships exist? (events to guests, events to organizers)

**Files to create:**

- `app/events/page.tsx` - Events list
- `app/events/[id]/page.tsx` - Event detail
- `app/events/new/page.tsx` - Create event form
- `app/events/[id]/edit/page.tsx` - Edit event form
- `components/EventCard.tsx` - Event card component
- `components/EventForm.tsx` - Reusable event form
- `lib/mock-data/events.ts` - Mock event data store
- `lib/types/event.ts` - Event TypeScript types
- `lib/validation/event.ts` - Event validation schemas

### 1.4 Guest Management (CRM Core) - Mock Data

**Features:**

- Guest list CRUD operations (using mock data)
- Guest search and filtering
- Guest detail pages
- Guest contact information management
- Form validation

**Data Requirements to Document:**

- What fields are needed for guests? (name, email, company, job title, phone, address, etc.)
- What optional vs required fields?
- What data formats/validation?
- How to handle duplicate guests?

**Files to create:**

- `app/guests/page.tsx` - Guests list
- `app/guests/[id]/page.tsx` - Guest detail
- `app/guests/new/page.tsx` - Create guest form
- `components/GuestCard.tsx` - Guest card component
- `components/GuestForm.tsx` - Reusable guest form
- `components/GuestTable.tsx` - Guest table with sorting/filtering
- `lib/mock-data/guests.ts` - Mock guest data store
- `lib/types/guest.ts` - Guest TypeScript types
- `lib/validation/guest.ts` - Guest validation schemas

### 1.4a CSV/Excel Import System with Column Mapping

**Approach**: Three-stage import workflow (Upload → Map Columns → Validate/Preview) to handle variable CSV formats efficiently.

**Stage 1: File Upload & Parsing**

**Features:**

- Support multiple formats: CSV, TSV, Excel (.xlsx, .xls)
- Drag-and-drop file upload
- File size validation (max 10MB recommended)
- Auto-detect delimiter (comma, tab, semicolon)
- Auto-detect encoding (UTF-8, Windows-1252, etc.)
- Parse first few rows to detect structure
- Show file preview with detected columns

**Files to create:**

- `app/guests/import/page.tsx` - Main import page
- `components/import/FileUpload.tsx` - Drag-and-drop file upload component
- `components/import/FilePreview.tsx` - Preview parsed file structure
- `lib/services/file-parser.ts` - File parsing service (Papa Parse for CSV, xlsx for Excel)
- `lib/utils/file-utils.ts` - File validation and utilities

**Stage 2: Intelligent Column Mapping**

**Features:**

- Auto-detect column mappings using fuzzy matching
- Support common column name variations:
  - Name: "Name", "Full Name", "Guest Name", "First Name" + "Last Name"
  - Email: "Email", "E-mail", "Email Address", "Contact Email"
  - Company: "Company", "Organization", "Employer", "Business"
  - Job Title: "Title", "Job Title", "Position", "Role"
  - Phone: "Phone", "Phone Number", "Mobile", "Contact Number"
- Manual column mapping interface (drag-and-drop or dropdown)
- Mark fields as required/optional/ignore
- Handle split columns (e.g., "First Name" + "Last Name" → "Name")
- Handle combined columns (e.g., "Full Name" → split to first/last)
- Support custom field mappings

**Column Matching Algorithm:**

- Normalize column names (lowercase, remove special chars, trim)
- Use Levenshtein distance for fuzzy matching
- Match against known field patterns
- Score matches and suggest best fit
- Allow user to override auto-suggestions

**Files to create:**

- `components/import/ColumnMapper.tsx` - Column mapping interface
- `components/import/ColumnMappingRow.tsx` - Individual column mapping row
- `lib/services/column-matcher.ts` - Intelligent column matching service
- `lib/utils/string-matching.ts` - Fuzzy string matching utilities
- `lib/types/import.ts` - Import-related TypeScript types

**Stage 3: Data Validation & Preview**

**Features:**

- Real-time validation as user maps columns
- Validate data types (email format, phone format, etc.)
- Show validation errors per row
- Preview first 10-20 rows of mapped data
- Show statistics (total rows, valid rows, errors)
- Allow editing individual rows before import
- Skip/ignore rows with critical errors
- Duplicate detection (by email or name+company)

**Validation Rules:**

- Email: Valid email format, required
- Name: Non-empty, required
- Phone: Valid phone format (optional)
- Company: Optional
- Job Title: Optional

**Files to create:**

- `components/import/ImportPreview.tsx` - Data preview table
- `components/import/ValidationErrors.tsx` - Error display component
- `components/import/ImportSummary.tsx` - Import statistics
- `lib/services/data-validator.ts` - Data validation service
- `lib/utils/data-normalization.ts` - Data cleaning/normalization utilities

**Stage 4: Import Execution**

**Features:**

- Batch import with progress indicator
- Handle large files (chunk processing)
- Transaction support (rollback on critical errors)
- Import summary report
- Option to import as draft (for review)
- Skip duplicates or update existing

**Files to create:**

- `components/import/ImportProgress.tsx` - Progress indicator
- `app/api/guests/import/route.ts` - Import API endpoint
- `lib/services/import-processor.ts` - Batch import processing
- `lib/db/import-history.ts` - Track import history

**Technology Stack:**

- **CSV Parsing**: Papa Parse (browser + server-side, auto-delimiter detection)
- **Excel Parsing**: xlsx or exceljs (server-side)
- **Fuzzy Matching**: fuse.js or custom Levenshtein implementation
- **File Upload**: Vercel Blob Storage or direct to serverless function

**User Experience Flow:**

```
1. User uploads CSV/Excel file
   ↓
2. System parses file and shows detected columns
   ↓
3. System auto-matches columns to guest fields
   ↓
4. User reviews/edits column mappings
   ↓
5. System validates data and shows preview
   ↓
6. User reviews preview, fixes errors if needed
   ↓
7. User confirms import
   ↓
8. System imports data with progress tracking
   ↓
9. System shows import summary and results
```

**Error Handling:**

- Clear error messages per row
- Highlight problematic rows in preview
- Allow skipping rows with errors
- Export error report (CSV of failed rows)
- Retry failed imports

**Files to create (complete list):**

- `app/guests/import/page.tsx` - Main import page
- `components/import/FileUpload.tsx` - File upload component
- `components/import/FilePreview.tsx` - File structure preview
- `components/import/ColumnMapper.tsx` - Column mapping interface
- `components/import/ColumnMappingRow.tsx` - Column mapping row
- `components/import/ImportPreview.tsx` - Data preview
- `components/import/ValidationErrors.tsx` - Error display
- `components/import/ImportSummary.tsx` - Import statistics
- `components/import/ImportProgress.tsx` - Progress indicator
- `lib/services/file-parser.ts` - File parsing (Papa Parse + xlsx)
- `lib/services/column-matcher.ts` - Column matching logic
- `lib/services/data-validator.ts` - Data validation
- `lib/services/import-processor.ts` - Batch import processing
- `lib/utils/file-utils.ts` - File utilities
- `lib/utils/string-matching.ts` - Fuzzy matching
- `lib/utils/data-normalization.ts` - Data cleaning
- `lib/types/import.ts` - Import types
- `app/api/guests/import/route.ts` - Import API endpoint
- `lib/db/import-history.ts` - Import history tracking

### 1.5 Event-Guest Relationship Management - Mock Data

**Features:**

- Assign guests to events (UI with mock data)
- Remove guests from events
- View event guest lists
- Guest RSVP status tracking
- Guest notes per event
- Bulk assign/remove operations

**Data Requirements to Document:**

- What relationship data is needed? (RSVP status, check-in status, notes, custom fields?)
- How to handle guest statuses?
- What actions can be performed on event-guest relationships?

**Files to create:**

- `app/events/[id]/guests/page.tsx` - Event guest list
- `components/EventGuestList.tsx` - Guest list component
- `components/AssignGuestModal.tsx` - Modal for assigning guests
- `components/GuestStatusBadge.tsx` - Status indicator component
- `lib/mock-data/event-guests.ts` - Mock event-guest relationship store
- `lib/types/event-guest.ts` - Event-guest TypeScript types
- `lib/validation/event-guest.ts` - Validation schemas

### 1.6 Database Schema Design

**Based on learnings from CRM UI development, design the database schema:**

- Review all data requirements discovered during UI development
- Design normalized database schema
- Define relationships and constraints
- Plan for future features (importance scoring, supplier actions, etc.)

**Core Tables (to be refined based on CRM work):**

- `users` - Event organizers (handled by Supabase Auth)
- `organizations` - Companies/organizations
- `events` - Event details (fields determined from UI)
- `guests` - Guest information (fields determined from UI)
- `event_guests` - Junction table (fields determined from relationship management)
- `guest_metadata` - Additional guest data for importance calculation (Phase 2)

**Deliverables:**

- Database schema documentation
- SQL migration files
- TypeScript types matching database schema
- Data access layer design

**Files to create:**

- `docs/database-schema.md` - Schema documentation
- `migrations/001_initial_schema.sql` - Initial migration
- `lib/db/schema.ts` - TypeScript schema definitions
- `lib/db/index.ts` - Database connection setup

### 1.7 Database Implementation & Migration

- Set up Supabase project
- Configure PostgreSQL connection
- Run database migrations
- Set up database connection in Express backend
- Create data access layer (replace mock data with real DB calls)

**Files to create:**

- `lib/db/events.ts` - Event database operations
- `lib/db/guests.ts` - Guest database operations
- `lib/db/event-guests.ts` - Event-guest database operations
- `lib/db/organizations.ts` - Organization database operations
- Update all API routes to use database instead of mock data

### 1.8 Authentication & User Management

- Set up Supabase Auth integration
- Create user registration/login pages
- Implement role-based access control (RBAC) foundation
- User profile management
- Organization creation and management
- Multi-tenant support (users belong to organizations)
- Protect routes and API endpoints

**Files to create:**

- `app/login/page.tsx` - Login page
- `app/register/page.tsx` - Registration page
- `app/profile/page.tsx` - User profile page
- `app/api/auth/route.ts` - Auth API endpoints
- `lib/auth/supabase.ts` - Supabase client setup
- `lib/auth/middleware.ts` - Auth middleware
- `lib/db/users.ts` - User database operations
- `components/AuthGuard.tsx` - Route protection component

**Features:**

- Create, read, update, delete events
- Event dashboard/list view
- Event detail pages
- Event status management (draft, active, completed)

**Files to create:**

- `app/events/page.tsx` - Events list
- `app/events/[id]/page.tsx` - Event detail
- `app/events/new/page.tsx` - Create event
- `app/api/events/route.ts` - Events API endpoints
- `lib/db/events.ts` - Event database operations

### 1.9 API Routes Implementation

- Replace mock data API routes with real database-backed routes
- Implement proper error handling
- Add request validation
- Set up API authentication middleware

**Files to create/update:**

- `app/api/events/route.ts` - Events API endpoints
- `app/api/events/[id]/route.ts` - Single event API
- `app/api/guests/route.ts` - Guests API
- `app/api/guests/[id]/route.ts` - Single guest API
- `app/api/guests/import/route.ts` - Import endpoint (handles file upload, parsing, column mapping, validation, and batch import)
- `app/api/events/[id]/guests/route.ts` - Event-guest API
- `lib/middleware/validation.ts` - Request validation middleware
- `lib/middleware/error-handler.ts` - Error handling middleware

### 1.10 Whitelabeling & Custom Branding

**Features:**

- Custom logo upload and management
- Custom color scheme/theme customization
- Custom favicon
- Custom domain/subdomain support (optional, advanced)
- Branded email templates
- Supplier app branding (for mobile apps)
- Branded supplier portal URLs

**Whitelabel Settings:**

- Organization-level branding configuration
- Preview mode to see changes before applying
- Default branding fallback for organizations without custom branding

**Files to create:**

- `app/settings/branding/page.tsx` - Branding configuration page
- `components/branding/LogoUpload.tsx` - Logo upload component
- `components/branding/ColorPicker.tsx` - Color scheme picker
- `components/branding/BrandPreview.tsx` - Preview component
- `app/api/organizations/[id]/branding/route.ts` - Branding API endpoints
- `lib/db/organization-branding.ts` - Branding database operations
- `lib/utils/branding.ts` - Branding utilities (apply theme, get colors, etc.)
- `components/providers/BrandingProvider.tsx` - Context provider for branding
- `lib/storage/branding.ts` - Logo storage (Vercel Blob or Supabase Storage)

**Database Schema Addition:**

```sql
-- Organization Branding
CREATE TABLE organization_branding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  logo_url VARCHAR(500),
  primary_color VARCHAR(7), -- Hex color
  secondary_color VARCHAR(7),
  accent_color VARCHAR(7),
  favicon_url VARCHAR(500),
  custom_domain VARCHAR(255), -- Optional custom domain
  subdomain VARCHAR(100), -- Optional subdomain (e.g., acme.yourplatform.com)
  email_from_name VARCHAR(255), -- Custom sender name for emails
  email_from_address VARCHAR(255), -- Custom sender email
  supplier_app_name VARCHAR(255), -- Custom name for supplier mobile app
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Implementation Details:**

1. **Theme System:**

   - Use CSS variables for dynamic theming
   - Apply organization branding via context/provider
   - Fallback to default branding if none set

2. **Logo Storage:**

   - Upload logos to Vercel Blob Storage or Supabase Storage
   - Support multiple formats (PNG, SVG, JPG)
   - Image optimization and resizing

3. **Custom Domains (Advanced):**

   - DNS configuration guide for users
   - Vercel domain configuration
   - Subdomain routing (e.g., acme.yourplatform.com)

4. **Supplier App Branding:**

   - Export branding config as JSON for mobile apps
   - API endpoint for mobile apps to fetch branding
   - Dynamic app name, colors, and logo in mobile apps

**Files to update:**

- `app/layout.tsx` - Apply branding theme
- `components/layout/Header.tsx` - Use custom logo
- `components/layout/Sidebar.tsx` - Apply brand colors
- All email templates - Use custom branding
- Mobile app API - Add branding endpoint

**Note**: Can be offered as a premium feature or included in all plans. Custom domains would typically be premium/enterprise tier.

## Phase 2: Importance Algorithm

**Approach**: Start with OpenAI API for MVP (cost-effective, fast to implement), then add structured APIs (Clearbit, etc.) as a premium tier feature post-MVP.

**Pricing Strategy:**

- **Basic Tier (MVP)**: OpenAI API scoring only (~$0.0002-0.008 per guest)
- **Premium Tier (Post-MVP)**: OpenAI + structured API enrichment (Clearbit, etc.) for enhanced accuracy (~$0.36+ per guest for enrichment)

**Why OpenAI First:**

- Extremely low cost per calculation
- Fast to implement (single API integration)
- Handles complex reasoning and edge cases
- Can analyze context and relationships from notes
- Easy to iterate on prompts
- Structured outputs ensure consistent JSON responses

### 2.1 OpenAI API Integration (MVP)

**Setup:**

- Set up OpenAI API client
- Configure API keys and environment variables
- Set up rate limiting and error handling
- Implement request/response logging

**Scoring Prompt Design:**

- Create system prompt for importance analysis
- Design user prompt template with guest data
- Define scoring criteria (job title, company, industry, relationships, notes)
- Set up structured outputs for consistent JSON responses

**Importance Factors (AI will analyze):**

- Job title/seniority level
- Company size/importance
- Industry influence
- Relationship to organizer (from notes)
- Custom tags/categories
- VIP status (manual override)
- Event-specific context

**Files to create:**

- `lib/services/openai.ts` - OpenAI client setup
- `lib/services/importance-scorer.ts` - Main scoring service using OpenAI
- `lib/prompts/importance-prompt.ts` - Prompt templates
- `lib/types/scoring.ts` - TypeScript types for scoring responses
- `app/api/guests/[id]/calculate-importance/route.ts` - Calculation endpoint
- `.env.example` - Environment variable template (OPENAI_API_KEY)

**Vercel Deployment Notes:**

- Add `OPENAI_API_KEY` to Vercel environment variables
- API routes will run as serverless functions on Vercel
- Consider function timeout limits for batch operations (may need to use background jobs)

### 2.2 Scoring Implementation & Caching

**Core Features:**

- Calculate importance score (0-100) using OpenAI
- Cache scores per guest to avoid redundant API calls
- Handle API errors gracefully with fallbacks
- Support batch scoring for multiple guests
- Store reasoning/explanation with scores

**Caching Strategy:**

- Cache scores in database (guest_metadata table)
- Invalidate cache when guest data changes
- Cache key based on guest data hash
- TTL for cache (optional: refresh after X days)

**Files to create:**

- `lib/services/importance-scorer.ts` - Main scoring logic with caching
- `lib/cache/importance-cache.ts` - Caching utilities
- `lib/db/guest-metadata.ts` - Metadata storage (importance_score, reasoning, factors)
- `app/api/guests/[id]/calculate-importance/route.ts` - Single guest calculation
- `app/api/events/[id]/calculate-importance/route.ts` - Batch calculation for event

### 2.3 Batch Processing & Background Jobs

**Features:**

- Calculate scores for all guests in an event
- Background job processing for large guest lists
- Progress tracking for batch operations
- Error handling and retries
- Rate limit management

**Files to create:**

- `lib/jobs/importance-calculation.ts` - Background job handler
- `app/api/jobs/calculate-importance/route.ts` - Job trigger endpoint
- `lib/queue/` - Job queue system (BullMQ or similar)
- `lib/utils/rate-limiter.ts` - OpenAI API rate limiting

### 2.4 Prompt Configuration UI (Optional)

**Features:**

- Customize scoring prompt per event/organization
- Add event-specific context to scoring
- Preview how prompt affects scoring
- Save prompt templates

**Files to create:**

- `app/settings/scoring/page.tsx` - Prompt configuration
- `components/PromptEditor.tsx` - Prompt editing component
- `app/api/settings/scoring/route.ts` - Config API
- `lib/db/scoring-config.ts` - Config storage (prompt templates)

### 2.5 Importance Display & Sorting

**Features:**

- Display importance scores in guest lists
- Sort guests by importance
- Visual indicators (badges, colors)
- Filter by importance range

**Files to create:**

- `components/ImportanceBadge.tsx` - Score display component
- Update `components/EventGuestList.tsx` - Add sorting/filtering
- `lib/utils/importance-helpers.ts` - Helper functions

### 2.6 Premium Tier: Structured API Integration (Post-MVP)

**Note**: This will be added as a premium feature after MVP launch.

**Approach:**

- Integrate Clearbit or similar APIs for data enrichment
- Use enriched data to improve OpenAI scoring accuracy
- Offer as premium tier feature (higher subscription plan)
- Fallback to OpenAI-only scoring for basic tier

**Features:**

- Automatic data enrichment (company size, revenue, employee count)
- Enhanced scoring with enriched data
- Data quality indicators
- Manual enrichment triggers

**Files to create (future):**

- `lib/services/data-enrichment.ts` - Data enrichment service (Clearbit, etc.)
- `lib/services/enhanced-scorer.ts` - Scoring with enriched data
- `app/api/guests/enrich/route.ts` - Enrichment endpoint
- `lib/db/enrichment-cache.ts` - Cache enriched data
- `components/EnrichmentStatus.tsx` - Show data quality
- `app/settings/enrichment/page.tsx` - Enrichment settings (premium)

## Phase 3: Supplier Mobile Apps (Expo)

### 3.1 Expo Project Setup

- Initialize Expo project with TypeScript
- Set up project structure
- Configure navigation (React Navigation)
- Set up API client for backend communication
- Configure environment variables
- Set up authentication flow

**Files to create:**

- `mobile-app/` - Root directory
- `mobile-app/app.json` - Expo configuration
- `mobile-app/package.json` - Dependencies
- `mobile-app/src/api/client.ts` - API client
- `mobile-app/src/config/env.ts` - Environment config

### 3.2 Authentication & Authorization

**Features:**

- Login/logout functionality
- Token management
- Role-based access (supplier role)
- Secure storage for credentials
- Fetch organization branding on login (for whitelabeling)

**Files to create:**

- `mobile-app/src/screens/Auth/LoginScreen.tsx`
- `mobile-app/src/screens/Auth/RegisterScreen.tsx`
- `mobile-app/src/services/auth.ts` - Auth service
- `mobile-app/src/context/AuthContext.tsx` - Auth context
- `mobile-app/src/utils/secure-storage.ts` - Secure storage
- `mobile-app/src/services/branding.ts` - Fetch organization branding
- `mobile-app/src/context/BrandingContext.tsx` - Branding context for app theming

### 3.3 Event & Guest List Views

**Features:**

- List of assigned events
- Event detail view
- Guest list for selected event
- Sort by importance
- Search and filter guests
- Pull-to-refresh

**Files to create:**

- `mobile-app/src/screens/Events/EventsListScreen.tsx`
- `mobile-app/src/screens/Events/EventDetailScreen.tsx`
- `mobile-app/src/screens/Guests/GuestListScreen.tsx`
- `mobile-app/src/components/GuestCard.tsx`
- `mobile-app/src/components/ImportanceIndicator.tsx`
- `mobile-app/src/navigation/AppNavigator.tsx`

### 3.4 Guest Check-off Functionality

**Features:**

- Mark guests as "completed" (photographed, greeted, etc.)
- Add notes per guest
- Timestamp tracking
- Visual feedback (checked/unchecked)
- Bulk actions

**Files to create:**

- `mobile-app/src/screens/Guests/GuestDetailScreen.tsx`
- `mobile-app/src/components/CheckOffButton.tsx`
- `mobile-app/src/services/guest-status.ts` - Status update service
- `app/api/suppliers/guests/[id]/check-off/route.ts` - Check-off API endpoint
- `lib/db/supplier-actions.ts` - Track supplier actions

### 3.5 Real-time Updates

**Features:**

- Real-time sync of guest status
- Notifications when organizer updates guest list
- Offline support with sync

**Files to create:**

- `mobile-app/src/services/realtime.ts` - Real-time service
- `app/api/events/[id]/guests/stream/route.ts` - SSE endpoint (optional)
- `mobile-app/src/hooks/useRealtimeGuests.ts` - Real-time hook

### 3.6 Supplier Dashboard

**Features:**

- Progress tracking (X of Y guests completed)
- Statistics per event
- Quick actions

**Files to create:**

- `mobile-app/src/screens/Dashboard/SupplierDashboard.tsx`
- `mobile-app/src/components/ProgressCard.tsx`
- `mobile-app/src/services/stats.ts` - Statistics service

### 3.7 Backend API Extensions for Suppliers

**Features:**

- Supplier-specific endpoints
- Check-off status tracking
- Supplier action history
- Real-time status updates

**Files to create:**

- `app/api/suppliers/route.ts` - Supplier management
- `app/api/suppliers/events/route.ts` - Supplier's events
- `app/api/suppliers/guests/[id]/check-off/route.ts` - Check-off endpoint
- `app/api/suppliers/branding/route.ts` - Fetch organization branding for supplier apps
- `lib/db/supplier-actions.ts` - Action tracking
- `lib/middleware/supplier-auth.ts` - Supplier authentication middleware

## Future Phases (Not in Initial Scope)

### Phase 4: Role Management

- Role creation and assignment (Photographer, Videographer, Greeter, etc.)
- Permission system
- Role-based UI customization

### Phase 5: Payment Integration

- Stripe integration
- Subscription plans (Basic: OpenAI scoring, Premium: + structured API enrichment + whitelabeling)
- Billing management
- Usage-based pricing
- Feature gating (premium tier gets Clearbit/enrichment APIs, custom domains, advanced whitelabeling)

### Phase 6: Web App Enhancements

- Real-time dashboard for organizers
- Supplier activity monitoring
- Analytics and reporting
- Export functionality

### Phase 7: Advanced Features

- Guest photo upload and matching
- QR code check-in
- Email notifications
- Calendar integration

## Database Schema Details

```sql
-- Waitlist (Phase 0)
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  referral_source VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  notified_at TIMESTAMP, -- When they were notified about launch
  converted_at TIMESTAMP -- When they signed up for the product
);

CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Organization Branding (Whitelabeling)
CREATE TABLE organization_branding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  logo_url VARCHAR(500),
  primary_color VARCHAR(7), -- Hex color
  secondary_color VARCHAR(7),
  accent_color VARCHAR(7),
  favicon_url VARCHAR(500),
  custom_domain VARCHAR(255), -- Optional custom domain
  subdomain VARCHAR(100), -- Optional subdomain (e.g., acme.yourplatform.com)
  email_from_name VARCHAR(255), -- Custom sender name for emails
  email_from_address VARCHAR(255), -- Custom sender email
  supplier_app_name VARCHAR(255), -- Custom name for supplier mobile app
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  date TIMESTAMP,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Guests
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  company VARCHAR(255),
  job_title VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event Guests (Junction)
CREATE TABLE event_guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  rsvp_status VARCHAR(50) DEFAULT 'pending',
  check_in_status VARCHAR(50) DEFAULT 'not_checked_in',
  importance_score DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, guest_id)
);

-- Guest Metadata (for importance calculation and caching)
CREATE TABLE guest_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  -- OpenAI scoring results (cached)
  importance_score DECIMAL(5,2), -- 0-100 score
  importance_reasoning TEXT, -- AI explanation of score
  importance_factors JSONB, -- {jobTitle: 90, companySize: 80, ...}
  importance_calculated_at TIMESTAMP, -- When score was last calculated
  importance_data_hash VARCHAR(64), -- Hash of guest data used for cache invalidation
  -- Optional enrichment data (for premium tier)
  linkedin_url VARCHAR(500),
  social_followers INTEGER,
  company_size INTEGER,
  company_revenue BIGINT,
  industry VARCHAR(100),
  custom_tags TEXT[],
  vip_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Supplier Actions (check-off tracking)
CREATE TABLE supplier_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id),
  guest_id UUID REFERENCES guests(id),
  supplier_id UUID REFERENCES auth.users(id),
  action_type VARCHAR(50), -- 'photographed', 'greeted', 'videoed', etc.
  completed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- Scoring Configuration (prompt templates for OpenAI)
CREATE TABLE scoring_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  event_id UUID REFERENCES events(id), -- NULL for org-wide config
  prompt_template TEXT, -- Custom prompt template for OpenAI
  system_prompt TEXT, -- System prompt for OpenAI
  model VARCHAR(50) DEFAULT 'gpt-4o-mini', -- OpenAI model to use
  temperature DECIMAL(3,2) DEFAULT 0.0, -- For consistency
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Import History (track CSV/Excel imports)
CREATE TABLE import_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  event_id UUID REFERENCES events(id), -- NULL if importing to general guest list
  user_id UUID REFERENCES auth.users(id),
  file_name VARCHAR(255),
  file_type VARCHAR(50), -- 'csv', 'xlsx', 'xls', 'tsv'
  total_rows INTEGER,
  imported_rows INTEGER,
  failed_rows INTEGER,
  column_mapping JSONB, -- Store the column mapping used
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  error_log TEXT, -- Store errors for failed rows
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_import_history_org ON import_history(organization_id);
CREATE INDEX idx_import_history_event ON import_history(event_id);
CREATE INDEX idx_import_history_user ON import_history(user_id);
```

## Development Workflow

### Phase 0 (Landing Page & Waitlist) - Launch First

1. **Build Landing Page**: Create a simple, beautiful landing page to capture early interest

   - Fast to implement and deploy
   - Start collecting emails immediately
   - Establishes Supabase connection early (just for waitlist)
   - Can be deployed and shared while building the main product

2. **Waitlist Functionality**: Simple email capture with Supabase

   - Minimal database setup (just waitlist table)
   - Introduces Supabase early without complexity
   - Provides early validation and user interest metrics

### Phase 1 (CRM) - Iterative Approach

1. **Build CRM UI First**: Create all event and guest management interfaces using mock data

   - This helps identify all data requirements naturally
   - Allows for rapid UI/UX iteration without database constraints
   - Documents exactly what fields and relationships are needed

2. **Design Database Schema**: Based on the CRM UI work, design the database schema

   - Ensures schema matches actual requirements
   - Reduces need for schema changes later
   - Better understanding of relationships and constraints

3. **Implement Database & Migrate**: Set up database and replace mock data with real persistence

   - Migrate mock data structures to database schema
   - Implement data access layer
   - Update API routes to use database

4. **Add Authentication**: Implement auth after data layer is stable

   - Protects the application
   - Enables multi-user and multi-tenant features

### Phase 2 (Algorithm)

- Implement and refine importance scoring based on guest data structure

### Phase 3 (Mobile)

- Create supplier mobile apps with check-off functionality

Each phase should be tested and deployed incrementally before moving to the next.

## Vercel Deployment Strategy

### Initial Setup (Phase 0)

- Deploy landing page to Vercel
- Configure environment variables (Supabase)
- Set up automatic deployments from GitHub
- Enable preview deployments for pull requests

### Environment Variables (Add as needed per phase)

**Phase 0:**

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

**Phase 1:**

- (Same as Phase 0, Supabase already configured)

**Phase 2:**

- `OPENAI_API_KEY` - For importance scoring

**Phase 5 (Future):**

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Vercel-Specific Considerations

**API Routes:**

- All API routes in `app/api/` automatically become serverless functions
- Function timeout: 10 seconds (Hobby), 60 seconds (Pro), 300 seconds (Enterprise)
- For long-running batch jobs (importance calculation), consider:
  - Breaking into smaller chunks
  - Using Vercel Cron Jobs for scheduled tasks
  - Using external job queue (if needed)

**Database Connections:**

- Use Supabase connection pooling for serverless functions
- Configure Supabase connection string for serverless environments
- Consider connection limits with high concurrency

**File Uploads:**

- Use Vercel Blob Storage or Supabase Storage for file uploads (CSV imports, etc.)
- API routes have 4.5MB request body limit (Hobby/Pro)

**Monitoring:**

- Use Vercel Analytics for performance monitoring
- Set up Vercel Logs for debugging
- Configure error tracking (Sentry, etc.)

### Deployment Workflow

1. **Development**: Work locally with `.env.local`
2. **Preview**: Automatic preview deployments on pull requests
3. **Staging**: Deploy to preview branch for testing
4. **Production**: Deploy to main branch (automatic)

### Custom Domain Setup

- Configure custom domain in Vercel dashboard
- Update `NEXT_PUBLIC_APP_URL` environment variable
- SSL certificates automatically provisioned by Vercel

## Implementation Roadmap

This roadmap provides a structured timeline for stress testing and product-market fit validation activities, aligned with the development phases.

### Stress Testing Implementation Timeline

#### Week 1-2: Setup Testing Infrastructure

**Objectives:**

- Set up load testing tools and frameworks
- Configure monitoring and observability
- Create test data generators
- Set up staging environment

**Tasks:**

- [ ] Choose and configure load testing tool (k6, Artillery, or Locust)
- [ ] Set up Vercel Analytics for performance monitoring
- [ ] Configure error tracking (Sentry or similar)
- [ ] Set up Supabase dashboard monitoring
- [ ] Create test data generators for events, guests, and relationships
- [ ] Set up staging environment matching production
- [ ] Configure CI/CD pipeline for automated testing

**Deliverables:**

- Load testing scripts framework
- Monitoring dashboards configured
- Test data generation utilities
- Staging environment ready

#### Week 3-4: Phase 0 Stress Tests

**Objectives:**

- Validate landing page performance under load
- Test waitlist API scalability
- Ensure database performance with high waitlist volume

**Test Scenarios:**

- [ ] Concurrent signups: 100-1000 simultaneous waitlist submissions
- [ ] Traffic spike: 10,000 visitors/hour simulation
- [ ] Database load: 50,000+ waitlist entries
- [ ] API rate limiting: Duplicate email handling under load

**Success Criteria:**

- Page load time < 2 seconds under normal load
- Page load time < 5 seconds under 10x load
- Zero failed waitlist submissions (with proper error handling)
- Database queries < 100ms p95

**Tasks:**

- [ ] Create landing page load test scripts
- [ ] Create waitlist API stress test scripts
- [ ] Run baseline performance tests
- [ ] Identify and fix bottlenecks
- [ ] Document performance benchmarks

#### Week 5-6: Phase 1 Stress Tests

**Objectives:**

- Validate CRM platform performance
- Test event and guest management under load
- Ensure CSV import handles large files efficiently

**Test Scenarios:**

- [ ] Event Management:
  - Create 1,000 events simultaneously
  - Load dashboard with 10,000 events
  - Bulk operations (delete 100 events at once)
  - Concurrent edits to same event
- [ ] Guest Management:
  - Import 50,000 guests via CSV
  - Search/filter 100,000+ guests
  - Bulk assign 5,000 guests to event
  - Real-time updates with 100 concurrent users
- [ ] Database Stress:
  - Complex queries with joins across 5+ tables
  - Index performance with millions of records
  - Connection pooling limits (Supabase: 200 connections)
  - Transaction deadlocks under high concurrency

**Success Criteria:**

- Event CRUD operations < 500ms p95
- Guest search < 1 second for 100K+ records
- CSV import: 1,000 guests/second
- Zero data loss during concurrent operations
- Database connection pool utilization < 80%

**Tasks:**

- [ ] Create event management load test scripts
- [ ] Create guest management stress test scripts
- [ ] Create CSV import performance tests
- [ ] Test database query performance
- [ ] Optimize slow queries and add indexes
- [ ] Test concurrent user scenarios

#### Week 7-8: Phase 2 Stress Tests

**Objectives:**

- Validate OpenAI API integration under load
- Test batch scoring performance and cost optimization
- Ensure caching strategy effectiveness

**Test Scenarios:**

- [ ] OpenAI API Integration:
  - Batch score 10,000 guests simultaneously
  - Rate limit handling (OpenAI: 3,500 RPM for gpt-4o-mini)
  - Cost optimization (cache hit rate > 80%)
  - Error recovery (API failures, timeouts)
- [ ] Batch Processing:
  - Process 50,000 guests in background jobs
  - Progress tracking accuracy
  - Job queue management (BullMQ/Redis)
  - Memory usage during batch operations
- [ ] Caching Strategy:
  - Cache invalidation on guest updates
  - Cache warming for frequently accessed guests
  - Cache size limits and eviction policies

**Success Criteria:**

- Single guest scoring < 3 seconds
- Batch scoring: 100 guests/minute (rate-limited)
- Cache hit rate > 80% after warm-up
- Cost per guest < $0.01 (with caching)
- Zero failed scores (with retry logic)

**Tasks:**

- [ ] Create OpenAI API stress test scripts
- [ ] Test rate limiting and error handling
- [ ] Validate caching effectiveness
- [ ] Test batch processing with large datasets
- [ ] Monitor API costs under load
- [ ] Optimize prompt efficiency

#### Week 9-10: Phase 3 Stress Tests

**Objectives:**

- Validate mobile app performance
- Test real-time sync under load
- Ensure offline mode reliability

**Test Scenarios:**

- [ ] Mobile App Load:
  - 500 suppliers checking off guests simultaneously
  - Real-time sync with 1,000 active connections
  - Offline mode with 1,000+ queued actions
  - Push notifications to 10,000 devices

**Success Criteria:**

- Check-off action < 500ms
- Real-time sync latency < 2 seconds
- Offline sync: 100% success rate
- App crash rate < 0.1%

**Tasks:**

- [ ] Create mobile app load test scripts
- [ ] Test real-time sync performance
- [ ] Validate offline mode functionality
- [ ] Test push notification delivery
- [ ] Monitor mobile app stability

### Product-Market Fit Validation Timeline

#### Month 1-2: Waitlist Phase Validation

**Objectives:**

- Build waitlist of 1,000+ potential customers
- Validate value proposition
- Generate early buzz and interest

**Key Activities:**

- [ ] Launch landing page with clear value proposition
- [ ] Drive traffic via:
  - Product Hunt launch
  - LinkedIn ads targeting event managers
  - Reddit (r/eventplanning, r/marketing)
  - Twitter/X outreach
- [ ] Collect email engagement data
- [ ] Survey waitlist users about pain points

**Success Criteria:**

- 1,000+ waitlist signups in first month
- > 5% conversion rate (visitors to signups)
- > 30% open rate on waitlist emails
- Landing page conversion rate > 3%

**Metrics to Track:**

- Landing page conversion rate
- Traffic sources and quality
- Email engagement (opens, clicks)
- Waitlist growth rate

#### Month 3-4: MVP Launch and Validation

**Objectives:**

- Convert 30% of waitlist to trial users
- Achieve 20% trial-to-paid conversion
- Get 10 paying customers
- Validate core value proposition

**Key Activities:**

- [ ] Launch Phase 1 (CRM) to waitlist users
- [ ] Offer 30-day free trial
- [ ] Track usage and engagement
- [ ] Conduct user interviews after 2 weeks (10+ users)
- [ ] Measure Sean Ellis Test (40% rule)
- [ ] Onboarding webinars
- [ ] Collect user feedback

**Success Criteria:**

- > 50% of waitlist users try the product
- > 30% become paying customers
- > 40% "very disappointed" if product removed (Sean Ellis Test)
- Week 1 retention > 60%
- NPS > 40

**Metrics to Track:**

- Trial-to-paid conversion rate
- Feature usage patterns
- User feedback scores
- Retention rates (Week 1, Week 4)
- Time to first value

#### Month 5-6: Feature Validation

**Objectives:**

- Validate importance scoring provides actionable value
- Measure time saved and user satisfaction
- Refine product based on feedback

**Key Activities:**

- [ ] Launch Phase 2 (importance scoring)
- [ ] A/B test: Events with vs. without importance scoring
- [ ] Measure time saved per event
- [ ] Validate guest prioritization accuracy
- [ ] Collect NPS scores
- [ ] Iterate on scoring algorithm based on feedback

**Success Criteria:**

- > 70% of users enable importance scoring
- Users report > 2 hours saved per event
- > 80% accuracy in identifying VIPs (user validation)
- Feature adoption rate > 70%
- NPS > 50

**Metrics to Track:**

- Importance scoring adoption rate
- Time saved per event (self-reported)
- Scoring accuracy (user validation)
- Feature usage frequency
- User satisfaction scores

#### Month 7-8: Scale Validation

**Objectives:**

- Validate mobile app adoption
- Measure retention and churn
- Calculate unit economics
- Prepare for growth

**Key Activities:**

- [ ] Launch Phase 3 (mobile apps)
- [ ] Launch mobile app to 10 events
- [ ] Track supplier adoption and usage
- [ ] Measure retention (Week 1, 4, 12)
- [ ] Calculate LTV and churn
- [ ] Optimize onboarding flow
- [ ] Refine pricing strategy

**Success Criteria:**

- > 50% of suppliers download and use app
- > 80% check-off completion rate
- > 4.0/5.0 app store rating
- Month 3 retention > 30%
- Churn rate < 5%/month
- LTV:CAC > 12:1

**Metrics to Track:**

- Mobile app adoption rate
- Supplier engagement metrics
- Retention rates (Week 1, 4, 12)
- Churn rate
- LTV and CAC
- App store ratings

### Success Criteria Checklist

#### Technical Success Metrics

**Performance:**

- [ ] 99.9% uptime (8.76 hours downtime/year)
- [ ] Error rate < 0.1% of requests
- [ ] API latency (p95) < 500ms
- [ ] Database query time (p95) < 100ms
- [ ] Mobile app crash rate < 0.1%
- [ ] Page load time < 2 seconds (normal load)
- [ ] Page load time < 5 seconds (10x load)

**Scalability:**

- [ ] Handles 10x normal load without degradation
- [ ] Database connection pool utilization < 80%
- [ ] CSV import: 1,000 guests/second
- [ ] Batch scoring: 100 guests/minute
- [ ] Real-time sync latency < 2 seconds
- [ ] Supports 1,000+ concurrent users

**Reliability:**

- [ ] Zero data loss during concurrent operations
- [ ] 100% offline sync success rate
- [ ] Cache hit rate > 80% (importance scoring)
- [ ] Zero failed scores (with retry logic)
- [ ] Graceful error handling and recovery

#### Product Success Metrics

**Engagement:**

- [ ] DAU/MAU ratio > 20%
- [ ] Events created per user per month > 2
- [ ] Guests managed per event > 50
- [ ] Importance scores calculated for > 80% of guests

**Adoption:**

- [ ] Importance scoring adoption > 70%
- [ ] Mobile app adoption > 50% of events
- [ ] CSV import usage > 80%
- [ ] Feature discovery rate > 60%

**Retention:**

- [ ] Week 1 retention > 60%
- [ ] Week 4 retention > 40%
- [ ] Month 3 retention > 30%
- [ ] Churn rate < 5%/month

**Satisfaction:**

- [ ] NPS > 50
- [ ] > 40% "very disappointed" if product removed (Sean Ellis Test)
- [ ] App store rating > 4.0/5.0
- [ ] User-reported time saved > 5 hours/event

#### Business Success Metrics

**Growth:**

- [ ] 100 paying customers (Month 4)
- [ ] $10K MRR (Month 4)
- [ ] Monthly recurring revenue growth > 20%
- [ ] Organic growth rate > 10%/month
- [ ] Referral rate > 20% of new users

**Unit Economics:**

- [ ] Customer Acquisition Cost (CAC) < $100
- [ ] Lifetime Value (LTV) > $1,200 (12 months @ $99/month)
- [ ] LTV:CAC ratio > 12:1
- [ ] Payback period < 3 months

**Conversion:**

- [ ] Waitlist conversion > 30%
- [ ] Trial-to-paid conversion > 20%
- [ ] Landing page conversion > 3%
- [ ] Feature-to-paid conversion > 15%

**Market Validation:**

- [ ] 1,000+ waitlist signups (Month 2)
- [ ] > 5% visitor-to-signup conversion
- [ ] > 30% email open rate
- [ ] Product-market fit score > 40% (Sean Ellis Test)