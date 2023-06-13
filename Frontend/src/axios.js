import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:4444'
});

//"Вшиваем" авторизацию из localStorage при каждом запросе
instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');
    return config;
});

export default instance;