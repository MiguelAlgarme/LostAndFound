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
const deets = require('./swagger.cjs');

/**
 * @swagger
 *     summary: Creates secret key
 *     description: uses crypto library to create a 32 bit long hex for the secret key since this will be used in the session and must be secure.
 */
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Secret Key:', secretKey);

/**
 * @swagger
 *     summary: The database
 *     description: Details on where the database is and its number, the db is the pool, the users the fish. ar ar ar
 */
const pool = new Pool({
  connectionString: 'postgresql://postgres:admin@localhost:5432/postgres',
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(deets));
app.use(bodyParser.json());


/**
 * @swagger
 *     summary: Allows different ports to talk to each other
 *     description: Cross origin resource sharing, without this the ports 5173 and 3000(where the server is at, aka this) will not be able to talk to one another, a change in the numbers will result in errors because of CORS policy.
 */
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));




/**
 * @swagger
 *     summary: In charge of sessions
 *     description: basically creates the details of the session, who it is, and how long it will exist, sameSite and secure will be activated in release, but for now it is off, since it annoyed me.
 */
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
/** 
* @swagger
* 
* summary: gives the ID to the session
* description: the session would need an identified of who it belongs to, so the passport.serializeUser gives the ID of the user since its unique.
*
**/
passport.serializeUser((user, done) => {
  console.log('Serializing ID:', user.id);
  done(null, user.id);
});
/** 
* @swagger
* 
* summary: gets the users details from the session
* description: The session stores details about the user, the passport.deserializeUser takes these and is now able to pinpoint who this user is.
*
**/
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.oneOrNone('SELECT id, firstname, lastname, email FROM users WHERE id = $1', [id]);
    console.log('Deserialized User:',user);
    
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

/**
 * @swagger
 *     summary: Logging
 *     description: I would cover the entire code in console logs to make sure everything is flowing properly
 */
app.use((req, res, next) => {
  console.log('Middleware:', new Date().toISOString());
  console.log('Session ID:', req.sessionID);
  console.log('User:', req.user);
  console.log('Session:', req.session);
  next();
});


/** 
* @swagger
* passport.use
* summary: Authenticates user using passport.js
* description: Authenticates the user if it exists using passport.js, using the EMAIL and PASSWORD, might be changed to USERNAME if needed.
*
**/
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



/** 
* @swagger
* /profile
* get
* summary: DUPLICATE, DO NOT USE. Authenticates user
* description: DUPLICATE DO NOT USE. intended for backup that wasn't removed for some reason. Authenticates the user if it exists, if it doesn't it throws unauthorized in console
*
**/
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

/** 
* @swagger
* /api/profile
* get
* summary: Authenticates user
* description: Authenticates the user if it exists, if it doesn't it throws unauthorized in console
*
**/
app.get('/api/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});


/** 
* @swagger
* post
* summary: logs users in
* description: Login endpoint, uses passport to authenticate the users details and logs them in
*
**/
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


/** 
* @swagger
* Logout endpoint currently a work in progress due to sessions not being able to identify the user's ID
**/

app.delete('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('User logged out successfully');
      res.sendStatus(204);
    }
  });
});


/** 
* @swagger
*summary: function to register user
*description: register function code to put the user in the db and encrypt the users password
**/
async function registerUser(firstName, lastName, plainPassword, email) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await db.none(
      'INSERT INTO users (firstname, lastname, password, email) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, hashedPassword, email]
    );

    //Gets the new users and the users details except for the passord
    const newUser = await db.one('SELECT id, firstname, lastname, email FROM users WHERE email = $1', [email]);
    
    return newUser;
  } catch (error) {
    throw error;
  }
}

/** 
* @swagger
*Login function to log the user into the site and to match the hashed password
**/
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

/** 
* @swagger
*summary: registers user
*register endpoint, talks with whoever calls this endpoint, usually only the register unless a need arises
**/
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




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
