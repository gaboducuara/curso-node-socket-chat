const { Router } = require("express");
const { check } = require("express-validator");
const {
    CategoryGet,
    CategoryGetById,
    CategoryPut,
    CategoryDelete,
    CreatePostCategory
} = require("../controllers/categories");

//validaciones
const { CategoryById } = require("../helpers/db-validator");

//middlewares
const {validarCampos,
  validarjwt,
  tieneRole,
  esAdminRole
} = require('../middlewares')

const router = Router();

// Obtener todas las categorias  - Public
router.get("/", CategoryGet);

//Obtener categoria por id - Public
router.get("/:id", [
    check('id','No es un Id de mongo valido').isMongoId(),
    check('id').custom(CategoryById),
    validarCampos], CategoryGetById );

//Crear categoria - privado - cualquier persona con token valido
router.post("/", [ 
    validarjwt , 
    check('name','El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], CreatePostCategory );

//Actualizar - privado - cualquiera con token valido
router.put("/:id", [
    validarjwt,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(CategoryById),
    validarCampos,
],  CategoryPut);

// Borrar una categoria - Admin ---> solo si es un administrador va a poder borrar
router.delete("/:id", [
    validarjwt,
    esAdminRole,
    // tieneRole('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE', 'NOSE_ROLE'),
    check('id','No es un Id de mongo valido').isMongoId(),
    check('id').custom(CategoryById), 
    validarCampos
],  CategoryDelete);


module.exports = router;