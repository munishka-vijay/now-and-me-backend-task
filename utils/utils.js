const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const config = require("./config");

exports.connectDB = () => {
  mongoose.connect(config.MONGO_URL)
  .then(() => {
    console.log("Connected to db...")
  })
  .catch(err => {
    console.error(err)
  })
};

exports.getJWT = async (data) => {
  const token = jwt.sign(data, config.JWT_SECRET, {
    expiresIn: config.DEFAULT_JWT_EXPIRY,
  });
  return token;
};

exports.verifyJWT = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};

exports.getHashedPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

exports.compareHash = async (plaintext, hash) => {
  return await bcrypt.compare(plaintext, hash);
};
