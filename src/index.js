import app from './app.js';
import dotenv from 'dotenv';
import knex from 'knex';
import config from './db/knexfile.js';

dotenv.config({ path: './.env' });

const port = process.env.PORT || 5000;
const db = knex(config);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
