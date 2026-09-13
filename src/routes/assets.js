// src/routes/assets.js
// Implementiert die in Kapitel 4.1.3 (OpenAPI/YAML) entworfene Web-API für das
// Datenobjekt "Asset". Die Route erhält den DB-Handle per Dependency Injection
// (createAssetRouter(db)), damit sie ohne echte Datenbank testbar bleibt.

import { Router } from 'express';
import * as assetRepository from '../repositories/assetRepository.js';
import { assetInputSchema, assetPatchSchema } from '../validation/assetSchema.js';

export function createAssetRouter(db) {
  const router = Router();

  // GET /assets - Liste aller Assets abrufen
  router.get('/', async (req, res) => {
    const assets = await assetRepository.findAll(db);
    res.status(200).json(assets);
  });

  // POST /assets - Neues Asset anlegen
  router.post('/', async (req, res) => {
    const parseResult = assetInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Ungültige Eingabedaten', details: parseResult.error.flatten() });
    }
    const created = await assetRepository.create(db, parseResult.data);
    res.status(201).json(created);
  });

  // GET /assets/:assetId - Einzelnes Asset abrufen
  router.get('/:assetId', async (req, res) => {
    const asset = await assetRepository.findById(db, req.params.assetId);
    if (!asset) return res.status(404).json({ error: 'Asset nicht gefunden' });
    res.status(200).json(asset);
  });

  // PATCH /assets/:assetId - Asset teilweise aktualisieren
  router.patch('/:assetId', async (req, res) => {
    const parseResult = assetPatchSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Ungültige Eingabedaten', details: parseResult.error.flatten() });
    }
    const updated = await assetRepository.update(db, req.params.assetId, parseResult.data);
    if (!updated) return res.status(404).json({ error: 'Asset nicht gefunden' });
    res.status(200).json(updated);
  });

  // DELETE /assets/:assetId - Asset löschen
  router.delete('/:assetId', async (req, res) => {
    const deleted = await assetRepository.remove(db, req.params.assetId);
    if (!deleted) return res.status(404).json({ error: 'Asset nicht gefunden' });
    res.status(204).send();
  });

  return router;
}
