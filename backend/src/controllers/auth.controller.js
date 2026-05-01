
const respond = require('../lib/responseFormat');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

async function hashPassword(password) {
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return respond(res, false, 400, 'All fields are required', {});
    }

    const isAlreadyUser = await User.findOne({ email });
    if (isAlreadyUser) {
      return respond(res, false, 400, 'User already exists', {});
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    return respond(res, true, 201, {
      message: 'User Account Created Successfully!',
      token: token
    }, {});

  } catch (error) {
    console.log('\n\n😱 Error saving new user:', error);
    return respond(res, false, 500, 'Error Saving User', {});
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return respond(res, false, 400, 'Invalid credentials', {});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return respond(res, false, 400, 'Invalid credentials', {});
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return respond(res, true, 200, {
      message: 'Login successful',
      token: token
    }, {});

  } catch (error) {
    console.log('\n\n😱 Error during login:', error);
    return respond(res, false, 500, 'Login failed', {});
  }
};

module.exports = { register, login };