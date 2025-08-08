import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';

import './config/passport.js';

const app = express();

const uri = 'mongodb://127.0.0.1:27017/entrega-final';
mongoose.connect(uri);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(session({
    secret: 'CoderCoder123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', authRouter);
app.use('/api/users', userRouter);
app.use('/', viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);