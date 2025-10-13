import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
// Fix: Use default import for pg module (ESM compatibility in Vercel)
import pg from 'pg';
const { Pool } = pg;

import * as schema from '../../shared/schema.js';
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
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
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

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.googleId, googleId));
    return users[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(schema.users).values(user).returning();
    return newUser;
  }
}

export const storage = new DrizzleStorage();