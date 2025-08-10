import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import UserDBManager from '../dao/userDBManager.js';

const userManager = new UserDBManager();

const JWT_SECRET = 'CoderCoder123';

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.jwt;
    }
    return token;
};

passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await userManager.findUserById(payload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await userManager.findUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        
        const isValidPassword = user.comparePassword(password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

export { JWT_SECRET }; 