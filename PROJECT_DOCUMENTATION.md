# Sweet Shop Management System

## Overview
A full-stack web application for managing a sweet shop with user authentication, inventory management, purchasing system, and admin controls. Built with Next.js 16, Supabase, and TypeScript.

## Features

### User Features
- **Authentication**: Secure email/password signup and login with Supabase Auth
- **Browse Sweets**: View available sweets with images, descriptions, and pricing
- **Search & Filter**: Search by name and filter by category (Chocolate, Candy, Gummies, Hard Candy, Lollipops)
- **Purchase System**: Buy sweets with real-time inventory updates
- **Purchase History**: Track all previous orders with timestamps and quantities

### Admin Features
- **Inventory Management**: Add, edit, and delete sweets from the catalog
- **Stock Control**: Update quantities and pricing
- **Purchase Dashboard**: View all customer orders with revenue tracking
- **User Management**: Monitor transactions across all users

## Technology Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19.2** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components

### Backend
- **Supabase** for authentication and database
- **PostgreSQL** with Row Level Security (RLS)
- **Server Actions** for data mutations
- **Middleware** for route protection

## Architecture

### Database Schema

**profiles table**
- `id` (UUID, FK to auth.users)
- `email` (text)
- `full_name` (text)
- `role` (text: 'user' or 'admin')
- `created_at` (timestamp)

**sweets table**
- `id` (UUID, PK)
- `name` (text)
- `description` (text)
- `price` (decimal)
- `category` (text)
- `stock` (integer)
- `image_url` (text)
- `created_at` (timestamp)

**purchases table**
- `id` (UUID, PK)
- `user_id` (UUID, FK to profiles)
- `sweet_id` (UUID, FK to sweets)
- `quantity` (integer)
- `total_price` (decimal)
- `purchased_at` (timestamp)

### Authentication Flow

1. **Signup Process**
   - User submits email, password, and full name
   - Supabase Auth creates auth.users entry
   - Database trigger automatically creates profile record
   - Fallback: Client-side profile creation if trigger fails
   - Email confirmation sent (optional in dev mode)

2. **Login Process**
   - Credentials validated via Supabase Auth
   - Profile existence verified
   - Session cookie set via middleware
   - User redirected to dashboard

3. **Session Management**
   - Middleware refreshes tokens on each request
   - Protected routes check authentication status
   - Admin routes verify role='admin'

### Key Components

**Client-Side (`lib/supabase/client.ts`)**
- Singleton pattern prevents multiple GoTrueClient instances
- Used in Client Components for auth operations
- Handles signup, login, logout

**Server-Side (`lib/supabase/server.ts`)**
- Creates server client with cookies
- Used in Server Components and Route Handlers
- Accesses user session and database

**Middleware (`proxy.ts`)**
- Refreshes auth tokens on every request
- Redirects unauthenticated users from protected routes
- Prevents authenticated users from accessing auth pages

### Security Features

**Row Level Security (RLS) Policies**
- Users can only read their own profile
- Users can only view their own purchases
- Admins can view all data
- All users can read sweets catalog
- Only admins can modify sweets inventory

**Profile Auto-Creation**
- Database trigger on auth.users insert
- Multiple fallback mechanisms ensure profile exists
- Prevents "user not found" errors

## Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account and project

### Environment Variables
Already configured in v0 workspace:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

### Database Setup

1. Run SQL scripts in order:
   \`\`\`
   scripts/001-create-tables.sql    # Creates tables and RLS policies
   scripts/002-seed-data.sql        # Adds sample sweets
   scripts/004-fix-auth-trigger.sql # Ensures profile creation
   \`\`\`

2. Create first admin user:
   - Visit `/setup-admin` page
   - Or manually update profile: `UPDATE profiles SET role='admin' WHERE email='your@email.com'`

### Running Locally
The app runs automatically in v0 preview. To deploy:
1. Click "Publish" button in v0
2. Deploy to Vercel
3. Connect Supabase integration
4. Run database migrations

## Core Processes

### Purchase Flow
1. User selects sweet and quantity
2. Client validates stock availability
3. Server Action creates purchase record
4. Database trigger decrements stock
5. Purchase appears in user's history
6. Admin sees transaction in dashboard

### Inventory Management
1. Admin navigates to Admin panel
2. Adds/edits sweet with form validation
3. Server Action updates sweets table
4. Changes reflect immediately for all users
5. Stock warnings shown for low inventory

### Search & Filter
1. Client-side state manages search query
2. Filter by category (multi-select)
3. Real-time filtering without page reload
4. Results update as user types
5. Empty states for no results

## File Structure
\`\`\`
app/
├── auth/login/          # Login page
├── auth/signup/         # Signup page
├── dashboard/           # User dashboard
├── admin/               # Admin panel
├── setup-admin/         # Admin creation utility
components/
├── sweets-list.tsx      # Sweet cards with purchase
├── purchase-dialog.tsx  # Purchase modal
├── purchase-history.tsx # Order history
├── admin-sweets.tsx     # Inventory management
├── admin-purchases.tsx  # Sales dashboard
lib/
├── supabase/           # Supabase clients
├── types.ts            # TypeScript definitions
├── actions.ts          # Server Actions
scripts/
├── 001-create-tables.sql
├── 002-seed-data.sql
├── 004-fix-auth-trigger.sql
\`\`\`

## Design System
- **Primary Color**: Soft pink (#f472b6) - warm and inviting
- **Accent Color**: Purple (#a855f7) - playful and sweet
- **Typography**: Geist Sans for UI, system fonts fallback
- **Layout**: Responsive grid with mobile-first approach
- **Components**: shadcn/ui with custom theming

## API Patterns

### Server Components
- Fetch data directly with `createClient()`
- No loading states needed (streaming)
- SEO-friendly

### Client Components
- Use `createClient()` singleton
- SWR for data fetching and caching
- Optimistic updates for better UX

### Server Actions
- Form submissions and mutations
- Automatic revalidation
- Type-safe with TypeScript

## Future Enhancements
- Payment gateway integration (Stripe)
- Order status tracking
- Email notifications
- Product ratings and reviews
- Shopping cart functionality
- Loyalty points system

## License
MIT License - Free to use and modify

## Support
For issues or questions, open a GitHub issue or contact the development team.
