const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Import bcrypt
const app = express();
const db = require('./databasepg.cjs');
app.use(bodyParser.json());


async function registerUser(firstName, lastName, email, plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10); 
    //more salt rounds mean more iterations so less hackas

    await db.none(
      'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, email, hashedPassword]
    );
  } catch (error) {
    throw error;
  }
}


async function loginUser(email, providedPassword) {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

    if (user) {
  
      const passwordsMatch = await bcrypt.compare(providedPassword, user.password);

      if (passwordsMatch) {
        return user;
      }
    }



    return null;
  } catch (error) {
    throw error;
  }
}


app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    await registerUser(firstName, lastName, email, password);

    // If registration is successful
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    // If registration fails
    res.status(500).json({ error: 'Registration failed' });
  }
});



app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    await loginUser(email, password);
    // If login is successful
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {

    // If login fails
    res.status(401).json({ error: 'Login failed' });
  }
});










const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
