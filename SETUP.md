# NationLovers 🇦🇺 — Setup Guide

## Pre-requisites

Before running the project, install:

1. **Node.js 20 LTS** → https://nodejs.org/en/download
   - Choose "Windows Installer (.msi) 64-bit"
   - Restart your terminal/PowerShell after install
   - Verify: `node --version` (should show v20.x.x)

2. **PostgreSQL 16** → https://www.postgresql.org/download/windows/
   - Choose the EDB installer
   - Set a password for the `postgres` superuser during install (remember it!)
   - Leave port as 5432
   - Verify: open pgAdmin or run `psql -U postgres`

---

## Step 1 — Install Dependencies

Open PowerShell in the project folder:

```powershell
cd "c:\Users\dbhog\OneDrive\Desktop\nationlovers au\Nation Lovers"
npm install
```

---

## Step 2 — Create the Database

Open pgAdmin (installed with PostgreSQL) or run in PowerShell:

```powershell
psql -U postgres
```

Then run these SQL commands:

```sql
CREATE DATABASE nationlovers;
CREATE USER nationlovers_user WITH PASSWORD 'nl_secure_2024';
GRANT ALL PRIVILEGES ON DATABASE nationlovers TO nationlovers_user;
\c nationlovers
GRANT ALL ON SCHEMA public TO nationlovers_user;
\q
```

---

## Step 3 — Configure Environment

Copy the example env file:

```powershell
Copy-Item .env.example .env
```

Then generate a NEXTAUTH_SECRET:

```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Edit `.env` and fill in:
```
DATABASE_URL="postgresql://nationlovers_user:nl_secure_2024@localhost:5432/nationlovers"
NEXTAUTH_SECRET="<paste the base64 value from above>"
NEXTAUTH_URL="http://localhost:3001"
UPLOADTHING_SECRET="sk_live_your_key_here"
UPLOADTHING_APP_ID="your-app-id-here"
```

> **Note:** UploadThing is optional for photo uploads. The platform works without it — just skip photo uploads. Get a free key at https://uploadthing.com if you want photo upload functionality.

---

## Step 4 — Run Database Migration

```powershell
npx prisma migrate dev --name init
```

This creates all the tables defined in `prisma/schema.prisma`.

---

## Step 5 — Seed the Database

```powershell
npx prisma db seed
```

This populates:
- 10 users (1 admin, 2 experts, 3 volunteers, 4 citizens)
- 20 realistic Australian issues across all 9 categories
- 10 detailed solution suggestions
- Comments and votes

**Test credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nationlovers.au | Admin1234! |
| Expert | sarah.chen@expert.au | Password123! |
| Volunteer | priya.sharma@vol.au | Password123! |
| Citizen | michael.obrien@citizen.au | Password123! |

---

## Step 6 — Start the Dev Server

```powershell
npm run dev
```

Open your browser at: **http://localhost:3001**

---

## What You'll See

- **Homepage** — Hero banner, Live Pulse Bar, Issue Cards, Trending Panel, Suggestion Box preview, Australia Identity section
- **Issues** → `/issues` — Browse all issues with filters
- **Issue detail** → `/issues/[id]` — Full issue with solutions, comments, progress tracker
- **Report** → `/report` — 3-step form to report a new issue (requires login)
- **Suggest** → `/suggest` — Submit a solution (requires login)
- **Trending** → `/trending` — Top 20 issues with category breakdown chart
- **Join** → `/join` — Three membership tier cards
- **Admin** → `/admin` — Stats dashboard and issue moderation (admin login required)
- **Login/Register** → `/login` and `/register`

---

## Build for Production

```powershell
npm run build
npm start
```

---

## Database Management

```powershell
# View the database in a browser UI
npx prisma studio

# Reset database (caution: deletes all data)
npx prisma migrate reset

# Re-run seed after reset
npx prisma db seed
```

---

## Folder Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (main)/          # Issues, Report, Suggest, Trending, Join
│   ├── admin/           # Admin panel
│   ├── api/             # All API routes
│   └── page.tsx         # Homepage
├── components/
│   ├── ui/              # Button, Badge, Card, Input, Select, Spinner
│   ├── layout/          # Header, Footer
│   ├── home/            # HeroSection, LivePulseBar, IssueCard, TrendingPanel, etc.
│   └── issues/          # VoteButton, SuggestionList, CommentThread, IssueProgressTracker
├── lib/                 # Prisma, auth, constants, utils, validations, pulse-data
└── types/               # TypeScript types
prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Demo data
```
