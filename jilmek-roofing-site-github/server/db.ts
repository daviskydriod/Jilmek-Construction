import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertPropertyListing,
  InsertRoofingProduct,
  InsertUser,
  PropertyListing,
  RoofingProduct,
  propertyListings,
  roofingProducts,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => {
    if (user[field] === undefined) return;
    const normalized = user[field] ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  });
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listPublishedRoofingProducts(): Promise<RoofingProduct[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(roofingProducts).where(eq(roofingProducts.isPublished, true)).orderBy(asc(roofingProducts.sortOrder), desc(roofingProducts.createdAt));
}

export async function listPublishedPropertyListings(): Promise<PropertyListing[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(propertyListings).where(eq(propertyListings.isPublished, true)).orderBy(desc(propertyListings.isFeatured), desc(propertyListings.createdAt));
}

export async function listAllRoofingProducts(): Promise<RoofingProduct[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(roofingProducts).orderBy(asc(roofingProducts.sortOrder), desc(roofingProducts.createdAt));
}

export async function listAllPropertyListings(): Promise<PropertyListing[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(propertyListings).orderBy(desc(propertyListings.createdAt));
}

export async function createRoofingProduct(input: InsertRoofingProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(roofingProducts).values(input);
  return listAllRoofingProducts();
}

export async function updateRoofingProduct(id: number, input: Partial<InsertRoofingProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(roofingProducts).set(input).where(eq(roofingProducts.id, id));
  return listAllRoofingProducts();
}

export async function deleteRoofingProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(roofingProducts).where(eq(roofingProducts.id, id));
  return listAllRoofingProducts();
}

export async function createPropertyListing(input: InsertPropertyListing) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(propertyListings).values(input);
  return listAllPropertyListings();
}

export async function updatePropertyListing(id: number, input: Partial<InsertPropertyListing>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(propertyListings).set(input).where(eq(propertyListings.id, id));
  return listAllPropertyListings();
}

export async function deletePropertyListing(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(propertyListings).where(eq(propertyListings.id, id));
  return listAllPropertyListings();
}
