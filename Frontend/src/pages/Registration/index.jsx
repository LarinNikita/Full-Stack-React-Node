import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from "react-hook-form";

import styles from './Login.module.scss';
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";

export const Registration = () => {

  const isAuth = useSelector(selectIsAuth);
  const dispath = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({ mode: 'onChange', });

  const [imageUrl, setImageUrl] = React.useState('');

  const handleChangeImageUrl = (e) => {
    setImageUrl(e.target.value);
  };

  const onSubmit = async (values) => {

    const data = await dispath(fetchRegister(values));

    if (!data.payload) {
      return alert('Не удалось зарегистрироваться!');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }

  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} src={imageUrl}/>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          error={Boolean(errors.avatarUrl?.message)}
          helperText={errors.avatarUrl?.message}
          {...register("avatarUrl")}
          value={imageUrl}
          onChange={handleChangeImageUrl}
          label="Ссылка на аватарку"
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Полное имя"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", {
            required: "Укажите полное имя",
            minLength: {
              value: 3,
              message: "Минимальная длина имени - 3 символа"
            }
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", {
            required: "Укажите почту",
            pattern: {
              value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
              message: "Некорректный email"
            }
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", {
            required: "Укажите пароль",
            minLength: {
              value: 6,
              message: "Минимальная длина пароля - 6 символов"
            }
          })}
          type="password"
          fullWidth
        />
        <Button
          type="submit"
          disabled={!isValid}
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
