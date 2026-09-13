import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import { createSeed } from "./seed.js";

const bundledDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
// Vercel's deployed source is read-only.  A temporary copy keeps demo mode
// functional within a warm serverless instance; use MongoDB in production for
// durable data.
const directory = process.env.VERCEL ? path.join(os.tmpdir(), "projectpulse-data") : bundledDirectory;
const file = path.join(directory, "db.json");
const useMongo = process.env.DATABASE_MODE === "mongodb";
let database;
let collection;
let pendingWrite = Promise.resolve();
const copy = (value) => structuredClone(value);

export async function initialiseStore() {
  if (useMongo) {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required when DATABASE_MODE=mongodb.");
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    collection = client.db(process.env.MONGODB_DB_NAME || "projectpulse").collection("application_data");
    const stored = await collection.findOne({ _id: "projectpulse" });
    if (stored) { const { _id, ...data } = stored; database = data; }
    else { database = await createSeed(); await collection.insertOne({ _id: "projectpulse", ...database }); }
    console.log("ProjectPulse storage: MongoDB");
    return;
  }
  fs.mkdirSync(directory, { recursive: true });
  database = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : await createSeed();
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(database, null, 2));
  console.log("ProjectPulse storage: local JSON");
}
export function readDb() { return copy(database); }
export function writeDb(data) { database = copy(data); if (collection) { pendingWrite = pendingWrite.then(() => collection.replaceOne({ _id: "projectpulse" }, { _id: "projectpulse", ...database }, { upsert: true })); pendingWrite.catch((error) => console.error("MongoDB persistence error:", error.message)); } else fs.writeFileSync(file, JSON.stringify(database, null, 2)); }
export function updateDb(mutator) { const data = readDb(); const result = mutator(data); writeDb(data); return result; }
