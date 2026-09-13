import { createApp } from '../src/app.js';
import { createFakeDb } from '../src/test/fakeDb.js';

process.env.API_KEY = 'change-me-please';
const app = createApp(createFakeDb());
app.listen(3000, () => console.log('test-server listening on 3000'));
