const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

client.connect();
console.log(`Connected to postgres on port ${process.env.PGPORT} with host ${process.env.PGHOST} for ${process.env.PGDATABASE}`)

module.exports = client;
