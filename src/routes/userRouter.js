import { Router } from 'express';
import UserDBManager from '../dao/userDBManager.js';
import { authenticateJWT, isAdmin, isAuthenticated } from '../middlewares/auth.js';

const router = Router();
const userManager = new UserDBManager();

router.get('/', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const users = await userManager.getAllUsers();
        res.json({ users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userManager.findUserById(id);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        if (updateData.role && req.user.role !== 'admin') {
            delete updateData.role;
        }

        const updatedUser = await userManager.updateUser(id, updateData);
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ 
            message: 'Usuario actualizado exitosamente',
            user: updatedUser 
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const deletedUser = await userManager.deleteUser(id);
        
        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ 
            message: 'Usuario eliminado exitosamente',
            user: deletedUser 
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router; 