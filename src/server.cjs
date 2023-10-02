const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Import bcrypt
const app = express();
const db = require('../databasepg.cjs');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

//FUCKING FINALLY REGISTER AND LOGIN NOW WORKSFJNSDKLFHSKADF
async function registerUser(firstName, lastName, plainPassword, email) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10); 
    //more salt rounds mean more iterations so less hackas

    await db.none(
      'INSERT INTO users (firstname, lastname, password, email) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, hashedPassword, email]
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

    console.log('User:', user); 
    return null;
  } catch (error) {
    throw error;
  }
}


app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;
    console.log('Received registration request', { firstName, lastName, email });

    await registerUser(firstName, lastName, password, email);

    console.log('Registration successful:', { email });
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});




app.post('/api/login', async (req, res) => {
  console.log('Received login request');
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password); 

      console.log('providedPassword:', password);
      console.log('user.password:', user.password);
      console.log('passwordsMatch:', passwordsMatch);

      if (passwordsMatch) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid Credentials' });
      }
    } else {
      res.status(401).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login Error' });
  }
});











const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
