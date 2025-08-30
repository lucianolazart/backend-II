import { Router } from 'express';
import passport from 'passport';
import UserRepository from '../repositories/userRepository.js';
import { authenticateJWT, generateToken } from '../middlewares/auth.js';
import { UserDTO } from '../dto/userDTO.js';

const router = Router();
const userRepository = new UserRepository();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const existingUser = await userRepository.findUserByEmail(email);
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

        const newUser = await userRepository.createUser(userData);

        const token = generateToken(newUser);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: newUser
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

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        const userDTO = UserDTO.fromUser(user);
        res.json({
            message: 'Login exitoso',
            user: userDTO
        });
    })(req, res, next);
});

router.get('/current', authenticateJWT, (req, res) => {
    try {
        const user = req.user;
        const userDTO = UserDTO.fromUser(user);
        res.json({
            user: userDTO
        });
    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logout exitoso' });
});

export default router; 