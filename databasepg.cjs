const pgp = require('pg-promise')();

const db = pgp({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'admin',
  database: 'postgres'
});

db.any('SELECT * FROM users')
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
