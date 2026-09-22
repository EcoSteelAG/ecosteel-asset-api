// src/validation/assetSchema.test.js
// Unit-Tests für die Zod-Validierungsschemas (assetInputSchema, assetPatchSchema).
// Reine Funktionslogik ohne Datenbankzugriff, daher ideal für Vitest.

import { describe, it, expect } from 'vitest';
import { assetInputSchema, assetPatchSchema } from './assetSchema.js';

const validAsset = {
    name: 'Kompressor Halle 3',
    standort: 'Zürich',
    status: 'aktiv',
    hersteller: 'Atlas Copco',
    kategorie: 'Druckluft & Kompressoren',
    seriennummer: 'AC-2024-8841',
    lieferant: 'Atlas Copco Schweiz AG',
    kaufdatum: '2024-03-15',
    betriebsstunden: 120,
    kaufpreis: 18500,
    naechsteWartung: '2026-12-01',
    notiz: 'Testdatensatz',
};

describe('assetInputSchema', () => {
    it('akzeptiert einen vollständig ausgefüllten, gültigen Datensatz', () => {
        const result = assetInputSchema.safeParse(validAsset);
        expect(result.success).toBe(true);
    });

    it('lehnt einen Datensatz mit leerem Namen ab', () => {
        const result = assetInputSchema.safeParse({ ...validAsset, name: '' });
        expect(result.success).toBe(false);
    });

    it('lehnt einen ungültigen Status ab', () => {
        const result = assetInputSchema.safeParse({ ...validAsset, status: 'kaputt' });
        expect(result.success).toBe(false);
    });

    it('lehnt eine ungültige Kategorie ab', () => {
        const result = assetInputSchema.safeParse({ ...validAsset, kategorie: 'Erfundene Kategorie' });
        expect(result.success).toBe(false);
    });

    it('lehnt negative Betriebsstunden ab', () => {
        const result = assetInputSchema.safeParse({ ...validAsset, betriebsstunden: -5 });
        expect(result.success).toBe(false);
    });

    it('lehnt einen Datensatz mit fehlendem Pflichtfeld (kaufdatum) ab', () => {
        const { kaufdatum, ...withoutKaufdatum } = validAsset;
        const result = assetInputSchema.safeParse(withoutKaufdatum);
        expect(result.success).toBe(false);
    });
});

describe('assetPatchSchema', () => {
    it('akzeptiert ein Teilupdate mit nur einem Feld', () => {
        const result = assetPatchSchema.safeParse({ status: 'wartung' });
        expect(result.success).toBe(true);
    });

    it('lehnt ein leeres Objekt ab (mindestens ein Feld nötig)', () => {
        const result = assetPatchSchema.safeParse({});
        expect(result.success).toBe(false);
    });
});