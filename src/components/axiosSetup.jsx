import axios from 'axios';
import { API_URL } from '../constants';

const instance = axios.create({
  baseURL: `${API_URL}/api/tasks`,
});

instance.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
