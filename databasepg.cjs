const pgp = require('pg-promise')();

const db = pgp({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'admin',
  database: 'postgres' //Different for you
});


module.exports = db;