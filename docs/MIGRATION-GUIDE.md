# Database Migration Guide

## Best Practice: Use Drizzle Kit

**Always use `drizzle-kit` for database migrations.** This ensures consistency between your schema definitions and the actual database state.

## Standard Migration Workflow

### 1. Update Schema Definition

First, modify your schema in `shared/schema.ts`:

```typescript
// Example: Adding a new enum value
export const contentTypeEnum = pgEnum("content_type", [
  "text", 
  "notification", 
  "reminder", 
  "mood_selection",      // NEW
  "affirmation_view",    // NEW
  "intention"            // NEW
]);
```

### 2. Generate Migration with Drizzle Kit

```bash
npm run db:generate
```

This will:
- Compare your schema with the current database state
- Generate a migration SQL file in `migrations/`
- Create a timestamped migration file

### 3. Review Generated Migration

Check the generated SQL file in `migrations/` to ensure it matches your intent.

### 4. Apply Migration

```bash
npm run db:push
```

This applies the migration to your database.

## Why Use Drizzle Kit?

✅ **Type Safety**: Keeps TypeScript schema in sync with database  
✅ **Automatic Diffing**: Detects schema changes automatically  
✅ **Migration History**: Maintains a proper migration journal  
✅ **Rollback Support**: Can revert migrations if needed  
✅ **Team Consistency**: Everyone uses the same migration process

## Manual Migrations (Avoid if Possible)

Only use manual SQL migrations for:
- Complex data transformations
- Multi-step migrations that require intermediate states
- Emergency production fixes

If you must create a manual migration:
1. Place it in `migrations/manual/`
2. Document why it's manual
3. Update the main migrations using `drizzle-kit` afterward

## Common Commands

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:push

# Drop database (BE CAREFUL!)
npm run db:drop

# Open Drizzle Studio (visual database browser)
npm run db:studio
```

## Project Configuration

Drizzle config is in `drizzle.config.ts`:

```typescript
export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};
```

## Troubleshooting

### "Enum value already exists"

If you added an enum value manually and get conflicts:
1. Remove the manual enum additions from the database
2. Update `shared/schema.ts` with all values
3. Run `npm run db:push`

### Schema Out of Sync

If your database and schema are mismatched:
1. Review current database state: `npm run db:studio`
2. Update `shared/schema.ts` to match reality
3. Generate new migration: `npm run db:generate`
4. Apply migration: `npm run db:push`

## Historical Note

This project initially used manual SQL migrations (see `migrations/manual/`). Going forward, all new migrations should use `drizzle-kit` to maintain consistency and leverage type safety.

---

**Last Updated**: October 12, 2025
