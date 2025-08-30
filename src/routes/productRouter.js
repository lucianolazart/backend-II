import { Router } from 'express';
import ProductRepository from '../repositories/productRepository.js';
import { uploader } from '../utils/multerUtil.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { isAdmin, validateObjectId } from '../middlewares/authorization.js';

const router = Router();
const productRepository = new ProductRepository();

router.get('/', async (req, res) => {
    try {
        const result = await productRepository.getAllProducts(req.query);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.get('/:pid', validateObjectId, async (req, res) => {
    try {
        const result = await productRepository.getProductById(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al obtener producto específico:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', authenticateJWT, isAdmin, uploader.array('thumbnails', 3), async (req, res) => {
    try {
        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => {
                req.body.thumbnails.push(file.path);
            });
        }

        const result = await productRepository.createProduct(req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al crear nuevo producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:pid', authenticateJWT, isAdmin, validateObjectId, uploader.array('thumbnails', 3), async (req, res) => {
    try {
        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => {
                req.body.thumbnails.push(file.filename);
            });
        }

        const result = await productRepository.updateProduct(req.params.pid, req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al actualizar producto existente:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:pid', authenticateJWT, isAdmin, validateObjectId, async (req, res) => {
    try {
        const result = await productRepository.deleteProduct(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al eliminar producto del sistema:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;