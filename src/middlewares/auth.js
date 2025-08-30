import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/passport.js';

export const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}; 