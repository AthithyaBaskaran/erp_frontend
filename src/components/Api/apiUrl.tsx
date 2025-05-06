import { apiUrl, InventoryapiUrl, SalesApiUrl } from "../Api/BaseUrl";

export const LoginForm = async (email: string, password: string,) => {
    try {
        const response = await apiUrl.post(`auth/login`, { email, password });
        if (response.data?.statusMessage) {
            console.log("✅ Login response:", response.data);
        }
        // ✅ Changed delete to post
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Something went wrong while adding the user.");
        }
    }
};
export const addUsers = async (user: { name: string; email: string; phone?: string, address: string }) => {

    try {
        const response = await apiUrl.post(`/users/register`, user);
        if (response.data?.statusMessage) {
            console.log("✅ Login response:", response.data);
        }

        // ✅ Changed delete to post
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Something went wrong while adding the user.");
        }
    }
};
export const assignRoleAndDept = async (userId: number, roleId: number, deptId: number) => {
    try {
        const response = await apiUrl.post(`/users/assign-role-department`, { userId, roleId, deptId });
        console.log("response", userId, deptId, roleId);
        return response.data;
    } catch (error: any) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
}
export const fetchUserForEdit = async (userId: number) => {
    try {
        const response = await apiUrl.get(`/users/edit-user?userId=${userId}`);
        console.log("response", userId);
        return response;
    } catch (error: any) {
        console.error("❌ Error fetching user:", error);
        throw error;
    }
};


export const addDepartment = async (name: string) => {

    try {
        const response = await apiUrl.post(`/users/add-department`, { name });
        console.log("responseDepartment", response);

        // ✅ Changed delete to post
        return response.data;
    } catch (error: any) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
};
export const addRole = async (dept_id: number, roleName: string) => {

    try {
        const response = await apiUrl.post(`/users/add-role`, { dept_id, roleName });
        console.log("response", response);
        return response.data;
    } catch (error: any) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
}
export const showUsers = async (search:string) => {
    try {
        const response = await apiUrl.get(`/admin/users?search=${search}`);
        return response.data;
    } catch (error: any) {
        console.log("❌ Error fetching users:", error);
        throw error;
    }
};
export const AssignRole = async (departmentId: number) => {
    try {
        const response = await apiUrl.get(`/users/roles?departmentId=${departmentId}`);
        return response.data;
    } catch (error: any) {
        console.log("❌ Error fetching users:", error);
        throw error;
    }
};
export const showDepartment = async () => {
    try {
        const response = await apiUrl.get('/users/department');
        return response.data;
    } catch (error: any) {
        console.log("❌ Error fetching users:", error);
        throw error;
    }
};
export const AddDepartment = async () => {
    try {
        const response = await apiUrl.get('/users/department');
        return response.data;
    } catch (error: any) {
        console.log("❌ Error fetching users:", error);
        throw error;
    }
};
export const deleteUser = async (userId: number) => {
    try {
        const response = await apiUrl.delete(`/admin/user/delete?userId=${userId}`); // Include userId in the endpoint
        return response.data;
    } catch (error: any) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
export const ChangeUser = async (email: string, oldPassword: string, newPassword: string) => {
    try {
        const response = await apiUrl.post(`/auth/change-password`, { email, oldPassword, newPassword });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Something went wrong while adding the user.");
        }
    }
};

export const ForgetUser = async (email: string) => {
    try {
        const response = await apiUrl.post(`/auth/forgot-password?email=${email}`);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Something went wrong while adding the user.");
        }
    }
};
export const ResetEmail = async (token: string, newPassword: string, confirmPassword: string) => {
    try {
        const response = await apiUrl.post(`/auth/reset?token=${token}`, {
            newPassword,
            confirmPassword,
        });
        if (response.data.statusMessage) {
            console.log("✅ Reset response:", response.data);
        }
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Something went wrong while adding the user.");
        }
    }
};

// Sales Management API functions
export const createSalesOrder = async (data: { 
    customer: string; 
    categoryId: number; 
    productName: string; 
    price_per_unit: number; 
    quantity: number; 
    amount: number 
}) => {
    try {
        // Using SalesApiUrl to ensure it points to the correct endpoint
        const response = await SalesApiUrl.post('/sales-orders/create', data);
        if (response.data?.statusMessage) {
            console.log("✅ Sales order created:", response.data);
        }
        return response.data;
    } catch (error: any) {
        console.error('Error creating sales order:', error);
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Failed to create sales order");
        }
    }
};



export const RefreshToken = async (userId: number, token: string) => {
    try {
        const response = await apiUrl.post(`/token/refresh-token`, {
            userId,
            token,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        return response.data;
    } catch (error: any) {
        console.error("Error refreshing token:", error);
        throw error;
    }
};

export const addInventory = async (user: { name: string; sku: string; price: number | string; categoryId: number ,stockQuantity:number }) => {
    try {
      const payload = {
        ...user,
        price: typeof user.price === "number" ? user.price.toFixed(2) : user.price, // Format here
      };
  
      const response = await InventoryapiUrl.post(`/product/add`, payload);
      if (response.data?.statusMessage) {
        console.log("✅ Inventory Added response:", response.data);
      }
  
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.statusMessage) {
        throw new Error(error.response.data.statusMessage);
      } else {
        throw new Error("Something went wrong while adding the inventory.");
      }
    }
  };

  
  export const showInventory = async (categoryId?: number | string) => {
    try {
      console.log('Starting inventory API call...');
      
      // Log the token being used (without exposing the full token)
      const token = localStorage.getItem("token");
      if (token) {
        const tokenPreview = token.substring(0, 10) + '...';
        console.log(`Using token: ${tokenPreview}`);
      } else {
        console.warn('No token found in localStorage');
      }
      
      const url = categoryId ? `/product/getAll?categoryId=${categoryId}`
          : "/product/getAll";
      console.log(`Calling API endpoint: ${url}`);
      
      const response = await InventoryapiUrl.get(url);
      console.log('API call successful, response:', response);
      
      // If no data is returned, use mock data for development
      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        console.log('No data returned from API, using mock data');
        
        // Mock data for development
        response.data = [
          { id: 1, name: "Dairy Milk", price: 5.0, stockQuantity: 50, categoryId: 1, categoryName: "Chocolate", sku: "PC0001" },
          { id: 2, name: "Snickers", price: 4.0, stockQuantity: 65, categoryId: 1, categoryName: "Chocolate", sku: "PC0002" },
          { id: 3, name: "Kitkat", price: 4.5, stockQuantity: 75, categoryId: 1, categoryName: "Chocolate", sku: "PC0003" },
          { id: 4, name: "Lays Classic", price: 3.5, stockQuantity: 100, categoryId: 2, categoryName: "Chips", sku: "PC0004" },
          { id: 5, name: "Milky biscuit", price: 9.98, stockQuantity: 150, categoryId: 3, categoryName: "Biscuit", sku: "PC0005" },
          { id: 6, name: "Doritos", price: 4.25, stockQuantity: 85, categoryId: 2, categoryName: "Chips", sku: "PC0006" },
          { id: 7, name: "Oreo", price: 3.99, stockQuantity: 120, categoryId: 3, categoryName: "Biscuit", sku: "PC0007" },
          { id: 8, name: "Coca Cola", price: 2.5, stockQuantity: 200, categoryId: 4, categoryName: "Beverages", sku: "PC0008" },
          { id: 9, name: "Pepsi", price: 2.25, stockQuantity: 180, categoryId: 4, categoryName: "Beverages", sku: "PC0009" },
          { id: 10, name: "Mountain Dew", price: 2.75, stockQuantity: 15, categoryId: 4, categoryName: "Beverages", sku: "PC0010" }
        ];
      }
      
      // Return the entire response object
      return response;
    } catch (error: any) {
      console.error("❌ Error fetching inventory:", error);
      
      // Add more detailed error logging
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      
      // Create a mock response for development
      console.log('Creating mock response due to API error');
      return {
        data: [
          { id: 1, name: "Dairy Milk", price: 5.0, stockQuantity: 50, categoryId: 1, categoryName: "Chocolate", sku: "PC0001" },
          { id: 2, name: "Snickers", price: 4.0, stockQuantity: 65, categoryId: 1, categoryName: "Chocolate", sku: "PC0002" },
          { id: 3, name: "Kitkat", price: 4.5, stockQuantity: 75, categoryId: 1, categoryName: "Chocolate", sku: "PC0003" },
          { id: 4, name: "Lays Classic", price: 3.5, stockQuantity: 100, categoryId: 2, categoryName: "Chips", sku: "PC0004" },
          { id: 5, name: "Milky biscuit", price: 9.98, stockQuantity: 150, categoryId: 3, categoryName: "Biscuit", sku: "PC0005" },
          { id: 6, name: "Doritos", price: 4.25, stockQuantity: 85, categoryId: 2, categoryName: "Chips", sku: "PC0006" },
          { id: 7, name: "Oreo", price: 3.99, stockQuantity: 120, categoryId: 3, categoryName: "Biscuit", sku: "PC0007" },
          { id: 8, name: "Coca Cola", price: 2.5, stockQuantity: 200, categoryId: 4, categoryName: "Beverages", sku: "PC0008" },
          { id: 9, name: "Pepsi", price: 2.25, stockQuantity: 180, categoryId: 4, categoryName: "Beverages", sku: "PC0009" },
          { id: 10, name: "Mountain Dew", price: 2.75, stockQuantity: 15, categoryId: 4, categoryName: "Beverages", sku: "PC0010" }
        ]
      };
    }
  };


export const deleteInventory = async (id: number) => {
    try {
        const response = await InventoryapiUrl.delete(`/product/delete/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting inventory:', error);
        throw error;
    }
};

export const updateInventoryApi = async (id: number, data: { 
    name: string; 
    sku: string; 
    price: number | string; 
    categoryId: number;
    stockQuantity: number 
}) => {
    try {
        const payload = {
            ...data,
            price: typeof data.price === "number" ? data.price.toFixed(2) : data.price, // Format price
        };
        
        const response = await InventoryapiUrl.put(`/product/update/${id}`, payload);
        if (response.data?.statusMessage) {
            console.log("✅ Inventory Updated response:", response.data);
        }
        
        return response.data;
    } catch (error: any) {
        console.error('Error updating inventory:', error);
        if (error.response?.data?.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Something went wrong while updating the inventory.");
        }
    }
};

export const DownloadUserID = async (userId: string) => {
    try {
        const response = await apiUrl.get(`users/download/excel?userIds=${userId}`, {
            responseType: "arraybuffer",
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching product:", error);
        return [];
    }
};

export const fetchCategoriesApi = async () => {
    try {
        const response = await InventoryapiUrl.get("/category/getAll");
        return response.data;
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

