import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import UserDBManager from '../dao/userDBManager.js';

const userManager = new UserDBManager();

const JWT_SECRET = 'CoderCoder123';

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
    usernameField: 'email',
    passwordField: 'password'
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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userManager.findUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export { JWT_SECRET }; 