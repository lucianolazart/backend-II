import ProductDBManager from '../dao/productDBManager.js';

class ProductRepository {
    constructor() {
        this.productDAO = new ProductDBManager();
    }

    async getAllProducts(options = {}) {
        try {
            return await this.productDAO.getAllProducts(options);
        } catch (error) {
            throw new Error(`Error en repositorio de productos: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            return await this.productDAO.getProductByID(id);
        } catch (error) {
            throw new Error(`Error en repositorio de productos: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            return await this.productDAO.createProduct(productData);
        } catch (error) {
            throw new Error(`Error en repositorio de productos: ${error.message}`);
        }
    }

    async updateProduct(id, productData) {
        try {
            return await this.productDAO.updateProduct(id, productData);
        } catch (error) {
            throw new Error(`Error en repositorio de productos: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            return await this.productDAO.deleteProduct(id);
        } catch (error) {
            throw new Error(`Error en repositorio de productos: ${error.message}`);
        }
    }

    async updateStock(productId, quantity) {
        try {
            const product = await this.productDAO.getProductByID(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            
            const newStock = product.stock - quantity;
            if (newStock < 0) {
                throw new Error('Stock insuficiente');
            }
            
            return await this.productDAO.updateProduct(productId, { stock: newStock });
        } catch (error) {
            throw new Error(`Error en repositorio de productos: ${error.message}`);
        }
    }
}

export default ProductRepository;
