// src/db.js
// Verbindungsaufbau zu MongoDB über den nativen Node.js-Driver.
// Kein ORM (z. B. Mongoose) gemäss Entscheid in Kapitel 4.1.1.

import { MongoClient } from 'mongodb';

let client;
let db;

/**
 * Baut die Verbindung zu MongoDB auf und cached die DB-Instanz.
 * @param {string} uri - MongoDB-Connection-String (z. B. aus .env: MONGO_URL)
 * @param {string} dbName - Name der zu verwendenden Datenbank
 * @returns {Promise<import('mongodb').Db>}
 */
export async function connectDB(uri, dbName = 'ecosteel') {
  if (db) return db; // bereits verbunden -> vorhandene Instanz zurückgeben

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log(`[db] Verbunden mit MongoDB-Datenbank "${dbName}"`);
  return db;
}

/** Schliesst die Verbindung sauber (z. B. beim Herunterfahren des Servers). */
export async function closeDB() {
  if (client) {
    await client.close();
    db = undefined;
  }
}
