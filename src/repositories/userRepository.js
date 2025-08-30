import UserDBManager from '../dao/userDBManager.js';
import { UserDTO } from '../dto/userDTO.js';

class UserRepository {
    constructor() {
        this.userDAO = new UserDBManager();
    }

    async findUserById(id) {
        try {
            const user = await this.userDAO.findUserById(id);
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error en repositorio de usuarios: ${error.message}`);
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await this.userDAO.findUserByEmail(email);
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error en repositorio de usuarios: ${error.message}`);
        }
    }

    async createUser(userData) {
        try {
            const user = await this.userDAO.createUser(userData);
            return UserDTO.fromUser(user);
        } catch (error) {
            throw new Error(`Error en repositorio de usuarios: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        try {
            const user = await this.userDAO.updateUser(id, userData);
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error en repositorio de usuarios: ${error.message}`);
        }
    }

    async deleteUser(id) {
        try {
            return await this.userDAO.deleteUser(id);
        } catch (error) {
            throw new Error(`Error en repositorio de usuarios: ${error.message}`);
        }
    }

    async getAllUsers() {
        try {
            const users = await this.userDAO.getAllUsers();
            return users.map(user => UserDTO.fromUser(user));
        } catch (error) {
            throw new Error(`Error en repositorio de usuarios: ${error.message}`);
        }
    }
}

export default UserRepository;
