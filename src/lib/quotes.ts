import { getDb } from "./db";

export type Quote = {
  id: number;
  text: string;
  source: string | null;
  created_at: string;
};

export function createQuote(text: string, source?: string): Quote {
  const db = getDb();
  const stmt = db.prepare<[string, string | null], Quote>(
    "INSERT INTO quotes (text, source) VALUES (?, ?) RETURNING *",
  );
  return stmt.get(text, source ?? null)!;
}

export function getLatestQuote(): Quote | undefined {
  const db = getDb();
  return db
    .prepare<[], Quote>("SELECT * FROM quotes ORDER BY id DESC LIMIT 1")
    .get();
}

export function getQuotes(limit = 20, offset = 0): Quote[] {
  const db = getDb();
  return db
    .prepare<[number, number], Quote>(
      "SELECT * FROM quotes ORDER BY id DESC LIMIT ? OFFSET ?",
    )
    .all(limit, offset);
}

export function getQuoteById(id: number): Quote | undefined {
  const db = getDb();
  return db
    .prepare<[number], Quote>("SELECT * FROM quotes WHERE id = ?")
    .get(id);
}

export function updateQuote(
  id: number,
  text: string,
  source?: string,
): Quote | undefined {
  const db = getDb();
  return db
    .prepare<[string, string | null, number], Quote>(
      "UPDATE quotes SET text = ?, source = ? WHERE id = ? RETURNING *",
    )
    .get(text, source ?? null, id);
}

export function deleteQuote(id: number): boolean {
  const db = getDb();
  const result = db
    .prepare<[number]>("DELETE FROM quotes WHERE id = ?")
    .run(id);
  return result.changes > 0;
}
