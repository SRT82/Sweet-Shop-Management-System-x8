# Sweet Shop Management System

A full-stack web application for managing a sweet shop with user authentication, inventory management, and purchase tracking.

## Features

### User Features
- **Authentication**: Sign up and login with email/password
- **Browse Sweets**: View all available sweets with images, descriptions, and prices
- **Search & Filter**: Search by name/description and filter by category
- **Purchase**: Buy sweets with quantity selection (automatic stock updates)
- **Purchase History**: View all past purchases with details

### Admin Features
- **Inventory Management**: Add, edit, and delete sweets
- **Stock Control**: Manage pricing, stock levels, and categories
- **Purchase Dashboard**: View all customer purchases
- **Revenue Tracking**: Monitor total revenue and order counts
- **Search Orders**: Find purchases by sweet name or customer

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Type Safety**: TypeScript

## Database Schema

### Tables
- **profiles**: User profiles with role-based access (user/admin)
- **sweets**: Product inventory with pricing and stock
- **purchases**: Order history with customer and product relationships

### Security
- Row Level Security (RLS) policies protect all data
- Users can only view/edit their own data
- Admins have full access to manage inventory and view all purchases

## Getting Started

1. **Install Dependencies**
   The project uses automatic dependency resolution - no manual package installation needed.

2. **Database Setup**
   Run the SQL scripts in the `scripts` folder to create tables and seed data:
   - `001-create-tables.sql` - Creates tables, indexes, and RLS policies
   - `002-seed-data.sql` - Adds sample sweet data

3. **Environment Variables**
   All Supabase environment variables are automatically configured through the integration.

4. **Create Admin User**
   After signing up, manually update your user role in the database:
   \`\`\`sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   \`\`\`

## Usage

### User Flow
1. Sign up or login at `/auth/signup` or `/auth/login`
2. Browse sweets in the dashboard at `/dashboard`
3. Search by name or filter by category
4. Click "Purchase" to buy sweets
5. View purchase history in the "Purchase History" tab

### Admin Flow
1. Login with an admin account
2. Access the admin panel from the dashboard header
3. Manage sweets: Add, edit, or delete products
4. View all purchases and track revenue
5. Search orders by customer or product name

## API Routes

The application uses Supabase client-side queries with proper authentication. All data operations are protected by Row Level Security policies.

## Security Features

- Email/password authentication with Supabase Auth
- Session management via HTTP-only cookies
- Row Level Security on all database tables
- Protected routes via middleware
- Admin-only access controls for management features

## Future Enhancements

- Image upload for sweet products
- Shopping cart for multiple items
- Order status tracking
- Email notifications
- Payment gateway integration
- Customer reviews and ratings
