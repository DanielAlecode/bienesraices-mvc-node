import express from 'express';
import { formularioLogin, formularioRegistro, cerrarSesion, formularioOlvidePassword, registrar, confirmar, resetPassword, comprobarToken, nuevoPassword, autenticar} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login', autenticar);
//Cerrar sesion
router.post('/cerrar-sesion', cerrarSesion);
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);
//comprobar token y cambiar password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

router.get('/confirmar/:token', confirmar);

export default router;