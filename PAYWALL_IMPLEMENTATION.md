# Paywall Implementation Summary

## Overview

Successfully implemented a three-tier access control system for the Canadian Citizenship Test app:

- **Guest** (unauthenticated): Browse only, cannot take quizzes
- **Free Registered**: 3 quizzes/day, 10 questions max, basic features only
- **Premium**: Unlimited access to all features

## What Was Implemented

### 1. Database Changes

**Updated User Model** (`prisma/schema.prisma`):
- Added `subscriptionTier` (default: "free")
- Added `subscriptionStatus` (for future payment integration)
- Added `subscriptionId` (for Stripe integration)
- Added `subscriptionEndsAt` (for subscription expiration)

**New DailyQuizLimit Model**:
- Tracks daily quiz attempts per user
- Unique constraint on `userId` + `date`
- Resets automatically at midnight

**Migration**: `20260308201430_add_subscription_fields`

### 2. Core Access Control

**Created `src/lib/access-control.ts`**:
- `getUserTier()` - Determines user tier from session
- `canAccessFeature()` - Checks feature access by tier
- `TIER_LIMITS` - Centralized configuration for all restrictions
- Helper functions: `isPremium()`, `isGuest()`, `isFree()`

**Created `src/lib/queries/daily-limit.ts`**:
- `getDailyAttempts()` - Get today's attempt count
- `incrementDailyAttempts()` - Increment counter after quiz completion
- `canTakeQuiz()` - Check if user can start a quiz
- `getRemainingAttempts()` - Get remaining attempts for today

### 3. Authentication Updates

**Updated `src/lib/auth.ts`**:
- Added `subscriptionTier` to JWT token
- Added `subscriptionTier` to session object
- Included in authorize function return value

**Updated `src/types/next-auth.d.ts`**:
- Extended User, Session, and JWT interfaces with `subscriptionTier`

### 4. Middleware Protection

**Updated `src/middleware.ts`**:
- Protects `/dashboard/*` - requires authentication
- Protects `/flashcards/*` - requires premium
- Protects `/simulation/*` - requires premium
- Protects `/leaderboard` - requires premium
- Protects `/quiz/*/review` - requires premium
- Redirects to `/upgrade` for non-premium users
- Redirects to `/login` for unauthenticated users

### 5. API Route Protection

**Updated `src/app/api/quizzes/[slug]/route.ts`**:
- Returns 401 for guest users
- Enforces 10-question limit for free users
- Respects custom question counts for premium users

**Updated `src/app/api/quiz-attempts/route.ts`**:
- Checks daily limit before saving attempt
- Returns 403 if free user exceeded 3 attempts
- Increments daily counter on successful save
- Returns attempt count in error response

### 6. Page-Level Protection

**Gated Premium Pages**:
- `src/app/flashcards/[category]/page.tsx` - Redirects to `/upgrade`
- `src/app/simulation/play/page.tsx` - Redirects to `/upgrade`
- `src/app/simulation/[category]/play/page.tsx` - Redirects to `/upgrade`
- `src/app/leaderboard/page.tsx` - Redirects to `/upgrade`
- `src/app/quiz/[id]/review/page.tsx` - Redirects to `/upgrade`

**Updated `src/lib/queries/quiz-attempt.ts`**:
- Leaderboard now filters to show only premium users
- Free users excluded from rankings

### 7. UI Components

**Created Paywall Components**:

1. **`src/components/paywall/upgrade-prompt.tsx`**:
   - Modal for access denied scenarios
   - Shows different messages for guests vs free users
   - Displays daily limit information when applicable
   - CTAs: "Sign Up Free" (guests) or "Upgrade to Premium" (free users)

2. **`src/components/paywall/feature-gate.tsx`**:
   - Wrapper component for conditional rendering
   - Shows upgrade prompt if user lacks access
   - Supports custom fallback UI

3. **`src/components/paywall/tier-badge.tsx`**:
   - Visual badge showing "Free" or "Premium"
   - Crown icon for premium, User icon for free
   - Multiple sizes: sm, md, lg

### 8. Client-Side Updates

**Updated `src/pages/QuizPlayer.tsx`**:
- Checks session tier on load
- Shows upgrade prompt for guests
- Shows daily limit modal for free users
- Hides instant feedback for free users in practice mode
- Shows upgrade hint instead of feedback

**Updated `src/pages/QuizCatalog.tsx`**:
- Disables question count buttons above 10 for free users
- Shows lock icon on disabled options
- Displays tier limitation message

**Updated `src/pages/QuizDetail.tsx`**:
- Shows "Sign Up Free" CTA for guests instead of "Start Quiz"
- Disables custom question counts for free users
- Shows lock icons on premium options

**Updated `src/pages/FlashcardsPage.tsx`**:
- Shows "Premium" badge in header
- Shows "Upgrade to Access Flashcards" CTA for non-premium
- Lock icons on flashcard sets for free users

**Updated `src/pages/SimulationCatalog.tsx`**:
- Shows "Premium" badge in header
- Shows "Upgrade to Access Simulations" CTA
- Lock icons on simulation options for free users

### 9. Navigation Updates

**Updated `src/components/Layout.tsx`**:
- Shows tier badge next to user name
- Shows "Upgrade" button for free users (desktop & mobile)
- Hides dashboard link for guests
- Shows lock icons on premium features for free users
- Conditional rendering based on tier access

### 10. Upgrade Page

**Created `src/app/upgrade/page.tsx` & `src/pages/UpgradePage.tsx`**:
- Side-by-side comparison: Free vs Premium
- Lists all premium features with check marks
- "Coming Soon" button (placeholder for payment)
- Benefits section with icons
- Social proof section
- Redirects premium users to dashboard

### 11. Seed Script Update

**Updated `prisma/seed.ts`**:
- Sets admin user to premium tier
- Updates existing users to free tier on seed

## Feature Access Matrix

| Feature | Guest | Free | Premium |
|---------|-------|------|---------|
| Browse Quizzes | ✅ | ✅ | ✅ |
| Take Quizzes | ✅ (10 questions, no results) | ✅ (unlimited, 10 questions) | ✅ (unlimited) |
| See Results | ❌ (must register) | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ✅ |
| Custom Question Count | ❌ | ❌ | ✅ |
| Flashcards | ❌ | ❌ | ✅ |
| Simulations | ❌ | ❌ | ✅ |
| Leaderboard | ❌ | ✅ | ✅ |
| Review Mode | ❌ | ❌ | ✅ |
| Instant Feedback | ❌ | ❌ | ✅ |
| Leaderboard Rankings | ❌ | ✅ | ✅ |

## Testing Checklist

Before deploying, verify:

**Guest Users**:
- [ ] Guest CAN take quizzes (10 questions max, unlimited attempts)
- [ ] Guest CAN browse quiz catalog
- [ ] Guest CAN view quiz detail pages
- [ ] Guest CANNOT see results after completing quiz (redirected to `/login`)
- [ ] Guest CANNOT access dashboard (redirected to `/login`)
- [ ] Guest CANNOT access flashcards (redirected to `/login`)
- [ ] Guest CANNOT access simulations (redirected to `/login`)
- [ ] Guest CANNOT access leaderboard (redirected to `/login`)
- [ ] Guest CANNOT access review mode (redirected to `/login`)
- [ ] Guest does NOT appear in leaderboard rankings

**Free Users**:
- [ ] Free user can take UNLIMITED quizzes per day
- [ ] Free user locked to 10 questions max
- [ ] Free user cannot select 15, 20, 25, 30, 50 questions (locked with icon)
- [ ] Free user CAN see results after quiz
- [ ] Free user CAN access dashboard
- [ ] Free user CAN access leaderboard
- [ ] Free user APPEARS in leaderboard rankings
- [ ] Free user cannot access flashcards (redirected to `/upgrade`)
- [ ] Free user cannot access simulations (redirected to `/upgrade`)
- [ ] Free user cannot access review mode (redirected to `/upgrade`)
- [ ] Free user does not see instant feedback in practice mode

**Premium Users**:
- [ ] Premium user has unlimited quiz attempts
- [ ] Premium user can select any question count (5-50)
- [ ] Premium user can access all features
- [ ] Premium user appears in leaderboard
- [ ] Premium user sees instant feedback in practice mode
- [ ] Premium user can access review mode

**General**:
- [ ] Admin users bypass all restrictions
- [ ] Daily limit resets at midnight
- [ ] Tier badge shows correctly in navigation
- [ ] "Upgrade" button appears for free users
- [ ] Lock icons appear on restricted features

## Next Steps: Payment Integration

When ready to add Stripe payments:

1. **Install Stripe**:
   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. **Environment Variables** (add to `.env`):
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_ID=price_...
   ```

3. **Create Stripe Webhook** (`src/app/api/webhooks/stripe/route.ts`):
   - Handle `checkout.session.completed`
   - Handle `customer.subscription.updated`
   - Handle `customer.subscription.deleted`
   - Update user `subscriptionTier` and `subscriptionStatus`

4. **Update Upgrade Page**:
   - Replace "Coming Soon" button with Stripe checkout
   - Use `@stripe/stripe-js` for client-side checkout
   - Create checkout session via API route

5. **Add Subscription Management**:
   - Create `/dashboard/subscription` page
   - Show current plan, billing date, cancel option
   - Use Stripe Customer Portal for management

## Files Created

- `src/lib/access-control.ts` - Core access control logic
- `src/lib/queries/daily-limit.ts` - Daily attempt tracking
- `src/components/paywall/upgrade-prompt.tsx` - Upgrade modal component
- `src/components/paywall/feature-gate.tsx` - Wrapper component for gating
- `src/components/paywall/tier-badge.tsx` - Tier indicator badge
- `src/app/upgrade/page.tsx` - Upgrade page route
- `src/pages/UpgradePage.tsx` - Upgrade page UI
- `scripts/upgrade-user.ts` - Manual user upgrade script
- `scripts/downgrade-user.ts` - Manual user downgrade script
- `prisma/migrations/20260308201430_add_subscription_fields/migration.sql` - Database migration
- `PAYWALL_IMPLEMENTATION.md` - This documentation

## Files Modified

- `prisma/schema.prisma` - Added subscription fields + DailyQuizLimit model
- `src/lib/auth.ts` - Added subscriptionTier to session
- `src/types/next-auth.d.ts` - Extended types with subscriptionTier
- `src/middleware.ts` - Protected premium routes
- `src/app/api/quizzes/[slug]/route.ts` - Enforced question limits
- `src/app/api/quiz-attempts/route.ts` - Check daily limits
- `src/app/api/simulations/route.ts` - Added premium check
- `src/app/api/flashcards/[category]/route.ts` - Added premium check
- `src/app/api/leaderboard/route.ts` - Added premium check
- `src/lib/queries/quiz-attempt.ts` - Filter leaderboard by premium users
- `src/pages/QuizPlayer.tsx` - Access checks + upgrade prompts
- `src/pages/QuizCatalog.tsx` - Tier-based CTAs
- `src/pages/QuizDetail.tsx` - Guest CTAs + locked options
- `src/pages/FlashcardsPage.tsx` - Premium badges + CTAs
- `src/pages/SimulationCatalog.tsx` - Premium badges + CTAs
- `src/components/Layout.tsx` - Tier badge + conditional links
- `src/app/flashcards/[category]/page.tsx` - Premium redirect
- `src/app/simulation/play/page.tsx` - Premium redirect
- `src/app/simulation/[category]/play/page.tsx` - Premium redirect
- `src/app/leaderboard/page.tsx` - Premium redirect
- `src/app/quiz/[id]/review/page.tsx` - Premium redirect
- `prisma/seed.ts` - Set admin to premium, update existing users

## Key Technical Decisions

1. **Admin Override**: Admin users (`role === "admin"`) automatically get premium access regardless of subscription tier
2. **Daily Limit Storage**: Uses separate `DailyQuizLimit` table with date-based unique constraint for automatic midnight reset
3. **Middleware First**: Route protection at edge for performance, with server-side checks as backup
4. **Client + Server Validation**: Both client-side UI gating and server-side API enforcement for security
5. **Graceful Degradation**: Free users see what's locked with upgrade prompts, not just hidden features
6. **No Breaking Changes**: All existing users default to "free" tier, functionality preserved

## Admin Access

Admin users have full access to all features regardless of subscription tier. This is enforced in:
- `getUserTier()` function (returns "premium" for admins)
- Middleware checks
- All server-side access control

## Quick Start Guide

### Testing Locally

1. **Restart your development server** to load the new Prisma client
2. **Test as Guest**:
   - Visit `/quizzes` - should see catalog
   - Try to start a quiz - should see "Sign Up Required" modal
   - Try to visit `/dashboard` - redirected to `/login`
   - Try to visit `/leaderboard` - redirected to `/login`

3. **Test as Free User**:
   - Register a new account
   - Take 3 quizzes - should work
   - Try 4th quiz - should see "Daily limit exceeded" modal
   - Try to access `/flashcards` - redirected to `/upgrade`
   - Try to access `/simulation` - redirected to `/upgrade`
   - Try to access `/leaderboard` - redirected to `/upgrade`
   - Try to select 20 questions - should be locked (only 10 allowed)

4. **Upgrade User to Premium** (for testing):
   ```bash
   tsx scripts/upgrade-user.ts user@example.com
   ```

5. **Test as Premium User**:
   - All features unlocked
   - Unlimited quiz attempts
   - Custom question counts (5-50)
   - Access to flashcards, simulations, leaderboard, review mode
   - Appears in leaderboard rankings

6. **Downgrade User** (for testing):
   ```bash
   tsx scripts/downgrade-user.ts user@example.com
   ```

### Deployment Notes

1. Run migration: `npx prisma migrate deploy` (production)
2. Restart app to load new Prisma client
3. Existing users will default to "free" tier
4. Admin users automatically get premium access
5. No manual data migration needed

## Support for Future Features

The schema is ready for:
- Stripe subscription management
- Subscription lifecycle (active, cancelled, expired)
- Grace periods (subscriptionEndsAt)
- Multiple payment providers
- Subscription upgrades/downgrades
- Trial periods
