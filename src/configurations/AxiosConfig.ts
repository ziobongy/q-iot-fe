import axios from 'axios';

const instance = axios.create({
    //baseURL: 'http://vmi2209617.contaboserver.net:8888',
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});
instance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    console.log("erroreeeee", error.message);
    return Promise.reject(error);
});
export default instance;