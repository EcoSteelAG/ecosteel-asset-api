// src/app.js
// Baut die Express-Applikation inkl. Sicherheits-Middleware und Routing auf.
// Der eigentliche Serverstart (app.listen) erfolgt separat in server.js, damit
// die App in Tests (supertest) ohne offenen Netzwerk-Port verwendet werden kann.

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createAssetRouter } from './routes/assets.js';
import { requireApiKey } from './middleware/auth.js';

export function createApp(db) {
  const app = express();

  // Sicherheits-Middleware (siehe Kapitel 4.1.1: Helmet, CORS, Zod-Validierung in den Routen)
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());

  // Health-Check ohne Auth (für Deployment-Monitoring, siehe Kapitel 4.4)
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  // Einfache Willkommens-Route für die Startseite (kein API-Endpunkt)
  app.get('/', (req, res) => res.status(200).json({ status: 'EcoSteel Asset-API läuft', docs: '/api/assets' }));

  // Alle /api/assets-Endpunkte erfordern einen gültigen API-Key
  app.use('/api/assets', requireApiKey, createAssetRouter(db));

  // Zentrales Error-Handling für unerwartete Fehler
  app.use((err, req, res, next) => {
    console.error('[error]', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  });

  return app;
}