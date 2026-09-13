// server.js
// Einstiegspunkt der Basis-Applikation: verbindet zur Datenbank und startet
// den Express-Server erst danach, damit keine Requests ohne DB-Verbindung
// entgegengenommen werden.

import 'dotenv/config';
import { connectDB } from './src/db.js';
import { createApp } from './src/app.js';

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';

async function main() {
  const db = await connectDB(MONGO_URL, process.env.DB_NAME || 'ecosteel');
  const app = createApp(db);

  app.listen(PORT, () => {
    console.log(`[server] EcoSteel Asset-API läuft auf http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('[server] Start fehlgeschlagen:', err);
  process.exit(1);
});
