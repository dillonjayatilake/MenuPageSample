import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api', // Socket.io server URL
});

export default instance;