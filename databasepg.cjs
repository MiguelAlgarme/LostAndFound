const pgp = require('pg-promise')();

const db = pgp({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'admin',
  database: 'LostAndFound'
});


module.exports = db;