import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import * as relations from "./relations";

config({ path: ".env" }); // or .env.local

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...schema, ...relations },
});
