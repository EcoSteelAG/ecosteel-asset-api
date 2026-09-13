// src/test/fakeDb.js
// Minimaler In-Memory-Ersatz für eine MongoDB-Collection, ausschliesslich für
// Unit-/Integrationstests. Implementiert genau die Methoden, die
// assetRepository.js tatsächlich verwendet (insertOne, find, findOne,
// findOneAndUpdate, deleteOne), inkl. echter ObjectId aus dem mongodb-Package,
// damit die Test-Logik dieselben ID-Regeln durchläuft wie im Produktivbetrieb.

import { ObjectId } from 'mongodb';

export function createFakeDb() {
  const store = new Map(); // _id (string) -> document

  const collection = {
    async insertOne(doc) {
      const _id = new ObjectId();
      store.set(_id.toHexString(), { _id, ...doc });
      return { insertedId: _id };
    },
    find() {
      return { toArray: async () => Array.from(store.values()) };
    },
    async findOne(filter) {
      const id = filter._id?.toHexString?.();
      return store.get(id) ?? null;
    },
    async findOneAndUpdate(filter, update) {
      const id = filter._id?.toHexString?.();
      const existing = store.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...update.$set };
      store.set(id, updated);
      return updated;
    },
    async deleteOne(filter) {
      const id = filter._id?.toHexString?.();
      const existed = store.has(id);
      store.delete(id);
      return { deletedCount: existed ? 1 : 0 };
    },
  };

  return { collection: () => collection };
}
