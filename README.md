# FlowSight 📊

> The all-in-one SaaS analytics dashboard and admin panel. Track revenue, users, subscriptions, and product performance with AI-powered insights.

## ✨ Features

- **📈 Revenue Analytics** - Real-time revenue tracking with AI-powered chart explanations
- **👥 User Management** - Complete user tracking and management system
- **💳 Order & Payment Tracking** - Monitor orders, payments, and transaction history
- **🔄 Subscription Management** - Track active plans, churn, upgrades, and retention
- **📋 Activity Timeline** - Comprehensive log of user behavior and system events
- **🤖 AI Insights** - Get intelligent explanations of your business metrics and trends
- **📤 CSV Data Import** - Import your own data via CSV files (no API setup required)
- **🏢 Multi-Tenant Workspaces** - Isolated data per workspace with demo/real data modes
- **🔐 Secure Authentication** - JWT-based authentication with role-based access control

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Database:** MongoDB (via Prisma ORM)
- **Authentication:** JWT
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flowsight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/dbname"
   JWT_SECRET="your-super-secret-jwt-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint      # Run ESLint
```

## 🎨 Key Features Explained

### CSV Data Import
Import your users, orders, and subscriptions as CSV files. FlowSight validates and processes your data, instantly updating your dashboard with real analytics.

### AI-Powered Insights
Ask FlowSight to explain revenue trends, chart patterns, and business health. Get intelligent summaries of your SaaS metrics in plain English.

### Multi-Tenant Workspaces
Each user gets their own isolated workspace. Import your data to switch from demo mode to real data mode seamlessly.

## 📁 Project Structure

```
flowsight/
├── app/
│   ├── (public)/          # Landing, login, register
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/              # API endpoints
├── components/
│   ├── layout/          # Navbar, mobile menu
│   ├── home/            # Landing page sections
│   ├── cards/           # Dashboard cards
│   ├── charts/          # Chart components
│   ├── data-import/     # CSV import UI
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── csv/             # CSV parsing & validation
│   ├── workspace/       # Multi-tenant logic
│   └── ai/              # AI insights
└── prisma/
    └── schema.prisma    # Database schema
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | ✅ Yes |

