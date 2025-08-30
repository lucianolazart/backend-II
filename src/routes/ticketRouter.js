import { Router } from 'express';
import PurchaseService from '../services/purchaseService.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { isUser, isAdmin, validateObjectId } from '../middlewares/authorization.js';

const router = Router();
const purchaseService = new PurchaseService();

router.post('/purchase/:cartId', authenticateJWT, isUser, validateObjectId, async (req, res) => {
    try {
        const { cartId } = req.params;
        const userEmail = req.user.email;

        const purchaseResult = await purchaseService.processPurchase(cartId, userEmail);

        res.status(200).json({
            message: 'Compra procesada exitosamente',
            ticket: purchaseResult.ticket,
            purchasedProducts: purchaseResult.purchasedProducts,
            unavailableProducts: purchaseResult.unavailableProducts,
            totalAmount: purchaseResult.totalAmount
        });

    } catch (error) {
        console.error('Error procesando compra:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/my-tickets', authenticateJWT, isUser, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const tickets = await purchaseService.getUserTickets(userEmail);

        res.status(200).json({
            tickets: tickets
        });

            } catch (error) {
            console.error('Error obteniendo tickets del usuario:', error);
            res.status(500).json({ error: error.message });
        }
});

router.get('/all', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const tickets = await purchaseService.ticketRepository.getAllTickets();

        res.status(200).json({
            tickets: tickets
        });

    } catch (error) {
        console.error('Error obteniendo todos los tickets:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:ticketId', authenticateJWT, validateObjectId, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await purchaseService.ticketRepository.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }

        if (req.user.role !== 'admin' && ticket.purchaser !== req.user.email) {
            return res.status(403).json({ error: 'No tienes permisos para ver este ticket' });
        }

        res.status(200).json({
            ticket: ticket
        });

            } catch (error) {
            console.error('Error obteniendo ticket específico:', error);
            res.status(500).json({ error: error.message });
        }
});

export default router;
