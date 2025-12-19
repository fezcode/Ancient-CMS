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

## Troubleshooting Connection Issues

- **Connection Refused**: Ensure your remote database accepts connections from your IP address (Whitelist your IP).
- **SSL**: Some cloud providers (like Heroku/Azure) require SSL. Append `?sslmode=require` to your connection string.
  ```
  .../dbname?schema=public&sslmode=require
  ```
- **Schema Sync**: If you get errors about missing tables, it means you haven't run `npx prisma migrate deploy` yet.
