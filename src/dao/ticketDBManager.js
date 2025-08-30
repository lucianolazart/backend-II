import ticketModel from './models/ticketModel.js';

class TicketDBManager {
    async createTicket(ticketData) {
        try {
            const ticket = new ticketModel(ticketData);
            return await ticket.save();
        } catch (error) {
            throw new Error(`Error creating ticket: ${error.message}`);
        }
    }

    async getTicketById(ticketId) {
        try {
            return await ticketModel.findById(ticketId).populate('products.product');
        } catch (error) {
            throw new Error(`Error getting ticket: ${error.message}`);
        }
    }

    async getTicketByCode(code) {
        try {
            return await ticketModel.findOne({ code }).populate('products.product');
        } catch (error) {
            throw new Error(`Error getting ticket by code: ${error.message}`);
        }
    }

    async getTicketsByUser(userEmail) {
        try {
            return await ticketModel.find({ purchaser: userEmail }).populate('products.product');
        } catch (error) {
            throw new Error(`Error getting user tickets: ${error.message}`);
        }
    }

    async getAllTickets() {
        try {
            return await ticketModel.find().populate('products.product');
        } catch (error) {
            throw new Error(`Error getting all tickets: ${error.message}`);
        }
    }
}

export default TicketDBManager;
