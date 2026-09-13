// src/middleware/auth.js
// Einfache API-Key-Prüfung zur Absicherung der API vor nicht autorisierten Aufrufen.
// Der erwartete Key wird über die Umgebungsvariable API_KEY konfiguriert (siehe .env.example).

export function requireApiKey(req, res, next) {
  const providedKey = req.header('x-api-key');
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    // Fail-safe: Ohne konfigurierten Key darf der Server nicht unbeabsichtigt offen sein.
    return res.status(500).json({ error: 'Serverkonfigurationsfehler: API_KEY ist nicht gesetzt.' });
  }

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({ error: 'Nicht autorisiert: gültiger x-api-key-Header erforderlich.' });
  }

  next();
}
