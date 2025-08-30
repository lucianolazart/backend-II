import resetTokenModel from './models/resetTokenModel.js';

class ResetTokenDBManager {
    async createToken(userId, token, expiresAt) {
        try {
            const resetToken = new resetTokenModel({
                userId,
                token,
                expiresAt
            });
            return await resetToken.save();
        } catch (error) {
            throw new Error(`Error creando token de recuperación: ${error.message}`);
        }
    }

    async findTokenByToken(token) {
        try {
            return await resetTokenModel.findOne({ token }).populate('userId');
        } catch (error) {
            throw new Error(`Error buscando token: ${error.message}`);
        }
    }

    async markTokenAsUsed(token) {
        try {
            return await resetTokenModel.findOneAndUpdate(
                { token },
                { used: true },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error marcando token como usado: ${error.message}`);
        }
    }

    async deleteExpiredTokens() {
        try {
            const now = new Date();
            return await resetTokenModel.deleteMany({ expiresAt: { $lt: now } });
        } catch (error) {
            throw new Error(`Error eliminando tokens expirados: ${error.message}`);
        }
    }

    async deleteTokensByUserId(userId) {
        try {
            return await resetTokenModel.deleteMany({ userId });
        } catch (error) {
            throw new Error(`Error eliminando tokens del usuario: ${error.message}`);
        }
    }
}

export default ResetTokenDBManager;
