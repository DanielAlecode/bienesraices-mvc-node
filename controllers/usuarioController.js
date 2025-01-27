import { check, validationResult, body } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailRegistro, olvidePassword } from "../helpers/emails.js";

// Renderizado de formularios
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    });
}

const autenticar = async (req, res) => {
    //validaciones
    await check('email').isEmail().withMessage('Tienes que establecer un email válido').run(req);
    await check('password').notEmpty().withMessage('La contraseña no debe estar vacía').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    } else {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.render('auth/login', {
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errores: [{ msg: 'El usuario o la contraseña no coinciden.' }]
            });
        } else {
            if (!usuario.confirmado) {
                return res.render('auth/login', {
                    pagina: 'Iniciar Sesión',
                    csrfToken: req.csrfToken(),
                    errores: [{ msg: 'Esta cuenta no ha sido confirmada' }]
                });
            } else {
                if (!usuario.verificarPassword(password)) {
                    return res.render('auth/login', {
                        pagina: 'Iniciar Sesión',
                        csrfToken: req.csrfToken(),
                        errores: [{ msg: 'El usuario o la contraseña no coinciden.' }]
                    });
                }else{
                    const token = generarJWT({id: usuario.id, nombre: usuario.nombre});
                    //almacenando el token en un cookie
                    return res.cookie('_token', token,{
                        httpOnly: true, 
                        sameSite: true,
                        secure: true, 
                        value: token
                    }).redirect('/mis-propiedades');
                }
            }
        }
    }

}

//Cerrar sesion
const cerrarSesion = async(req, res) => {
    
    return res.clearCookie('_token').status(200).redirect('/auth/login');

}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Olvidé mi contraseña',
        csrfToken: req.csrfToken(),
    });
}
//funcion que comprueba una cuenta
const confirmar = async (req, res) => {
    const token = req.params;
    const usuario = await Usuario.findOne({ where: token });

    if (!usuario) {
        res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar cuenta',
            mensaje: 'Ocurrió un error al intentar confirmar tu cuenta. Intenta de nuevo',
            error: true
        });
    } else {
        usuario.token = null;
        usuario.confirmado = true;
        await usuario.save();

        res.render('auth/confirmar-cuenta', {
            pagina: 'Cuenta confirmada exitosamente',
            mensaje: 'Tú cuenta ha sido creada con éxito',
        });
    }

}

//resetear contrasenia 
const resetPassword = async (req, res) => {

    await check('email').isEmail().withMessage('Tienes que establecer un email válido').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            pagina: 'Olvidé mi contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    } else {
        const { email } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.render('auth/olvide-password', {
                pagina: 'Olvidé mi contraseña',
                csrfToken: req.csrfToken()
            });
        } else {
            usuario.token = generarId();
            await usuario.save();
            olvidePassword({
                email: usuario.email,
                nombre: usuario.nombre,
                token: usuario.token
            });
            //mensaje de coonfirmacion
            res.render('templates/mensaje', {
                pagina: 'Restablecer contraseña',
                mensaje: 'Te hemos enviado un email con las idicaciones para restablecer tu contraseña',
            });
        }
    }
}
//Funciones para comprobar y cambiar la password
const comprobarToken = async (req, res) => {

    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario) {
        return res.render('templates/mensaje', {
            pagina: 'Restablece tu contraseña',
            mensaje: 'Hubo un error al confirmar tú información, por favor intenta de nuevo.',
            error: true
        });
    }
    //Mostrar formulario para modificar el password
    else {
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu contraseña',
            csrfToken: req.csrfToken()
        });
    }

}
const nuevoPassword = async (req, res) => {

    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe ser de al menos 8 caracteres').run(req);
    await check('repeat_pwd').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    } else {
        const { token } = req.params;
        const { password } = req.body;

        const usuario = await Usuario.findOne({ where: { token } });

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        usuario.token = null;

        await usuario.save();

        return res.render('auth/confirmar-cuenta', {
            pagina: 'Contraseña restablecida',
            mensaje: 'Contraseña restablecida correctamente'
        });
    }

}

// Función para registrar usuario
const registrar = async (req, res) => {
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('Tienes que establecer un email válido').run(req);
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe ser de al menos 8 caracteres').run(req);
    await check('repeat_pwd').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    try {
        // Verificamos si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ where: { email: req.body.email } });
        if (existeUsuario) {
            return res.render('auth/registro', {
                pagina: 'Crear Cuenta',
                csrfToken: req.csrfToken(),
                errores: [{ msg: 'El usuario ya está registrado' }],
                usuario: {
                    nombre: req.body.nombre,
                    email: req.body.email
                }
            });
        }

        // Crear nuevo usuario
        const { nombre, email, password } = req.body;
        const user = await Usuario.create({
            nombre,
            email,
            password,
            token: generarId()
        });
        //enviar email de confirmacion
        emailRegistro({
            nombre: user.nombre,
            email: user.email,
            token: user.token
        });
        //Mostrar mensaje de confirmacion
        res.render('templates/mensaje', {
            pagina: 'Cuenta registrada correctamente',
            mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
}



export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    cerrarSesion,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
}
