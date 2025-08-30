import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendPasswordResetEmail(userEmail, resetToken, userName) {
        try {
            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`;
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: 'Recuperación de Contraseña - Ecommerce',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                            <h1 style="color: #333; margin: 0;">🛒 Ecommerce</h1>
                        </div>
                        
                        <div style="padding: 30px; background-color: white;">
                            <h2 style="color: #333; margin-bottom: 20px;">Hola ${userName},</h2>
                            
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña.
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" 
                                   style="background-color: #007bff; color: white; padding: 12px 30px; 
                                          text-decoration: none; border-radius: 5px; display: inline-block;
                                          font-weight: bold;">
                                    Restablecer Contraseña
                                </a>
                            </div>
                            
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                <strong>Importante:</strong> Este enlace expirará en 1 hora por seguridad.
                            </p>
                            
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            
                            <p style="color: #999; font-size: 12px; text-align: center;">
                                Este es un correo automático, por favor no respondas a este mensaje.
                            </p>
                        </div>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Email de recuperación enviado exitosamente a:', userEmail);
            return result;
        } catch (error) {
            console.error('Error enviando email de recuperación:', error);
            throw new Error(`Error enviando email de recuperación: ${error.message}`);
        }
    }

    async sendPasswordChangedEmail(userEmail, userName) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: 'Contraseña Cambiada - Ecommerce',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                            <h1 style="color: #333; margin: 0;">🛒 Ecommerce</h1>
                        </div>
                        
                        <div style="padding: 30px; background-color: white;">
                            <h2 style="color: #333; margin-bottom: 20px;">Hola ${userName},</h2>
                            
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Tu contraseña ha sido cambiada exitosamente.
                            </p>
                            
                            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; 
                                        border-radius: 5px; padding: 15px; margin: 20px 0;">
                                <p style="color: #155724; margin: 0;">
                                    ✅ Tu cuenta está segura y tu nueva contraseña está activa.
                                </p>
                            </div>
                            
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Si no realizaste este cambio, contacta inmediatamente con nuestro soporte.
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            
                            <p style="color: #999; font-size: 12px; text-align: center;">
                                Este es un correo automático, por favor no respondas a este mensaje.
                            </p>
                        </div>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Email de confirmación enviado exitosamente a:', userEmail);
            return result;
        } catch (error) {
            console.error('Error enviando email de confirmación:', error);
            throw new Error(`Error enviando email de confirmación: ${error.message}`);
        }
    }
}

export default EmailService;
