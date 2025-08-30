import CartRepository from '../repositories/cartRepository.js';
import ProductRepository from '../repositories/productRepository.js';
import TicketRepository from '../repositories/ticketRepository.js';
import UserRepository from '../repositories/userRepository.js';

class PurchaseService {
    constructor() {
        this.cartRepository = new CartRepository();
        this.productRepository = new ProductRepository();
        this.ticketRepository = new TicketRepository();
        this.userRepository = new UserRepository();
    }

    async processPurchase(cartId, userEmail) {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            if (cart.products.length === 0) {
                throw new Error('El carrito está vacío');
            }

            const purchaseResult = await this.validateAndCalculatePurchase(cart.products);
            
            if (purchaseResult.productsToPurchase.length === 0) {
                throw new Error('No hay productos disponibles para comprar');
            }

            const ticketData = {
                code: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                amount: purchaseResult.totalAmount,
                purchaser: userEmail,
                products: purchaseResult.productsToPurchase.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price
                }))
            };

            const ticket = await this.ticketRepository.createTicket(ticketData);

            for (const item of purchaseResult.productsToPurchase) {
                await this.productRepository.updateStock(item.product._id, item.quantity);
            }

            await this.removePurchasedProductsFromCart(cartId, purchaseResult.productsToPurchase);

            return {
                ticket,
                purchasedProducts: purchaseResult.productsToPurchase,
                unavailableProducts: purchaseResult.unavailableProducts,
                totalAmount: purchaseResult.totalAmount
            };

        } catch (error) {
            throw new Error(`Error procesando compra: ${error.message}`);
        }
    }

    async validateAndCalculatePurchase(cartProducts) {
        const productsToPurchase = [];
        const unavailableProducts = [];
        let totalAmount = 0;

        for (const cartItem of cartProducts) {
            const product = await this.productRepository.getProductById(cartItem.product._id);
            
            if (!product) {
                unavailableProducts.push({
                    product: cartItem.product,
                    reason: 'Producto no encontrado'
                });
                continue;
            }

            if (product.stock < cartItem.quantity) {
                unavailableProducts.push({
                    product: cartItem.product,
                    reason: `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${cartItem.quantity}`
                });
                continue;
            }

            productsToPurchase.push({
                product: product,
                quantity: cartItem.quantity
            });

            totalAmount += product.price * cartItem.quantity;
        }

        return {
            productsToPurchase,
            unavailableProducts,
            totalAmount
        };
    }

    async removePurchasedProductsFromCart(cartId, purchasedProducts) {
        for (const item of purchasedProducts) {
            await this.cartRepository.removeProductFromCart(cartId, item.product._id);
        }
    }

    async getUserTickets(userEmail) {
        try {
            return await this.ticketRepository.getTicketsByUser(userEmail);
        } catch (error) {
            throw new Error(`Error obteniendo tickets del usuario: ${error.message}`);
        }
    }
}

export default PurchaseService;
