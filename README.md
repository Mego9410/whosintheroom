# Event Guest Management SaaS

A SaaS platform for event organizers to manage guest lists, analyze guest importance, and coordinate with suppliers.

## Technology Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript
- **Backend**: Next.js API Routes (serverless functions on Vercel)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (create one at https://supabase.com)

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at https://supabase.com
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                   # Utility libraries
│   └── supabase/         # Supabase client setup
├── components/            # React components (to be created)
├── migrations/           # Database migrations (to be created)
└── public/               # Static assets
```

## Development Phases

- **Phase 0**: Landing Page & Waitlist (Current)
- **Phase 1**: CRM Management Platform
- **Phase 2**: Importance Algorithm
- **Phase 3**: Supplier Mobile Apps

## Deployment

This project is configured for deployment on Vercel. See the plan document for detailed deployment instructions.

## License

Private - All rights reserved
