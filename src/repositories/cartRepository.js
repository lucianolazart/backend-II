import CartDBManager from '../dao/cartDBManager.js';
import ProductDBManager from '../dao/productDBManager.js';

class CartRepository {
    constructor() {
        this.productDAO = new ProductDBManager();
        this.cartDAO = new CartDBManager(this.productDAO);
    }

    async getCartById(cartId) {
        try {
            return await this.cartDAO.getProductsFromCartByID(cartId);
        } catch (error) {
            throw new Error(`Error en repositorio de carritos: ${error.message}`);
        }
    }

    async createCart() {
        try {
            return await this.cartDAO.createCart();
        } catch (error) {
            throw new Error(`Error en repositorio de carritos: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            return await this.cartDAO.addProductByID(cartId, productId);
        } catch (error) {
            throw new Error(`Error en repositorio de carritos: ${error.message}`);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            return await this.cartDAO.deleteProductByID(cartId, productId);
        } catch (error) {
            throw new Error(`Error en repositorio de carritos: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await this.cartDAO.updateProductByID(cartId, productId, quantity);
        } catch (error) {
            throw new Error(`Error en repositorio de carritos: ${error.message}`);
        }
    }

    async clearCart(cartId) {
        try {
            return await this.cartDAO.deleteAllProducts(cartId);
        } catch (error) {
            throw new Error(`Error en repositorio de carritos: ${error.message}`);
        }
    }

    async deleteCart(cartId) {
        try {
            return await this.cartDAO.deleteAllProducts(cartId);
        } catch (error) {
            throw new Error(`Error en repositorio de carritos: ${error.message}`);
        }
    }
}

export default CartRepository;
