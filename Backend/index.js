import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

import { loginValidation, registerValidation, postCreateValidation, commentCreateValidation } from './validations/index.js';
import { UserControler, PostControler, CommentControler } from './controllers/index.js';
import { checkAuth, handlValidationErrors } from './utils/index.js';

mongoose
    .connect('mongodb+srv://admin:Vano88@cluster0.uyav26b.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err));

const app = express();

//Создаем хранилище, в котором будут картинки
const storage = multer.diskStorage({
    //путь файла
    destination: (_, __, callback) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        callback(null, 'uploads');
    },
    //название файла
    filename: (_, file, callback) => {
        callback(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads')); //GET запрос на получение статичного файла
app.use(cors());

//#region роуты достурные всем
//===== Авторизация =====
app.post('/auth/login', loginValidation, handlValidationErrors, UserControler.login);

// ===== Регистрация =====
app.post('/auth/register', registerValidation, handlValidationErrors, UserControler.register);

// ===== Доступ к информации =====
app.get('/auth/me', checkAuth, UserControler.getMe);

// ===== Все статьи =====
app.get('/posts', PostControler.getAll);

// ===== Популярные статьи =====
app.get('/posts/popular', PostControler.getPopular);

// ===== Получение тэгов =====
app.get('/posts/tags', PostControler.getLastTags);
app.get('/tags', PostControler.getLastTags);

// ===== Одна статья =====
app.get('/posts/:id', PostControler.getOne);

// ===== Получение комментариев =====
// app.get('/posts/:id/comments', CommentControler.getPostComments);
app.get('/comments/:id', CommentControler.getPostComments);

//#endregion

//#region роуты доступные только авторизованным
// ===== Создание статьи =====
app.post('/posts', checkAuth, postCreateValidation, handlValidationErrors, PostControler.create);

// ===== Удалить статью =====
app.delete('/posts/:id', checkAuth, PostControler.remove);

// ===== Редактировать статью =====
app.patch('/posts/:id', checkAuth, postCreateValidation, handlValidationErrors, PostControler.update);

// ===== Загрузка изображений =====
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

// ===== Создание комментария =====
app.post(
    '/comments/:id',
    checkAuth,
    commentCreateValidation,
    handlValidationErrors,
    CommentControler.create
);

//#endregion

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});