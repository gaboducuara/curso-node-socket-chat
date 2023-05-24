const validarCampos = require("../middlewares/validar-campos");
const validarjwt = require("../middlewares/validar-jwt");
const validarRoles = require("../middlewares/validar-roles");
const ValidateArchiveUpload  = require("./validar-archivo");

module.exports = {
    ...validarCampos,
    ...validarjwt,
    ...validarRoles,
    ...ValidateArchiveUpload
}