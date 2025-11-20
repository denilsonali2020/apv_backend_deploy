import nodemailer from 'nodemailer';
// Looking to send emails in production? Check out our Email API/SMTP product!
const emailOlvidePassword = async (datos) => {
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
    const info = await transporter.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Reestablece tu password',
        text: 'Reestablece tu password',
        html: `<p>Hola ${nombre}, has solicitado reestablecer tu password.</p>
            <p>Sigue el siguiente enlace para generar el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password!</a>
            </p>
            
            <p>Si tu no solicitaste este cambio, puedes ignorar este mensaje</p>        
        `,
    });
}


export {
    emailOlvidePassword,
}