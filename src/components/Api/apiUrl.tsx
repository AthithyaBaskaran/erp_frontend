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
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
}
export const fetchUserForEdit = async (userId: number) => {
    try {
        const response = await apiUrl.get(`/users/edit-user?userId=${userId}`);
        console.log("response", userId);
        return response;
    } catch (error) {
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
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
};
export const addRole = async (dept_id: number, roleName: string) => {

    try {
        const response = await apiUrl.post(`/users/add-role`, { dept_id, roleName });
        console.log("response", response);
        return response.data;
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
}
export const showUsers = async (search:string) => {
    try {
        const response = await apiUrl.get(`/admin/users?search=${search}`);
        return response.data;
    } catch (error) {
        console.log("❌ Error fetching users:", error);
        throw error;
    }
};
export const AssignRole = async (departmentId: number) => {
    try {
        const response = await apiUrl.get(`/users/roles?departmentId=${departmentId}`);
        return response.data;
    } catch (error) {
        console.log("❌ Error fetching users:", error);
        throw error;
    }
};
export const showDepartment = async () => {
    try {
        const response = await apiUrl.get('/users/department');
        return response.data;
    } catch (error) {
        console.log("❌ Error fetching users:", error);
        throw error;
    }
};
export const AddDepartment = async () => {
    try {
        const response = await apiUrl.get('/users/department');
        return response.data;
    } catch (error) {
        console.log("❌ Error fetching users:", error);
        throw error;
    }
};
export const deleteUser = async (userId: number) => {
    try {
        const response = await apiUrl.delete(`/admin/user/delete?userId=${userId}`); // Include userId in the endpoint
        return response.data;
    } catch (error) {
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
    } catch (error) {
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
      const url = categoryId ? `/product/getAll?categoryId=${categoryId}` : '/product/getAll';
      const response = await InventoryapiUrl.get(url);
      return response.data;
    } catch (error) {
      console.log("❌ Error fetching inventory:", error);
      throw error;
    }
  };


export const deleteInventory = async (id: number) => {
    try {
        const response = await InventoryapiUrl.delete(`/product/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting inventory:', error);
        throw error;
    }
};

  

export const DownloadUserID = async (userId: string) => {
    try {
        const response = await apiUrl.get(`users/download/excel?userIds=${userId}`, {
            responseType: "arraybuffer",
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        return [];
    }
};

export const fetchCategoriesApi = async () => {
    try {
        const response = await InventoryapiUrl.get("/category/getAll");
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
// Sales Management API functions
export const createCustomer = async (data: { name: string; email: string; phone: string; address: string }) => {
    try {
        const response = await SalesApiUrl.post('/customer/create', data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
                throw new Error("Failed to create customer");
        }
    }
};

export const getAllCustomers = async () => {
    try {
        const response = await SalesApiUrl.get('/customer');
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching customers:", error);
        throw error;
    }
};

export const getCustomerById = async (id: number) => {
    try {
        const response = await SalesApiUrl.get(`/customer/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching customer with ID ${id}:`, error);
        throw error;
    }
};

export const updateCustomer = async (id: number, data: { name: string; email: string; phone: string; address: string }) => {
    try {
        const response = await SalesApiUrl.put(`/customer/${id}`, data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Failed to update customer");
        }
    }
};

export const deleteCustomer = async (id: number) => {
    try {
        const response = await SalesApiUrl.delete(`/customer/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error deleting customer with ID ${id}:`, error);
        throw error;
    }
};

export const createSalesOrder = async (data: { customerId: number; orderDate: string; totalAmount: number; status: string }) => {
    try {
        const response = await SalesApiUrl.post('/sales/orders', data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Failed to create sales order");
        }
    }
};

export const getAllSalesOrders = async () => {
    try {
        const response = await SalesApiUrl.get('/sales/orders');
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching sales orders:", error);
        throw error;
    }
};

export const getSalesOrderById = async (id: number) => {
    try {
        const response = await SalesApiUrl.get(`/sales/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching sales order with ID ${id}:`, error);
        throw error;
    }
};

export const updateSalesOrder = async (id: number, data: { customerId: number; orderDate: string; totalAmount: number; status: string }) => {
    try {
        const response = await SalesApiUrl.put(`/sales/orders/${id}`, data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Failed to update sales order");
        }
    }
};

export const deleteSalesOrder = async (id: number) => {
    try {
        const response = await SalesApiUrl.delete(`/sales/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error deleting sales order with ID ${id}:`, error);
        throw error;
    }
};

export const createInvoice = async (data: { orderId: number; invoiceDate: string; totalAmount: number }) => {
    try {
        const response = await SalesApiUrl.post('/invoices', data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Failed to create invoice");
        }
    }
};

export const getInvoicesByOrderId = async (orderId: number) => {
    try {
        const response = await SalesApiUrl.get(`/invoices/by-order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching invoices for order ID ${orderId}:`, error);
        throw error;
    }
};

export const getPaymentsByOrderId = async (orderId: number) => {
    try {
        const response = await SalesApiUrl.get(`/payments/by-order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching payments for order ID ${orderId}:`, error);
        throw error;
    }
};

export const createPayment = async (data: { orderId: number; paymentDate: string; amount: number; paymentMethod: string }) => {
    try {
        const response = await SalesApiUrl.post('/payments', data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Failed to create payment");
        }
    }
};      



export const updateInventoryApi = async (id: number, data: { name: string; sku: string; price: number | string; categoryId: number, stockQuantity: number }) => {
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
        if (error.response?.data?.statusMessage) {
            throw new Error(error.response.data.statusMessage);
        } else {
            throw new Error("Something went wrong while updating the inventory.");
        }
    }
}
