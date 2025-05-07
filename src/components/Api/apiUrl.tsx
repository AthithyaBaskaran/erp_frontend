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

export const fetchSalesOrdersByStatus = async (status: string) => {
    try {
        console.log(`Fetching sales orders with status: ${status}`);
        const response = await SalesApiUrl.get(`/sales-orders/getOrderByStatus?status=${status}`);
        console.log('Sales orders API response:', response);
        
        if (response.data) {
            return response.data;
        } else {
            throw new Error('No data received from server');
        }
    } catch (error: any) {
        console.error('Error fetching sales orders:', error);
        
        // More detailed error logging
        if (error.response) {
            console.error("Error status:", error.response.status);
            console.error("Error data:", error.response.data);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
        
        throw error;
    }
};

export const updateOrderStatus = async (orderId: number, status: string, remarks?: string, deliveryDate?: string) => {
    try {
        console.log(`Updating order ${orderId} to status: ${status}`);
        const payload = {
            orderId,
            status,
            remarks,
            deliveryDate
        };
        
        // Remove undefined values
        Object.keys(payload).forEach(key => {
            if (payload[key as keyof typeof payload] === undefined) {
                delete payload[key as keyof typeof payload];
            }
        });
        
        const response = await SalesApiUrl.put('/sales-orders/updateStatus', payload);
        console.log('Update order status response:', response);
        
        if (response.data) {
            return response.data;
        } else {
            throw new Error('No data received from server');
        }
    } catch (error: any) {
        console.error('Error updating order status:', error);
        
        // More detailed error logging
        if (error.response) {
            console.error("Error status:", error.response.status);
            console.error("Error data:", error.response.data);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
        
        throw error;
    }
};

export const updateProcessingOrderStatus = async (orderId: number, status: string, processingRemarks?: string) => {
    try {
        console.log(`Updating processing order ${orderId} to status: ${status}`);
        const payload = {
            orderId,
            status,
            processingRemarks
        };
        
        // Remove undefined values
        Object.keys(payload).forEach(key => {
            if (payload[key as keyof typeof payload] === undefined) {
                delete payload[key as keyof typeof payload];
            }
        });
        
        const response = await SalesApiUrl.put('/sales-orders/updateProcessingStatus', payload);
        console.log('Update processing order status response:', response);
        
        if (response.data) {
            return response.data;
        } else {
            throw new Error('No data received from server');
        }
    } catch (error: any) {
        console.error('Error updating processing order status:', error);
        
        // More detailed error logging
        if (error.response) {
            console.error("Error status:", error.response.status);
            console.error("Error data:", error.response.data);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
        
        throw error;
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
export const fetchLowStockProducts = async () => {
  try {
    // Using threshold of 100 for low stock products
    const response = await InventoryapiUrl.get('/product/lowStock?threshold=100');
    if (response.data) {
      console.log("✅ Low stock products fetched:", response.data);
      return response.data;
    }
    return { data: [] };
  } catch (error: any) {
    console.error('❌ Error fetching low stock products:', error);
    if (error.response?.data?.statusMessage) {
      throw new Error(error.response.data.statusMessage);
    } else {
      throw new Error("Failed to fetch low stock products");
    }
  }
};

export const showInventory = async (categoryId?: number | string) => {
    try {
      const url = categoryId ? `/product/getAll?categoryId=${categoryId}` : '/product/getAll';
      const response = await InventoryapiUrl.get(url);
      return response.data;
    } catch (error) {
      console.log("❌ Error fetching inventory:", error);
      throw error;
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

