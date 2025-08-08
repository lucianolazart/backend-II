import userModel from './models/userModel.js';

class UserDBManager {
    constructor() {
        this.userModel = userModel;
    }

    async createUser(userData) {
        try {
            const user = new this.userModel(userData);
            const savedUser = await user.save();
            return savedUser;
        } catch (error) {
            throw error;
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await this.userModel.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async findUserById(id) {
        try {
            const user = await this.userModel.findById(id).populate('cart');
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, updateData) {
        try {
            const user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const user = await this.userModel.findByIdAndDelete(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const users = await this.userModel.find().populate('cart');
            return users;
        } catch (error) {
            throw error;
        }
    }
}

export default UserDBManager; 