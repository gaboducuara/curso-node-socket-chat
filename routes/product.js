const { Router } = require("express");
const { check } = require("express-validator");

const {
    ProductGet,
    ProductGetById,
    CreatePostProduct,
    ProductPut,
    ProductDelete
} = require("../controllers/product");


//validaciones
const { productById , CategoryById } = require("../helpers/db-validator");

//middlewares
const {validarCampos,
  validarjwt,
  tieneRole,
  esAdminRole
} = require('../middlewares')

const router = Router();
// Obtener todos los productos  - Public
router.get("/", ProductGet);

//Obtener los productos por id - Public
router.get("/:id", [
    check('id','No es un Id de mongo valido').isMongoId(),
    check('id').custom( productById ),
    validarCampos], ProductGetById);

//Crear producto - privado - cualquier persona con token valido
router.post("/", [ 
    validarjwt , 
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('category','No es un Id de mongo').isMongoId(),
    check('category').custom( CategoryById ),
    validarCampos,
], CreatePostProduct );

//Actualizar - privado - cualquiera con token valido
router.put("/:id", [
    validarjwt,
    // check('category','No es un Id de mongo').isMongoId(),
    check('id').custom( productById ),
    validarCampos,
],  ProductPut);

// Borrar una categoria - Admin ---> solo si es un administrador va a poder borrar
router.delete("/:id", [
    validarjwt,
    esAdminRole,
    // tieneRole('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE', 'NOSE_ROLE'),
    check('id','No es un Id de mongo valido').isMongoId(),
    check('id').custom( productById ), 
    validarCampos
],  ProductDelete);


module.exports = router;