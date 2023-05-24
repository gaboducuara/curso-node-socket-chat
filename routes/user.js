const { Router } = require("express");
const { check } = require("express-validator");
const {
  userGet,
  userPost,
  userPut,
  userDelete,
  userPatch,
} = require("../controllers/user");

//middlewares
const { esRolValido , EmailExiste , UserById } = require("../helpers/db-validator");

const {validarCampos,
  validarjwt,
  tieneRole,
  esAdminRole
} = require('../middlewares')
// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarjwt } = require("../middlewares/validar-jwt");
// const { esAdminRole ,  tieneRole } = require("../middlewares/validar-roles");

const router = Router();

router.get("/", userGet);
// en el post se agrega check que es un middlewares que viene con express-validator
router.post("/", [
  check('name', 'El nombre debe ser obligatorio').not().isEmpty(),
  check('email' , 'El email no es valido' ).isEmail(),
  check('email').custom( EmailExiste ),
  check('password', 'La contraseña debe ser obligatoria y mas de 6 caracteres').not().isEmpty().isLength({ min:6 }),
  check('rol', 'El rol debe ser obligatorio').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  // check('rol').custom(esRolValido ), 
  validarCampos ] , 
userPost );

router.put("/:id",  [
  check('id','No es un Id valido').isMongoId(), 
  check('id').custom( UserById ), check('rol').custom( esRolValido ), 
  validarCampos
  ] , userPut);
  
router.delete("/:id", [
  validarjwt ,
  // esAdminRole, ---> Este middleware nos sirve o fuerza a que el usuario sea el administrador
  
  // Este middleware no estan restrictivo, se puede usar en base a los roles que se desean loguear
  tieneRole('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE', 'NOSE_ROLE'),
  check('id','No es un Id valido').isMongoId(), 
  check('id').custom(UserById), validarCampos
] , userDelete);


router.patch("/:id", userPatch);

module.exports = router;
