import express from 'express';
import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';

import checkAuth from './utils/checkAuth.js';

import * as UserControler from './controllers/UserControler.js';

mongoose
    .connect('mongodb+srv://admin:Vano88@cluster0.uyav26b.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

//===== Авторизация =====
app.post('/auth/login', UserControler.login);

// ===== Регистрация =====
app.post('/auth/register', registerValidation, UserControler.register);

// ===== Доступ к информации =====
app.get('/auth/me', checkAuth, UserControler.getMe);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});