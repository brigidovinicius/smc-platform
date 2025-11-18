import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import type { Session } from 'next-auth';

export type ProfileRole = 'buyer' | 'seller' | 'admin';

export interface ProfileRecord {
  id: string;
  name: string | null;
  email: string;
  role: ProfileRole;
  created_at: string;
}

const DEFAULT_ROLE: ProfileRole = (process.env.DEFAULT_PROFILE_ROLE as ProfileRole) ?? 'buyer';

let ensureTablePromise: Promise<void> | null = null;
const databaseConfigured = Boolean(
  process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
);
let hasWarnedAboutDatabase = false;

const warnMissingDatabase = () => {
  if (!databaseConfigured && !hasWarnedAboutDatabase) {
    console.warn(
      '[profiles] Database not configured. Set POSTGRES_URL (or DATABASE_URL/POSTGRES_URL_NON_POOLING) to persist user profiles.'
    );
    hasWarnedAboutDatabase = true;
  }
  return databaseConfigured;
};

const ensureProfilesTable = async () => {
  if (!warnMissingDatabase()) {
    return;
  }
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS profiles (
          id uuid PRIMARY KEY,
          name text,
          email text UNIQUE NOT NULL,
          role text NOT NULL DEFAULT 'buyer',
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `;
    })();
  }
  await ensureTablePromise;
};

const mapRow = (row: Record<string, any>): ProfileRecord => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  created_at: row.created_at
});

export const getProfileByEmail = async (email: string): Promise<ProfileRecord | null> => {
  if (!warnMissingDatabase()) {
    return null;
  }
  await ensureProfilesTable();
  const { rows } = await sql`
    SELECT id, name, email, role, created_at
    FROM profiles
    WHERE email = ${email}
    LIMIT 1;
  `;
  return rows[0] ? mapRow(rows[0]) : null;
};

const createProfile = async (user: Session['user']): Promise<ProfileRecord | null> => {
  if (!warnMissingDatabase()) {
    return null;
  }
  await ensureProfilesTable();
  const id = randomUUID();
  const { rows } = await sql`
    INSERT INTO profiles (id, name, email, role)
    VALUES (${id}, ${user?.name ?? null}, ${user?.email}, ${DEFAULT_ROLE})
    ON CONFLICT (email) DO UPDATE
    SET name = COALESCE(EXCLUDED.name, profiles.name)
    RETURNING id, name, email, role, created_at;
  `;
  return rows[0] ? mapRow(rows[0]) : null;
};

export const ensureProfileForSessionUser = async (user: Session['user']): Promise<ProfileRecord | null> => {
  if (!user?.email) {
    return null;
  }

  if (!warnMissingDatabase()) {
    return null;
  }

  const existing = await getProfileByEmail(user.email);
  if (existing) {
    return existing;
  }

  return createProfile(user);
};
