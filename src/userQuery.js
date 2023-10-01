const db = require('./databasepg.cjs');
const bcrypt = require('bcrypt');  //YOU NEED THIS FOR HASHING

async function registerUser(firstName, lastName, email, plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 is the number of salt rounds
      //more salt rounds the more iterations, so no hackas, maybe
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
      // Compare provided password with stored hashed password
      const passwordsMatch = await bcrypt.compare(providedPassword, user.password);

      if (passwordsMatch) {
        // User is authenticated
        return user;
      }
    }

    // User not found or password is incorrect
    return null;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  registerUser,
  loginUser
};
