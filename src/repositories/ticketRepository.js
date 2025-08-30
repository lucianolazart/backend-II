import TicketDBManager from '../dao/ticketDBManager.js';

class TicketRepository {
    constructor() {
        this.ticketDAO = new TicketDBManager();
    }

    async createTicket(ticketData) {
        try {
            return await this.ticketDAO.createTicket(ticketData);
        } catch (error) {
            throw new Error(`Error en repositorio de tickets: ${error.message}`);
        }
    }

    async getTicketById(ticketId) {
        try {
            return await this.ticketDAO.getTicketById(ticketId);
        } catch (error) {
            throw new Error(`Error en repositorio de tickets: ${error.message}`);
        }
    }

    async getTicketByCode(code) {
        try {
            return await this.ticketDAO.getTicketByCode(code);
        } catch (error) {
            throw new Error(`Error en repositorio de tickets: ${error.message}`);
        }
    }

    async getTicketsByUser(userEmail) {
        try {
            return await this.ticketDAO.getTicketsByUser(userEmail);
        } catch (error) {
            throw new Error(`Error en repositorio de tickets: ${error.message}`);
        }
    }

    async getAllTickets() {
        try {
            return await this.ticketDAO.getAllTickets();
        } catch (error) {
            throw new Error(`Error en repositorio de tickets: ${error.message}`);
        }
    }
}

export default TicketRepository;
