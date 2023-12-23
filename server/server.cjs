const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); 
const app = express();
const db = require('../databasepg.cjs');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const LocalStrategy = require('passport-local').Strategy;
const { Pool } = require('pg');
const crypto = require('crypto');
const cookieSession = require('cookie-session');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');


const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Secret Key:', secretKey);


const pool = new Pool({
  connectionString: 'postgresql://postgres:admin@localhost:5432/postgres',
});


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentation',
      version: '1.0.0',
      description: 'Lost and Found App for the students of USC',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['../server/server.cjs'],
};



module.exports = options;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

app.use(
  session({
    store: new pgSession({
      pool,
    }),
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      /*sameSite: 'none',
      secure: true,*/  //ADD CODE WHEN RELEASED!
    },
  })
);

passport.serializeUser((user, done) => {
  console.log('Serializing ID:', user.id);
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.oneOrNone('SELECT id, firstname, lastname, email, role FROM users WHERE id = $1', [id]);
    console.log('Deserialized User:', user);

    if (!user) {
      return done(new Error('User not found'));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  console.log('Middleware:', new Date().toISOString());
  console.log('Session ID:', req.sessionID);
  console.log('User:', req.user);
  console.log('Session:', req.session);
  next();
});


passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return done(null, false, { message: 'Invalid Credentials' });
        }
        //success
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);



app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});


app.get('/api/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: { ...req.user, role: req.user.role || null } });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
/**
 * @swagger
 * /api/login:
 *   post:
 *     description: Login route
 *     parameters:
 *       - name: email
 *         description: User email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Authentication failed
 */
app.post('/api/login', (req, res, next) => {
  console.log('Login route handler called:', new Date().toISOString());
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication Error:', err);
      return res.status(500).json({ error: 'Authentication Error' });
    }

    if (!user) {
      //FAILURE
      return res.status(401).json({ error: 'Authentication Failed' });
    }

    //SUCCESS
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ error: 'Login Error' });
      }
      //SUCCESS
      res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
});


app.get('/api/all-users', async (req, res) => {
  try {
    console.log('Authenticated User:', req.user);

    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user && req.user.role !== 'ADMIN') {
      console.log('User does not have admin role');
      return res.status(403).json({ error: 'Permission DENIED' });
    }

    const users = await db.any('SELECT id, firstname, lastname, email, role FROM users');
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//----------------------------------------------DELETING CODE----------------------------
app.delete('/api/delete-user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // ADMIN ONLY
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Permission DENIED' });
    }

    const deleteQuery = 'DELETE FROM users WHERE id = $1';
    const deleteValues = [userId];
    await pool.query(deleteQuery, deleteValues);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/delete-account', (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.id;
    console.log('Deleting account for user ID:', userId);

    const deleteQuery = 'DELETE FROM users WHERE id = $1';
    const deleteValues = [userId];


    req.logout(() => {
      req.session.destroy();
      pool.query(deleteQuery, deleteValues, (error, result) => {
        if (error) {
          console.error('Error deleting account:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Account deleted successfully.');
          res.sendStatus(204);
        }
      });
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/destroy-sessions', async (req, res) => {
  try {
    const pgSessionStore = new pgSession({
      pool,
    });

    await pgSessionStore.clear();

    console.log('All sessions destroyed successfully');
    res.sendStatus(204);
  } catch (error) {
    console.error('Error destroying sessions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//----------------------------------------------DELETING CODE----------------------------

app.post('/api/founditems', async (req, res) => {
  try {
    const {
      dateFound,
      locationFound,
      specifyItem,
      description,
      founderID,
    } = req.body;
    await db.none(
      'INSERT INTO FoundItems (dateFound, locationFound, specifyItem, description, founderID) VALUES ($1, $2, $3, $4, $5)',
      [dateFound, locationFound, specifyItem, description, founderID]
    );

    res.status(201).json({ message: 'Form data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function registerUser(firstName, lastName, plainPassword, email) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existingUser = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser) {
      const error = new Error('Email already exists');
      error.status = 409;
      throw error;
    }

    await db.none(
      'INSERT INTO users (firstname, lastname, password, email) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, hashedPassword, email]
    );

    const newUser = await db.one('SELECT id, firstname, lastname, email FROM users WHERE email = $1', [email]);
    
    return newUser;
  } catch (error) {
    throw error;
  }
}


async function loginUser(email, providedPassword) {
  try {
    const user = await db.oneOrNone('SELECT id, firstname, lastname, password, email FROM users WHERE email = $1', [email]);

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



app.delete('/api/logout', (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        console.error('Logout Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        req.session.destroy((sessionErr) => {
          if (sessionErr) {
            console.error('Session Destruction Error:', sessionErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            console.log('User logged out successfully');
            res.sendStatus(204);
          }
        });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});






app.post('/api/update-profile', async (req, res) => {
  try {
    const { firstname, lastname, email, newPassword } = req.body;
    console.log('Received Data:', { firstname, lastname, email, newPassword });

    const existingUser = await db.oneOrNone('SELECT id FROM users WHERE email = $1 AND id != $2', [email, req.user.id]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    let hashedPassword = req.user.password; 

    if (newPassword) {
      hashedPassword = bcrypt.hashSync(newPassword, 10);
      console.log('Hashed Password:', hashedPassword);
    }

    
    const updatedUser = await db.oneOrNone(
      'UPDATE users SET firstname = $1, lastname = $2, email = $3, password = $4 WHERE id = $5 RETURNING *',
      [firstname, lastname, email, hashedPassword, req.user.id]
    );

    if (!updatedUser) {
      return res.status(500).json({ error: 'Profile update failed' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile update failed:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});



app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;
    console.log('Received registration request', { firstName, lastName, email });

    await registerUser(firstName, lastName, password, email);

    console.log('Registration successful:', { email });
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration failed:', error);

    if (error.status === 409) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Registration failed' });
  }
});



//swagga
const spec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


