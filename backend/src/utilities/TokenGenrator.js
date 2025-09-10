const crypto = require("crypto");

const generateShareToken = () => {
  const sharetoken = crypto.randomBytes(16).toString("hex");
  console.log(sharetoken)
  return sharetoken;
};

module.exports = { generateShareToken };
