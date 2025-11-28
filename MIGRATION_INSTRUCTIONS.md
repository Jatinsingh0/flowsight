# Migration Instructions for CSV Import Feature

## ⚠️ Important: Run These Commands

After the schema changes, you **MUST** run these commands in order:

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Push Schema to Database
```bash
npx prisma db push
```

Or if you prefer migrations:
```bash
npx prisma migrate dev --name add_workspace_support
```

### 3. Migrate Existing Users (CRITICAL)
If you have existing users in your database, run this migration script:
```bash
npx tsx prisma/migrations/migrate_existing_users.ts
```

This ensures **every user has their own workspace** for proper data isolation.

## What Changed

1. **New Workspace Model** - Added to support multi-tenancy
2. **workspaceId added to all models** - User, Order, Subscription, Activity
3. **workspaceId is REQUIRED** - Critical for data isolation and ownership
4. **Each user gets their own workspace** - Complete data separation

## Why workspaceId is Required

- **Data Isolation**: Each company/user sees only their own data
- **Security**: Prevents data leakage between workspaces
- **Ownership**: Clear ownership of data per workspace
- **Multi-tenancy**: Foundation for future features

## After Migration

1. ✅ Every user will have a workspace assigned
2. ✅ New registrations automatically create workspace
3. ✅ Demo workspace created for seeded data
4. ✅ All queries filter by workspaceId for isolation

## Testing

1. Register a new user - should auto-create workspace
2. Import CSV data - should work with workspace isolation
3. Check dashboard - should show only your workspace data

## Troubleshooting

If you get errors about missing workspaceId:
- Run `npx prisma generate` first
- Then `npx prisma db push`
- Restart your dev server

