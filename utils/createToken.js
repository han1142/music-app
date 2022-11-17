const jwt = require('jsonwebtoken')

const generateTokens = (payload) => {
    const { _id } = payload;
  
    const accessToken = jwt.sign(
      { userId: _id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10h" }
    );
  
    return { accessToken };
  };

module.exports = generateTokens