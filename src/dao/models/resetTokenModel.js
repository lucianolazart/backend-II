import mongoose from 'mongoose';

const resetTokenCollection = 'resetTokens';

const resetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const resetTokenModel = mongoose.model(resetTokenCollection, resetTokenSchema);

export default resetTokenModel;
