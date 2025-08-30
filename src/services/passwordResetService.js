import crypto from 'crypto';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/userRepository.js';
import ResetTokenDBManager from '../dao/resetTokenDBManager.js';
import EmailService from './emailService.js';

class PasswordResetService {
    constructor() {
        this.userRepository = new UserRepository();
        this.resetTokenDAO = new ResetTokenDBManager();
        this.emailService = new EmailService();
    }

    async requestPasswordReset(email) {
        try {
            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new Error('No existe una cuenta con este email');
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);

            await this.resetTokenDAO.deleteTokensByUserId(user.id);

            await this.resetTokenDAO.createToken(user.id, resetToken, expiresAt);

            await this.emailService.sendPasswordResetEmail(
                user.email, 
                resetToken, 
                `${user.first_name} ${user.last_name}`
            );

            return {
                message: 'Email de recuperación enviado exitosamente',
                email: user.email
            };

        } catch (error) {
            throw new Error(`Error solicitando recuperación de contraseña: ${error.message}`);
        }
    }

    async validateResetToken(token) {
        try {
            const resetToken = await this.resetTokenDAO.findTokenByToken(token);
            
            if (!resetToken) {
                throw new Error('Token de recuperación inválido');
            }

            if (resetToken.used) {
                throw new Error('Este token ya ha sido utilizado');
            }

            if (new Date() > resetToken.expiresAt) {
                throw new Error('Token de recuperación expirado');
            }

            return resetToken;

        } catch (error) {
            throw new Error(`Error validando token: ${error.message}`);
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const resetToken = await this.validateResetToken(token);
            
            const user = await this.userRepository.findUserById(resetToken.userId._id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const fullUser = await this.userRepository.userDAO.findUserById(resetToken.userId._id);
            
            const isSamePassword = fullUser.comparePassword(newPassword);
            if (isSamePassword) {
                throw new Error('La nueva contraseña no puede ser igual a la contraseña actual');
            }

            const hashedPassword = bcrypt.hashSync(newPassword, 10);

            await this.userRepository.userDAO.updateUser(resetToken.userId._id, {
                password: hashedPassword
            });

            await this.resetTokenDAO.markTokenAsUsed(token);

            await this.emailService.sendPasswordChangedEmail(
                user.email,
                `${user.first_name} ${user.last_name}`
            );

            return {
                message: 'Contraseña restablecida exitosamente',
                email: user.email
            };

        } catch (error) {
            throw new Error(`Error restableciendo contraseña: ${error.message}`);
        }
    }

    async cleanupExpiredTokens() {
        try {
            const result = await this.resetTokenDAO.deleteExpiredTokens();
            console.log(`Tokens expirados eliminados: ${result.deletedCount}`);
            return result;
        } catch (error) {
            console.error('Error limpiando tokens expirados:', error);
            throw new Error(`Error limpiando tokens expirados: ${error.message}`);
        }
    }
}

export default PasswordResetService;
