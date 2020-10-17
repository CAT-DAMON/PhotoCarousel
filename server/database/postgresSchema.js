// const { Client } = require('pg');
// const dotenv = require('dotenv');

// const client = new Client({
//   host: process.env.PGHOST,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// })
// client.connect();

// const tableQuery = `
// CREATE TABLE photo_carousel (
//   id serial PRIMARY KEY,
//   productId int NOT NULL,
//   name varchar,
//   photos varchar,
// );
// `
// // try {
// //   const createDB = await client.query('CREATE DATABASE sdc');
// //   const useDB = await client.query('USE DATABASE sdc');
// //   const createTable = await client.query(tableQuery);
// // } catch (err) {
// //   console.err(err.stack);
// // }

// module.exports = client;
