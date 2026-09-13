import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { createSeed } from "../seed.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to your .env file before running npm run db:setup.");
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const here = path.dirname(fileURLToPath(import.meta.url));
const schema = await fs.readFile(path.join(here, "schema.sql"), "utf8");
const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query(schema);
  const existing = await client.query("SELECT COUNT(*)::int AS count FROM users");
  if (existing.rows[0].count === 0) {
    const db = await createSeed();
    for (const user of db.users) await client.query("INSERT INTO users (id,name,email,password_hash,role,created_at) VALUES ($1,$2,$3,$4,$5,$6)", [user.id,user.name,user.email,user.passwordHash,user.role,user.createdAt]);
    for (const p of db.projects) await client.query("INSERT INTO projects (id,name,department,location,status,risk,budget_cr,released_cr,physical_progress,target_progress,schedule_lag_days,estimated_completion,revised_completion,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)", [p.id,p.name,p.department,p.location,p.status,p.risk,p.budgetCr,p.releasedCr,p.physicalProgress,p.targetProgress,p.scheduleLagDays,p.estimatedCompletion,p.revisedCompletion,p.createdAt,p.updatedAt]);
    for (const m of db.milestones) await client.query("INSERT INTO milestones (id,project_id,name,planned_progress,actual_progress,status,due_date,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [m.id,m.projectId,m.name,m.plannedProgress,m.actualProgress,m.status,m.dueDate,m.createdAt]);
    for (const s of db.auditSignals) await client.query("INSERT INTO audit_signals (id,project_id,severity,message,status,created_at) VALUES ($1,$2,$3,$4,$5,$6)", [s.id,s.projectId,s.severity,s.message,s.status,s.createdAt]);
    for (const a of db.alerts) await client.query("INSERT INTO alerts (id,project_id,title,description,severity,status,created_at,resolved_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [a.id,a.projectId,a.title,a.description,a.severity,a.status,a.createdAt,a.resolvedAt]);
    console.log("Database schema created and ProjectPulse sample data added.");
  } else console.log("Database schema is ready. Existing data was kept.");
  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
