const dbvalidator = require("./db-validator");
const generarjwt = require("./generar-jwt");
const googleVerify = require("./google-verify");
const uploadArchive = require("./uploadArchive");

module.exports = {
  ...dbvalidator,
  ...generarjwt,
  ...googleVerify,
  ...uploadArchive,
};
