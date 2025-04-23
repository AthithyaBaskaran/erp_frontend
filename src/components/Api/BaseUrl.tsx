
// apiClients.ts
import axios from "axios";

const apiUrl = axios.create({
  baseURL: "http://localhost:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const SalesapiUrl = axios.create({
  baseURL: "http://localhost:8080/user_management/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Automatically attach token from localStorage (if exists)
apiUrl.interceptors.request.use(  
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export { apiUrl, SalesapiUrl};
