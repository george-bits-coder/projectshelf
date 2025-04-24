const User = require('../models/User');

const generateUsername = async (name) => {
  // Convert name to lowercase and replace spaces with underscores
  let baseUsername = name.toLowerCase().replace(/\s+/g, '_');
  
  let username = baseUsername;
  let counter = 1;
  let usernameExists = true;

  // Check if username exists and append number if it does
  while (usernameExists) {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      usernameExists = false;
    } else {
      username = `${baseUsername}_${counter}`;
      counter++;
    }
  }

  return username;
};

module.exports = { generateUsername };