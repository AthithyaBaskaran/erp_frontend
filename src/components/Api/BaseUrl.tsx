// apiClients.ts
import axios from "axios";

// ✅ Axios instance for user management
const apiUrl = axios.create({
  baseURL: "http://localhost:8080/user_management/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Axios instance for inventory management
const InventoryapiUrl = axios.create({
  baseURL: "http://localhost:8080/inventory_management/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Axios instance for sales management
const SalesApiUrl = axios.create({
  baseURL: "http://localhost:8080/sales_management/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Function to attach token interceptor
const attachAuthInterceptor = (instance: typeof apiUrl) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// ✅ Apply token interceptor to all instances
attachAuthInterceptor(apiUrl);
attachAuthInterceptor(InventoryapiUrl);
attachAuthInterceptor(SalesApiUrl);

// ✅ Export all clients
// ✅ Export all clients
// ✅ Export all clients
// ✅ Export all clients
export { apiUrl, InventoryapiUrl, SalesApiUrl };
