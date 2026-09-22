// src/validation/assetSchema.js
// Validiert eingehende Asset-Daten, bevor sie den Data-Access-Layer erreichen.
// Konsistent mit dem OpenAPI-Schema "AssetInput" aus Kapitel 4.1.3.
//
// Erweiterung (Kapitel 4.3, Register "Stammdaten" / "Kauf & Wartung"):
// Alle Zusatzfelder sind PFLICHTFELDER — ein Asset kann erst gespeichert
// werden, wenn sämtliche Stammdaten sowie Kauf- und Wartungsangaben
// vorhanden sind. Die Inventarnummer ist bewusst NICHT Teil dieses Schemas,
// da sie serverseitig automatisch vergeben wird (siehe assetRepository.js,
// getNextInventarnummer) und weder bei der Erstellung noch nachträglich
// vom Client gesetzt werden kann.

import { z } from 'zod';

// Vordefinierte Kategorien für Anlagen/Assets bei EcoSteel.
export const ASSET_CATEGORIES = [
  'Druckluft & Kompressoren',
  'Fördertechnik',
  'Energieerzeugung',
  'Werkzeugmaschinen',
  'Fahrzeuge & Stapler',
  'Gebäudetechnik (HLK)',
  'IT & Netzwerk',
  'Sonstiges',
];

export const assetInputSchema = z.object({
  // Stammdaten
  name: z.string().min(1, 'name darf nicht leer sein'),
  standort: z.string().min(1, 'standort darf nicht leer sein'),
  status: z.enum(['aktiv', 'wartung', 'ausser_betrieb']),
  hersteller: z.string().min(1, 'hersteller darf nicht leer sein'),
  kategorie: z.enum(ASSET_CATEGORIES, { message: 'kategorie muss aus der vordefinierten Liste gewählt werden' }),
  seriennummer: z.string().min(1, 'seriennummer darf nicht leer sein'),
  lieferant: z.string().min(1, 'lieferant darf nicht leer sein'),

  // Kauf & Wartung
  kaufdatum: z.string().date('kaufdatum muss ein gültiges Datum sein'),
  betriebsstunden: z.coerce.number().nonnegative('betriebsstunden dürfen nicht negativ sein'),
  kaufpreis: z.coerce.number().nonnegative('kaufpreis darf nicht negativ sein'),
  naechsteWartung: z.string().date('naechsteWartung muss ein gültiges Datum sein'),
  notiz: z.string().min(1, 'notiz darf nicht leer sein'),
});

// Für PATCH: alle Felder optional, aber mindestens eines muss vorhanden sein.
// Auch beim Aktualisieren bleibt inventarnummer unveränderbar (nicht Teil
// des Schemas), damit die einmal vergebene Nummer stabil bleibt.
export const assetPatchSchema = assetInputSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Mindestens ein Feld muss zum Aktualisieren angegeben werden' }
);