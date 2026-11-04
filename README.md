# NOVENTRA SCHOOL — Full-Stack Web Application

A production-quality full-stack web application for **NOVENTRA SCHOOL** built using React, TypeScript, Vite, Tailwind CSS, Framer Motion, Node.js/Express REST API, Supabase PostgreSQL, and Supabase Realtime synchronization.

---

## 🌟 Key Features

- **Official Brand Identity**: Integrated official Noventra School crest logo, Deep Navy Blue (`#0B192C`) & Rich Gold (`#D4AF37`) color palette.
- **Modern Responsive Frontend**: Built with Vite, React 18, TypeScript, Tailwind CSS, Framer Motion, and Lucide React icons.
- **Interactive UI**: Animated background with floating educational shapes, glassmorphism cards, stat counters, and category-filterable lightbox gallery.
- **Node.js REST API Backend**: Express.js server with TypeScript, CORS, Zod payload validation, and centralized error handling middleware.
- **Supabase Authentication**: Secure user signup, login, password encryption, and profile table integration with custom roles (`user` & `admin`).
- **PostgreSQL Database & RLS**: Fully defined `profiles` and `enquiries` schemas with strict Row-Level Security (RLS) policies.
- **Live Supabase Realtime Sync**: When an admin updates an enquiry status or publishes a response, the user's dashboard updates in real-time without page refreshes!
- **User Dashboard & Timeline**: Animated enquiry progress timeline (`Submitted` → `Under Review` → `Contacted` → `Response Received` → `Completed`).
- **Admin Dashboard**: Comprehensive stats cards, searchable/filterable enquiry data table, status manager modal, and user account directory.
- **Seamless Demo Fallback**: Works out-of-the-box immediately for development even before configuring live Supabase environment keys.

---

## 📁 Repository Structure

```text
d:\Vishal\1ST PROJECT/
├── frontend/                     # React + Vite + TypeScript Frontend
│   ├── public/logo.jpeg          # Official Noventra crest logo
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Cards, Modal, Toast, Timeline, etc.
│   │   ├── contexts/             # AuthContext, ToastContext, RealtimeContext
│   │   ├── pages/                # Home, About, Academics, Programs, Facilities, Gallery, Contact, Enquiry, Dashboards
│   │   ├── services/             # API client & Supabase client
│   │   ├── types/                # TypeScript definitions
│   │   └── App.tsx
│   └── package.json
├── backend/                      # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── controllers/          # Auth, Enquiry & Admin controllers
│   │   ├── middleware/           # Auth, Admin authorization, Error handling & Zod validation
│   │   ├── routes/               # REST API endpoints
│   │   └── server.ts             # Express entry point
│   └── package.json
├── supabase/
│   ├── migrations/
│   │   └── 01_initial_schema.sql # Tables, Indexes, RLS Policies, Triggers & Realtime
│   └── seed/
│       └── seed_admin.sql        # Admin account setup SQL
├── .env.example                  # Environment variables template
├── package.json                  # Root monorepo runner
└── README.md                     # Project documentation
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

In the root directory, run:

```bash
npm run install:all
```

Or install separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### 2. Environment Configuration

Copy `.env.example` into `frontend/.env` and `backend/.env`:

#### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:5000
```

#### Backend (`backend/.env`)
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-supabase-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

*Note: The `SUPABASE_SERVICE_ROLE_KEY` resides strictly in `backend/.env` and is never exposed to frontend code.*

---

### 3. Run Development Application

To launch both backend API server and Vite frontend concurrently:

```bash
npm run dev
```

- **Frontend Website**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000/api`

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Open your Supabase Dashboard project SQL Editor.
2. Run `supabase/migrations/01_initial_schema.sql` to create:
   - `profiles` table linked to `auth.users`.
   - `enquiries` table with status ENUMs and RLS policies.
   - Triggers for auto-profile creation on signup.
   - Realtime publication on `enquiries`.
3. Run `supabase/seed/seed_admin.sql` to assign the `admin` role to your administrator email.

---

## 🔐 Admin & User Credentials for Testing (Demo Mode)

If live Supabase keys are not yet set, the app runs in **Demo Mode** out-of-the-box:

- **Parent/User Login**:
  - Email: `sarah.j@example.com`
  - Password: `password123`
- **Admin Login**:
  - Email: `admin@noventra.edu`
  - Password: `admin123`

---

## 🛠️ Verification & Build Commands

- Build Backend: `cd backend && npm run build`
- Build Frontend: `cd frontend && npm run build`
