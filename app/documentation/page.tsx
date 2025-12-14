"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Home } from "lucide-react"

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Button onClick={() => window.print()} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Print / Save as PDF
          </Button>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1>Sweet Shop Management System</h1>
          <p className="lead">
            A comprehensive full-stack web application for managing sweet shop operations with role-based access
            control.
          </p>

          <h2>🎯 Project Overview</h2>
          <p>
            The Sweet Shop Management System is a production-ready web application built with Next.js 16, React 19, and
            Supabase. It provides a complete solution for managing a sweet shop's inventory, user purchases, and
            administrative operations.
          </p>

          <h2>✨ Key Features</h2>
          <h3>User Features</h3>
          <ul>
            <li>
              <strong>Authentication</strong>: Secure email/password authentication with Supabase Auth
            </li>
            <li>
              <strong>Browse Sweets</strong>: View available sweets with images, descriptions, and pricing
            </li>
            <li>
              <strong>Search & Filter</strong>: Real-time search and category filtering
            </li>
            <li>
              <strong>Purchase System</strong>: Buy sweets with automatic inventory updates
            </li>
            <li>
              <strong>Purchase History</strong>: Track all past orders with timestamps
            </li>
          </ul>

          <h3>Admin Features</h3>
          <ul>
            <li>
              <strong>Inventory Management</strong>: Add, edit, and delete sweets
            </li>
            <li>
              <strong>Purchase Dashboard</strong>: View all customer orders with revenue tracking
            </li>
            <li>
              <strong>Stock Monitoring</strong>: Real-time inventory status
            </li>
            <li>
              <strong>Protected Routes</strong>: Admin-only access with role verification
            </li>
          </ul>

          <h2>🏗️ Technical Architecture</h2>
          <h3>Frontend Stack</h3>
          <ul>
            <li>
              <strong>Framework</strong>: Next.js 16 (App Router)
            </li>
            <li>
              <strong>UI Library</strong>: React 19.2 with Server Components
            </li>
            <li>
              <strong>Styling</strong>: Tailwind CSS v4 with custom theming
            </li>
            <li>
              <strong>Components</strong>: shadcn/ui component library
            </li>
            <li>
              <strong>Icons</strong>: Lucide React
            </li>
          </ul>

          <h3>Backend Stack</h3>
          <ul>
            <li>
              <strong>Database</strong>: PostgreSQL (via Supabase)
            </li>
            <li>
              <strong>Authentication</strong>: Supabase Auth
            </li>
            <li>
              <strong>API</strong>: Next.js Server Actions & Route Handlers
            </li>
            <li>
              <strong>Real-time</strong>: Supabase Realtime subscriptions
            </li>
          </ul>

          <h2>🗄️ Database Schema</h2>
          <h3>Tables</h3>

          <h4>1. profiles</h4>
          <p>Stores user profile information and roles.</p>
          <pre>
            <code>{`- id: UUID (Primary Key, Foreign Key to auth.users)
- email: TEXT
- full_name: TEXT
- role: TEXT (default: 'user')
- created_at: TIMESTAMP`}</code>
          </pre>

          <h4>2. sweets</h4>
          <p>Contains the sweet shop inventory.</p>
          <pre>
            <code>{`- id: UUID (Primary Key)
- name: TEXT
- description: TEXT
- price: DECIMAL
- category: TEXT
- image_url: TEXT
- stock_quantity: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP`}</code>
          </pre>

          <h4>3. purchases</h4>
          <p>Tracks all customer purchases.</p>
          <pre>
            <code>{`- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to profiles)
- sweet_id: UUID (Foreign Key to sweets)
- quantity: INTEGER
- total_price: DECIMAL
- created_at: TIMESTAMP`}</code>
          </pre>

          <h2>🔐 Security Features</h2>
          <h3>Row Level Security (RLS) Policies</h3>
          <ul>
            <li>
              <strong>profiles</strong>: Users can read all profiles, update only their own
            </li>
            <li>
              <strong>sweets</strong>: Public read access, admin-only write access
            </li>
            <li>
              <strong>purchases</strong>: Users can only view their own purchases, admins see all
            </li>
          </ul>

          <h3>Authentication Flow</h3>
          <ol>
            <li>User signs up with email and password</li>
            <li>Supabase creates auth.users entry</li>
            <li>Database trigger automatically creates profile entry</li>
            <li>Fallback profile creation in app if trigger fails</li>
            <li>User receives confirmation email</li>
            <li>After confirmation, user can log in</li>
            <li>Middleware protects routes and refreshes session</li>
          </ol>

          <h2>📁 Project Structure</h2>
          <pre>
            <code>{`/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   ├── dashboard/page.tsx          # User dashboard
│   ├── admin/page.tsx              # Admin panel
│   ├── setup-admin/page.tsx        # Super admin setup
│   ├── documentation/page.tsx      # This page
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── sweets-list.tsx            # Sweet listings component
│   ├── purchase-dialog.tsx        # Purchase modal
│   ├── purchase-history.tsx       # Order history
│   ├── admin-sweets.tsx           # Admin inventory
│   ├── admin-purchases.tsx        # Admin orders
│   ├── add-edit-sweet-dialog.tsx  # Sweet form
│   └── logout-button.tsx          # Logout component
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client (singleton)
│   │   ├── server.ts              # Server client
│   │   └── proxy.ts               # Proxy utilities
│   ├── types.ts                   # TypeScript types
│   └── actions.ts                 # Server actions
├── scripts/
│   ├── 001-create-tables.sql      # Initial schema
│   ├── 002-seed-data.sql          # Sample data
│   ├── 003-create-super-admin.sql # Admin setup
│   └── 004-fix-auth-trigger.sql   # Auth improvements
├── proxy.ts                        # Middleware
└── README.md                       # Setup instructions`}</code>
          </pre>

          <h2>🚀 Setup Instructions</h2>
          <ol>
            <li>Clone the repository</li>
            <li>
              Install dependencies: <code>npm install</code>
            </li>
            <li>
              Connect Supabase integration through v0 Connect section (all environment variables are configured
              automatically)
            </li>
            <li>
              Run database migrations from the <code>scripts/</code> folder in sequential order
            </li>
            <li>
              Create super admin via <code>/setup-admin</code> page
            </li>
            <li>
              Start development server: <code>npm run dev</code>
            </li>
          </ol>

          <h2>🔄 Core Processes</h2>
          <h3>User Purchase Flow</h3>
          <ol>
            <li>User browses sweets on dashboard</li>
            <li>Clicks "Purchase" button on desired sweet</li>
            <li>Enters quantity in dialog</li>
            <li>System validates stock availability</li>
            <li>Transaction creates purchase record</li>
            <li>Stock quantity automatically decremented</li>
            <li>Purchase appears in user's history</li>
          </ol>

          <h3>Admin Inventory Management</h3>
          <ol>
            <li>
              Admin accesses <code>/admin</code> route
            </li>
            <li>System verifies admin role</li>
            <li>Admin can add new sweets with form</li>
            <li>Edit existing sweets (name, price, stock, etc.)</li>
            <li>Delete sweets from inventory</li>
            <li>View real-time purchase dashboard</li>
            <li>Monitor revenue and stock levels</li>
          </ol>

          <h2>🎨 Design System</h2>
          <ul>
            <li>
              <strong>Color Palette</strong>: Soft pink primary, purple accents
            </li>
            <li>
              <strong>Typography</strong>: Geist Sans for body, Geist Mono for code
            </li>
            <li>
              <strong>Theme</strong>: Light and dark mode support
            </li>
            <li>
              <strong>Layout</strong>: Responsive flexbox and grid layouts
            </li>
            <li>
              <strong>Components</strong>: Consistent shadcn/ui design language
            </li>
          </ul>

          <h2>📝 API Endpoints</h2>
          <ul>
            <li>
              <code>GET /api/sweets</code> - Fetch all sweets
            </li>
            <li>
              <code>POST /api/sweets</code> - Create sweet (admin)
            </li>
            <li>
              <code>PUT /api/sweets/:id</code> - Update sweet (admin)
            </li>
            <li>
              <code>DELETE /api/sweets/:id</code> - Delete sweet (admin)
            </li>
            <li>
              <code>POST /api/purchases</code> - Create purchase
            </li>
            <li>
              <code>GET /api/purchases</code> - Get user purchases
            </li>
          </ul>

          <h2>🔮 Future Enhancements</h2>
          <ul>
            <li>Payment gateway integration (Stripe)</li>
            <li>Email notifications for purchases</li>
            <li>Advanced analytics dashboard</li>
            <li>Customer reviews and ratings</li>
            <li>Wishlist functionality</li>
            <li>Multi-image support for sweets</li>
            <li>Discount codes and promotions</li>
          </ul>

          <h2>👨‍💻 Developer Information</h2>
          <ul>
            <li>
              <strong>Super Admin</strong>: Shubham Rajanand Tawale
            </li>
            <li>
              <strong>Email</strong>: shubhamtawale98@gmail.com
            </li>
            <li>
              <strong>Built with</strong>: v0 by Vercel
            </li>
            <li>
              <strong>Framework</strong>: Next.js 16
            </li>
            <li>
              <strong>Database</strong>: Supabase (PostgreSQL)
            </li>
          </ul>

          <h2>📄 License</h2>
          <p>This project is open source and available for educational purposes.</p>

          <hr />
          <p className="text-sm text-muted-foreground text-center">
            Sweet Shop Management System - Built with ❤️ using Next.js and Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
