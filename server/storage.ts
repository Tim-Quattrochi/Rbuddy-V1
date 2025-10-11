import { drizzle } from 'drizzle-orm/node-postgres';
// Diagnostic: Log what we're importing from pg
import * as pgModule from 'pg';
console.log('[Storage Diagnostic] pg module type:', typeof pgModule);
console.log('[Storage Diagnostic] pg module keys:', Object.keys(pgModule));
console.log('[Storage Diagnostic] Pool available:', 'Pool' in pgModule);
console.log('[Storage Diagnostic] default available:', 'default' in pgModule);

// Try to get Pool from either named export or default
const Pool = (pgModule as any).Pool || (pgModule as any).default?.Pool || (pgModule as any).default;
console.log('[Storage Diagnostic] Pool constructor type:', typeof Pool);

import * as schema from '../shared/schema.js';
import { eq } from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type User = typeof schema.users.$inferSelect;
export type InsertUser = typeof schema.users.$inferInsert;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DrizzleStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return users[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return users[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(schema.users).values(user).returning();
    return newUser;
  }
}

export const storage = new DrizzleStorage();