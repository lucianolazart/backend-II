import mongoose from 'mongoose';

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    next();
};

export const isUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    if (req.user.role != 'user' && req.user.role != 'admin') {
        return res.status(403).json({ error: 'Forbidden - User access required' });
    }

    next();
};

export const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    next();
};

export const isOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    if (req.user.role === 'admin') {
        return next();
    }

    const resourceUserId = req.params.userId || req.body.userId;
    if (resourceUserId && resourceUserId !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Forbidden - Can only access own resources' });
    }

    next();
};

export const validateObjectId = (req, res, next) => {
    const { id, cid, pid, ticketId } = req.params;
    const idToValidate = id || cid || pid || ticketId;
    
    if (idToValidate && !mongoose.Types.ObjectId.isValid(idToValidate)) {
        return res.status(400).json({ 
            error: 'ID inválido - El formato del ID no es válido' 
        });
    }
    
    next();
};
