import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Cargar variables de entorno desde `.env` (si existe).
// Esto es útil en desarrollo; en producción normalmente se usan variables de entorno del sistema.
// Buscamos `.env` en el directorio actual (process.cwd()) y en la raíz del proyecto (~../.env).
const appDir = path.dirname(fileURLToPath(import.meta.url));
const candidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(appDir, "../.env"),
];
const envPath = candidates.find((candidate) => fs.existsSync(candidate));
if (envPath) {
  dotenv.config({ path: envPath });
}

const requiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const MAIL_USER = requiredEnv("MAIL_USER");
export const MAIL_PASS = requiredEnv("MAIL_PASS");

export const APP_URL = process.env.APP_URL ?? "http://localhost:5173";

export const DB_HOST = process.env.DB_HOST ?? "sql5.freesqldatabase.com";
export const DB_USER = process.env.DB_USER ?? "sql5819687";
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "dM4Vw2ZjMc";
export const DB_NAME = process.env.DB_NAME ?? "sql5819687";

export const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret-cambiame";
