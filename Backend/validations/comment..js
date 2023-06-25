import { body } from "express-validator";

export const commentCreateValidation = [
    body("comment", "Введите текст комментария.").isLength({ min: 3 }).isString(),
];