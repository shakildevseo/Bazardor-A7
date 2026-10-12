import { mkdirSync } from "node:fs";
import { join } from "node:path";
import Database from "better-sqlite3";
import { betterAuth } from "better-auth";

const authSecret = process.env.BETTER_AUTH_SECRET;

if (process.env.NODE_ENV === "production" && !authSecret) {
  throw new Error("BETTER_AUTH_SECRET must be configured in production.");
}

if (authSecret && authSecret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters long.");
}

const dataDirectory = join(process.cwd(), "data");
mkdirSync(dataDirectory, { recursive: true });

const database = new Database(join(dataDirectory, "bazardor-auth.sqlite"));
database.pragma("journal_mode = WAL");

export const auth = betterAuth({
  appName: "Bazar Dor",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: authSecret,
  database,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false,
    minPasswordLength: 8,
  },
});