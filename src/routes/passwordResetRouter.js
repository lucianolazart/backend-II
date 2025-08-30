import { Router } from 'express';
import PasswordResetService from '../services/passwordResetService.js';

const router = Router();
const passwordResetService = new PasswordResetService();

router.post('/request-reset', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                error: 'El email es requerido' 
            });
        }

        const result = await passwordResetService.requestPasswordReset(email);

        res.status(200).json({
            message: result.message,
            email: result.email
        });

    } catch (error) {
        console.error('Error solicitando recuperación de contraseña:', error);
        res.status(400).json({ 
            error: error.message 
        });
    }
});

router.get('/validate-token/:token', async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ 
                error: 'Token requerido' 
            });
        }

        await passwordResetService.validateResetToken(token);

        res.status(200).json({
            message: 'Token válido',
            valid: true
        });

    } catch (error) {
        console.error('Error validando token:', error);
        res.status(400).json({ 
            error: error.message,
            valid: false
        });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ 
                error: 'Token y nueva contraseña son requeridos' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        const result = await passwordResetService.resetPassword(token, newPassword);

        res.status(200).json({
            message: result.message,
            email: result.email
        });

    } catch (error) {
        console.error('Error restableciendo contraseña:', error);
        res.status(400).json({ 
            error: error.message 
        });
    }
});

router.post('/cleanup-tokens', async (req, res) => {
    try {
        const result = await passwordResetService.cleanupExpiredTokens();

        res.status(200).json({
            message: 'Limpieza de tokens completada',
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Error limpiando tokens:', error);
        res.status(500).json({ 
            error: error.message 
        });
    }
});

export default router;
