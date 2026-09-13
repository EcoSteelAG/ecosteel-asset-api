// src/validation/assetSchema.js
// Validiert eingehende Asset-Daten, bevor sie den Data-Access-Layer erreichen.
// Konsistent mit dem OpenAPI-Schema "AssetInput" aus Kapitel 4.1.3.

import { z } from 'zod';

export const assetInputSchema = z.object({
  name: z.string().min(1, 'name darf nicht leer sein'),
  standort: z.string().min(1, 'standort darf nicht leer sein'),
  status: z.enum(['aktiv', 'wartung', 'ausser_betrieb']),
  letzteWartung: z.string().date().optional(),
  naechsteWartung: z.string().date().optional(),
});

// Für PATCH: alle Felder optional, aber mindestens eines muss vorhanden sein.
export const assetPatchSchema = assetInputSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Mindestens ein Feld muss zum Aktualisieren angegeben werden' }
);
