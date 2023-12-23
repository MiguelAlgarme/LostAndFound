// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./path-to-your-db-file'); // Import your database connection

// Create an Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST route to handle form submission and insert data into the database
app.post('/submit-form', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateFound,
      locationFound,
      specifyItem,
      description,
      image, // Assuming you'll handle this in a specific way on the server
      founderID,
    } = req.body;

    // Use the db connection to execute the INSERT query
    await db.none(
      'INSERT INTO FoundItems (firstName, lastName, dateFound, locationFound, specifyItem, description, image, founderID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [firstName, lastName, dateFound, locationFound, specifyItem, description, image, founderID]
    );

    res.status(201).json({ message: 'Form data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
