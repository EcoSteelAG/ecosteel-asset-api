// src/repositories/assetRepository.js
// Data-Access-Layer (siehe Komponentendiagramm Kapitel 4.1.2): kapselt sämtliche
// CRUD-Operationen auf der Collection "assets". Die Routen (routes/assets.js)
// greifen ausschliesslich über diese Funktionen auf die Datenbank zu.

import { ObjectId } from 'mongodb';

const COLLECTION = 'assets';

/** Liest alle Assets. */
export async function findAll(db) {
  return db.collection(COLLECTION).find().toArray();
}

/** Liest ein einzelnes Asset über die ID. Gibt null zurück, wenn nicht gefunden oder ID ungültig. */
export async function findById(db, id) {
  if (!ObjectId.isValid(id)) return null;
  return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
}

/** Legt ein neues Asset an und gibt das gespeicherte Dokument zurück. */
export async function create(db, assetData) {
  const doc = { ...assetData, erstelltAm: new Date().toISOString() };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

/** Aktualisiert ein bestehendes Asset teilweise (PATCH-Semantik). Gibt das aktualisierte Dokument oder null zurück. */
export async function update(db, id, partialData) {
  if (!ObjectId.isValid(id)) return null;
  const filter = { _id: new ObjectId(id) };
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    filter,
    { $set: partialData },
    { returnDocument: 'after' }
  );
  return result;
}

/** Löscht ein Asset. Gibt true zurück, wenn ein Dokument gelöscht wurde. */
export async function remove(db, id) {
  if (!ObjectId.isValid(id)) return false;
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
