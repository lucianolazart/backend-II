import 'dotenv/config';
import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import ticketRouter from './routes/ticketRouter.js';
import passwordResetRouter from './routes/passwordResetRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';

import './config/passport.js';

const app = express();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/entrega-final';
mongoose.connect(uri);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

app.use(passport.initialize());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/password-reset', passwordResetRouter);
app.use('/api/sessions', authRouter);
app.use('/api/users', userRouter);
app.use('/', viewsRouter);

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);