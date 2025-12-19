# Database Management

AncientCMS uses **PostgreSQL** managed by **Prisma ORM**.

## How to Connect to Another Database

If you want to switch from the local Docker container to a managed database (e.g., AWS RDS, Supabase, Neon, or another local instance), follow these steps:

### 1. Update the Environment Variable
Navigate to `server/.env` and find the `DATABASE_URL` variable.

**Current (Local Docker):**
```env
DATABASE_URL="postgresql://ancient_admin:ancient_password@localhost:5432/ancient_db?schema=public"
```

**To Switch (Example - AWS RDS):**
Replace the value with your new connection string:
```env
DATABASE_URL="postgresql://my_user:my_secure_password@my-rds-instance.aws.com:5432/my_db_name?schema=public"
```

### 2. Apply Schema to New Database
Once you have changed the URL, the new database is likely empty. You need to push your schema structure to it.

Run this command inside the `server` directory:
```bash
cd server
npx prisma migrate deploy
```
*Note: We use `migrate deploy` for production/remote databases to apply pending migrations safely.*

### 3. Generate Client (Optional but Recommended)
If your schema changed, regenerate the client:
```bash
npx prisma generate
```

### 4. Restart Server
Restart your Node.js server to pick up the new `.env` configuration.
```bash
npm run dev
```

---

## Database Migrations

Whenever you modify the `prisma/schema.prisma` file, you must generate a migration to keep the database in sync.

### 1. Create a Development Migration
When developing locally, use this command to generate and apply changes:
```bash
cd server
npx prisma migrate dev --name <migration_name>
```
*   **What it does:** Generates a SQL file in `prisma/migrations/`, applies it to your local DB, and regenerates the Prisma Client.
*   **Version Control:** Always commit the generated `prisma/migrations/` folder to Git.

### 2. Deployment Migrations
When deploying to a production or staging environment, **never** use `migrate dev`. Use:
```bash
npx prisma migrate deploy
```
*   **What it does:** Applies all pending migrations from the `prisma/migrations/` folder without resetting the database.

### 3. Resetting the Database
If your local database gets into a corrupted state or you want to start fresh:
```bash
npx prisma migrate reset
```
*⚠️ Warning: This will delete all data in your local database.*

---

## Troubleshooting Connection Issues

- **Connection Refused**: Ensure your remote database accepts connections from your IP address (Whitelist your IP).
- **SSL**: Some cloud providers (like Heroku/Azure) require SSL. Append `?sslmode=require` to your connection string.
  ```
  .../dbname?schema=public&sslmode=require
  ```
- **Schema Sync**: If you get errors about missing tables, it means you haven't run `npx prisma migrate deploy` yet.
