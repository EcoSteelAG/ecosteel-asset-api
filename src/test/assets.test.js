// src/test/assets.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { createFakeDb } from './fakeDb.js';

const API_KEY = 'test-key';
process.env.API_KEY = API_KEY;

function client() {
  const db = createFakeDb();
  const app = createApp(db);
  return request(app);
}

describe('Asset-API (Basisfälle: neu, suchen, ändern, löschen)', () => {
  it('GET /api/assets ohne API-Key liefert 401', async () => {
    const res = await client().get('/api/assets');
    expect(res.status).toBe(401);
  });

  it('GET /api/assets mit gültigem Key liefert leere Liste', async () => {
    const res = await client().get('/api/assets').set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/assets legt ein neues Asset an (201)', async () => {
    const c = client();
    const res = await c.post('/api/assets').set('x-api-key', API_KEY).send({
      name: 'Kompressor Halle 3',
      standort: 'Zürich',
      status: 'aktiv',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Kompressor Halle 3');
  });

  it('POST /api/assets mit ungültigen Daten liefert 400', async () => {
    const res = await client().post('/api/assets').set('x-api-key', API_KEY).send({
      name: '',
      status: 'kaputt', // nicht im enum
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/assets/:id findet ein zuvor angelegtes Asset', async () => {
    const app = createApp(createFakeDb());
    const agent = request(app);
    const created = await agent.post('/api/assets').set('x-api-key', API_KEY).send({
      name: 'Pumpe P-12', standort: 'Sion', status: 'aktiv',
    });
    const res = await agent.get(`/api/assets/${created.body._id}`).set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Pumpe P-12');
  });

  it('GET /api/assets/:id mit unbekannter ID liefert 404', async () => {
    const res = await client()
      .get('/api/assets/64b64c4c4c4c4c4c4c4c4c4c')
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(404);
  });

  it('PATCH /api/assets/:id aktualisiert den Status', async () => {
    const app = createApp(createFakeDb());
    const agent = request(app);
    const created = await agent.post('/api/assets').set('x-api-key', API_KEY).send({
      name: 'Förderband F-1', standort: 'Basel', status: 'aktiv',
    });
    const res = await agent
      .patch(`/api/assets/${created.body._id}`)
      .set('x-api-key', API_KEY)
      .send({ status: 'wartung' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('wartung');
  });

  it('DELETE /api/assets/:id löscht ein Asset (204), danach 404 bei erneutem Abruf', async () => {
    const app = createApp(createFakeDb());
    const agent = request(app);
    const created = await agent.post('/api/assets').set('x-api-key', API_KEY).send({
      name: 'Kran K-9', standort: 'Genf', status: 'aktiv',
    });
    const del = await agent.delete(`/api/assets/${created.body._id}`).set('x-api-key', API_KEY);
    expect(del.status).toBe(204);

    const getAfter = await agent.get(`/api/assets/${created.body._id}`).set('x-api-key', API_KEY);
    expect(getAfter.status).toBe(404);
  });
});
