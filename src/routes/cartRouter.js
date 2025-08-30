import { Router } from 'express';
import CartRepository from '../repositories/cartRepository.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { isUser, validateObjectId } from '../middlewares/authorization.js';

const router = Router();
const cartRepository = new CartRepository();

router.get('/:cid', authenticateJWT, isUser, validateObjectId, async (req, res) => {

    try {
        const result = await cartRepository.getCartById(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', authenticateJWT, isUser, async (req, res) => {

    try {
        const result = await cartRepository.createCart();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/product/:pid', authenticateJWT, isUser, validateObjectId, async (req, res) => {

    try {
        const result = await cartRepository.addProductToCart(req.params.cid, req.params.pid, req.body.quantity || 1)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid/product/:pid', authenticateJWT, isUser, validateObjectId, async (req, res) => {

    try {
        const result = await cartRepository.removeProductFromCart(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al remover producto del carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid', authenticateJWT, isUser, validateObjectId, async (req, res) => {

    try {
        const result = await cartRepository.updateProductQuantity(req.params.cid, req.body.productId, req.body.quantity)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al actualizar cantidad de producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid/product/:pid', authenticateJWT, isUser, validateObjectId, async (req, res) => {

    try {
        const result = await cartRepository.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al actualizar cantidad de producto específico:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid', authenticateJWT, isUser, validateObjectId, async (req, res) => {

    try {
        const result = await cartRepository.clearCart(req.params.cid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;