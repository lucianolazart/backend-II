import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['user', 'admin']
    }
}, {
    timestamps: true
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

const userModel = mongoose.model(userCollection, userSchema);

export default userModel; 