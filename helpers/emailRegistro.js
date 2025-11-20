import nodemailer from 'nodemailer';
// Looking to send emails in production? Check out our Email API/SMTP product!
const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //enviar el email
    const { email, nombre, token } = datos;

    //dentro de sendMail va el cuerpo del email
    await transporter.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Compureba tu cuenta en APV',
        html: `<p>Hola ${nombre}, comprueba tu cuenta en APV.</p>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprueba tu Cuenta Aqui!</a>
            </p>
            
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>        
        `,
    });
}


export {
    emailRegistro,
}