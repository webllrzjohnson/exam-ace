# Canadian Citizenship Test Prep

A full-stack web application for practicing the Canadian Citizenship Test, built with Next.js 14, TypeScript, and PostgreSQL.

## Features

### Three-Tier Access System

- **Guest** (unauthenticated): Browse quizzes, limited access
- **Free Registered**: Unlimited quizzes (10 questions max), dashboard, leaderboard
- **Premium**: Full access to all features including flashcards, simulations, review mode, custom question counts (5-50)

### Core Features

- **Practice Quizzes**: Multiple categories covering Canadian history, government, geography, symbols, and rights
- **Simulation Exams**: Timed practice tests mimicking the real citizenship exam
- **Flashcards**: Study mode for memorizing key facts
- **Review Mode**: Detailed explanations for each question
- **Leaderboard**: Track progress and compete with other users
- **Dashboard**: Personal stats and performance tracking
- **Instant Feedback**: Real-time answer validation (premium)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI + Radix UI
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js v5 (Auth.js)
- **Payments**: Stripe (subscriptions)
- **Forms**: react-hook-form + Zod
- **Deployment**: Hostinger VPS (Ubuntu), Nginx reverse proxy, PM2 process manager

## Getting Started

### Prerequisites

- Node.js 16+ (use [nvm](https://github.com/nvm-sh/nvm))
- PostgreSQL database
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/webllrzjohnson/exam-ace.git
cd exam-ace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL, NextAuth secret, Stripe keys, etc.

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

Required in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cad_exam"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-min-32-chars"
AUTH_TRUST_HOST=true

# Stripe (for premium subscriptions)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Email (optional, for password reset)
RESEND_API_KEY=
RESEND_FROM_EMAIL="App Name <noreply@yourdomain.com>"
```

See `.env.example` for all options.

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/           # Auth pages (login, register, etc.)
│   │   ├── (dashboard)/      # Protected routes
│   │   ├── api/              # API route handlers
│   │   └── upgrade/          # Upgrade/pricing pages
│   ├── components/
│   │   ├── ui/               # Shadcn UI primitives
│   │   ├── paywall/          # Paywall components
│   │   └── pages/            # Page-level components
│   ├── lib/
│   │   ├── db.ts             # Prisma client
│   │   ├── auth.ts           # NextAuth config
│   │   ├── stripe.ts         # Stripe client
│   │   ├── access-control.ts # Tier-based access logic
│   │   ├── actions/          # Server actions
│   │   ├── queries/          # Database queries
│   │   └── hooks/            # Custom React hooks
│   └── types/                # TypeScript types
├── scripts/                   # Utility scripts
└── middleware.ts             # Edge route protection
```

## Database Schema

Key models:

- **User**: Authentication, subscription tier, email verification
- **Quiz**: Quiz metadata, categories, difficulty
- **Question**: Quiz questions with multiple types (multiple choice, true/false, matching)
- **QuizAttempt**: User quiz results and history
- **DailyQuizLimit**: Daily attempt tracking (deprecated for free tier)
- **Category**: Quiz categories (history, government, etc.)
- **Fact**: Fun facts for learning

## Stripe Integration

### Setup

1. Create a product in Stripe Dashboard (Recurring, $9.99/month)
2. Copy the Price ID and add to `.env` as `STRIPE_PRICE_ID`
3. Add Stripe API keys to `.env`
4. Configure webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
5. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
6. Copy webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Local Testing

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Use test card: 4242 4242 4242 4242
```

## Deployment

### Hostinger VPS

```bash
# SSH into server
ssh root@your-server-ip

# Navigate to project
cd /var/www/examlbl

# Pull latest changes
git pull

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Build
npm run build

# Restart with PM2
pm2 restart all
```

### Nginx Configuration

Reverse proxy on port 80/443 → Node.js on port 3000.

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations (dev)
npm run db:seed          # Seed database
npm run db:push          # Push schema changes (dev)
```

## Admin Access

Admin users (`role === "admin"`) automatically get premium access. Set via database:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'admin@example.com';
```

## Testing

Manual verification for email (dev/testing):

```sql
UPDATE "User" SET "emailVerified" = NOW() WHERE email = 'user@example.com';
```

Upgrade user to premium:

```bash
tsx scripts/upgrade-user.ts user@example.com
```

Downgrade user:

```bash
tsx scripts/downgrade-user.ts user@example.com
```

## Documentation

- **[PAYWALL_IMPLEMENTATION.md](./PAYWALL_IMPLEMENTATION.md)**: Complete paywall documentation, access control, Stripe integration
- **[.env.example](./.env.example)**: Environment variable reference

## Contributing

1. Create a feature branch
2. Make changes
3. Test locally
4. Commit with clear messages
5. Push and create a pull request

## License

Private project.

## Support

For issues or questions, contact the development team.
