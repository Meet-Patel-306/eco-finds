import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!); // Neon HTTP client
export const db = drizzle(sql, { schema });
