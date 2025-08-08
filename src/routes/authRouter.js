import { Router } from 'express';
import passport from 'passport';
import UserDBManager from '../dao/userDBManager.js';
import { authenticateJWT, generateToken } from '../middlewares/auth.js';

const router = Router();
const userManager = new UserDBManager();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const existingUser = await userManager.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const userData = {
            first_name,
            last_name,
            email,
            age: parseInt(age),
            password
        };

        const newUser = await userManager.createUser(userData);

        const token = generateToken(newUser);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                age: newUser.age,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (!user) {
            return res.status(401).json({ error: info.message || 'Credenciales inválidas' });
        }

        const token = generateToken(user);

        res.json({
            message: 'Login exitoso',
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role
            },
            token
        });
    })(req, res, next);
});

router.get('/current', authenticateJWT, (req, res) => {
    try {
        const user = req.user;
        res.json({
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            }
        });
    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router; 