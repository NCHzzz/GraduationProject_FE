// src/api.js or src/axiosConfig.js
import axios from 'axios';

// Use the base URL from the .env file
const baseUrl = process.env.REACT_APP_BASE_URL;

// Create an Axios instance with the base URL configured
const api = axios.create({
  baseURL: baseUrl, // The base URL will be used for all requests made with this instance
  timeout: 10000, // Optional: Set timeout for requests if desired
});

// Optional: You can configure global settings here like headers, interceptors, etc.
// api.defaults.headers.common['Authorization'] = 'Bearer your_token';

export default api;
