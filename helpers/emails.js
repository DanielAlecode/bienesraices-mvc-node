import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      const {nombre, email, token} = datos;

      transport.sendMail({
        from: 'bienesraices.com', 
        to: email, 
        subject: 'Confirma tu cuenta en BienesRaices.com', 
        text: 'Confirma tu cuenta en BienesRaices.com', 
        html: `
        <p> Hola! ${nombre}, confirma tu cuenta en BienesRaices.com</p>
        <p> Tu cuenta ya está lista, solo debes confirmarla dando click en el siguiente enlace:
         <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 5000}/auth/confirmar/${token}"> Confirmar cuenta </a> </p>
        <p>Si tu no creaste la cuenta puedes ignorar este mensaje</p>
        `
      });
}

const olvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const {nombre, email, token} = datos;

    transport.sendMail({
      from: 'bienesraices.com', 
      to: email, 
      subject: 'Restablece tú contraseña en BienesRaices.com', 
      text: 'Restablece tú contraseña en BienesRaices.com', 
      html: `
      <p> Hola! ${nombre}, hemos recibido tú solicitud para reestablecer tu contraseña en BienesRaices.com</p>
      <p>  Haz clic en el siguiente enlace para generar una nueva contraseña:
       <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 5000}/auth/olvide-password/${token}"> Restablece tu contraseña </a> </p>
      <p>Si tu no solicitaste restablecer tu contraseña, puedes ignorar este mensaje</p>
      `
    });
}

export {
    emailRegistro, 
    olvidePassword
}