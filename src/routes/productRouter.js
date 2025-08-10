import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { uploader } from '../utils/multerUtil.js';

const router = Router();
const ProductService = new productDBManager();

router.get('/', async (req, res) => {
    try {
        const result = await ProductService.getAllProducts(req.query);
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

router.get('/:pid', async (req, res) => {
    try {
        const result = await ProductService.getProductByID(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
    try {
        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => {
                req.body.thumbnails.push(file.path);
            });
        }

        const result = await ProductService.createProduct(req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {
    try {
        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => {
                req.body.thumbnails.push(file.filename);
            });
        }

        const result = await ProductService.updateProduct(req.params.pid, req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const result = await ProductService.deleteProduct(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;