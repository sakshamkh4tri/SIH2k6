# PostgreSQL setup

Install PostgreSQL 16 or later, then create a database named `projectpulse`.

```sql
CREATE DATABASE projectpulse;
```

In the project-root `.env` file, add your real connection string:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/projectpulse
```

Run the setup once:

```bash
npm run db:setup
```

This creates the tables and imports the same sample user, projects, milestones, alerts, and audit signals used by the local development app. Do not commit `.env` because it contains your database password.
