const { Router } = require("express");
const { check } = require("express-validator");
//middleware
const { validarCampos , ValidateArchiveUpload } = require("../middlewares");
const { cargarArchivo, updateImageCloudinary, mostrarImg } = require('../controllers/uploads');
const { route } = require("./auth");

//helpers
const { coleccionesPermitidas } = require('../helpers/db-validator')

const router = Router();

router.post('/', ValidateArchiveUpload , cargarArchivo);

router.put('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['user' , 'product'])),
    validarCampos
],  updateImageCloudinary )

router.get('/:coleccion/:id' , [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['user' , 'product'])),
    validarCampos
] , mostrarImg);


module.exports = router;

// eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2OTY5YWVjMzdhNzc4MGYxODgwNzg3NzU5M2JiYmY4Y2Y1ZGU1Y2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODIxMDAwMDIsImF1ZCI6IjMwODUzMDcwNjc1OC11dWhsMGNyaW01bW44dmJ0amtkZGZtOHZzMTRkdWhvZC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExODEwNjU1Mjk3MTM1Mzg2NTM1MCIsImVtYWlsIjoiZ2FicmllbG1hbmNpbGxhZHVjdWFyYS4xMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMzA4NTMwNzA2NzU4LXV1aGwwY3JpbTVtbjh2YnRqa2RkZm04dnMxNGR1aG9kLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6ImdhYnJpZWwgbWFuY2lsbGEgZHVjdWFyYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BR05teXhZZDR6dVBYMUl0NFhQS1dMM0dNWW1WRE1sbVE4aTRlb0VjSFUzQz1zOTYtYyIsImdpdmVuX25hbWUiOiJnYWJyaWVsIiwiZmFtaWx5X25hbWUiOiJtYW5jaWxsYSBkdWN1YXJhIiwiaWF0IjoxNjgyMTAwMzAyLCJleHAiOjE2ODIxMDM5MDIsImp0aSI6IjY4NWM5YzM5M2QxMjM2MzlmZDRkYTQ1NTkxOGVhZWJkMjhkNjE0YTEifQ.WMDoFlY83pTyXsj0LMGNML9XvPtGeM5aiDC21bs2WmRjhBOeD11L63fggJx4-qvHmw_-3dhgpTV4dolM_AgesqM5B6yTKVOOtpSKVGD0MJQtwvZWcb8vEKCAzIvt3WiveB0k9uDmPIl1jS4goi-qLD8LvG4vywNG8Y1tES_Lx8LYggbNFAIG1nk6R_cT4gHDdXBVgp05R225VsKgYjAnAyVi8kmkXv1JjNScybPup-sXS-lX6Md0tINb-Mx-q9Uxo_KoV8ZCosA7K5_NtjI4TJ62zc9k193AX1hyYZv4_DVEDfQUP4TqxWiFRQnOtU4kQK7YQWzSyCvjaDei4850mw