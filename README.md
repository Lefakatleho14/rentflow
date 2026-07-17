# RentFlow

A property and rental management platform for landlords, property managers, and tenants - track properties, leases, payments, and maintenance requests from one place.

## Features

- **Authentication** - email/password signup and login with role-based access (landlord/tenant)
- **Property management** - full CRUD with image galleries, search, filtering, sorting, and pagination
- **Tenant management** - invite-by-email leasing with automatic account linking on registration
- **Payments** - record, confirm, and track rent payments; tenants can upload proof of payment
- **Maintenance requests** - tenants submit issues with photos; landlords assign, update, and resolve
- **Dashboard** - role-aware overview with income charts, occupancy stats, and lease expiry alerts
- **Real-time notifications** - live in-app alerts for new requests, status changes, and payment confirmations
- **Profile management** - editable details, avatar upload, password change

## Tech stack

**Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM, React Hook Form, Zod, Recharts, React Hot Toast, Heroicons

**Backend:** Supabase (PostgreSQL, Authentication, Row Level Security, Storage, Realtime)

## Getting started

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) account

### Installation

```bash
git clone <your-repo-url>
cd rentflow
npm install
```

### Supabase setup

1. Create a new Supabase project.
2. In **Project Settings → API**, copy your Project URL and Publishable key.
3. Copy `.env.example` to `.env` and fill in your values:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

4. Run the SQL migrations in the Supabase SQL Editor, in this order:
   - Profiles table, roles, and auth trigger
   - Properties and property images
   - Leases (tenant management)
   - Payments
   - Maintenance requests and images
   - Notifications and triggers
5. Create the following Storage buckets: `property-images` (public), `payment-proofs` (private), `maintenance-images` (private), `avatars` (public). Apply the corresponding storage policies from the SQL migrations.
6. Enable Realtime on the `notifications` table:

```sql
alter publication supabase_realtime add table notifications;
```

7. Ensure `authenticated` role grants are applied to every table (select/insert/update/delete as appropriate) - Supabase does not auto-expose new tables when "Automatically expose new tables" is disabled at project creation.

### Running locally

```bash
npm run dev
```

Visit `http://localhost:5173`.

## Folder structure

```
src/
  components/    Reusable UI components
  layouts/       Page shells (sidebar + content wrapper)
  pages/         Route-level page components
  hooks/         Custom hooks (useAuth, useProfile)
  context/       React context providers
  services/      Supabase data-access functions
  lib/           Validation schemas and Supabase client
  constants/     Shared option lists
  routes/        Router configuration
```

## Security notes

- Row Level Security (RLS) is enabled on every table; policies scope data access by role and ownership (e.g. landlords only see their own properties, tenants only see their own leases and payments).
- Landlord-only actions (creating properties, leases, and payments) are enforced at the database level with a role check, not just in the frontend.
- Private storage buckets (`payment-proofs`, `maintenance-images`) use signed URLs with a 1-hour expiry rather than public links.
- The `service_role` key is never used in the frontend; only the publishable (anon-equivalent) key is exposed to the browser.

## Deployment

Frontend is deployed to [Vercel](https://vercel.com). Add the same environment variables from `.env` in your Vercel project settings before deploying.

Deployment link - https://rentflow-app-sepia.vercel.app/login

## Future improvements

- Scheduled lease-expiry notifications (requires a scheduled job, e.g. `pg_cron` or a Supabase Edge Function)
- TanStack Table for sortable/filterable data tables on Payments and Maintenance
- Automatic overdue-payment detection based on due dates
- Email notifications alongside in-app notifications
- Property detail pages separate from the edit modal
