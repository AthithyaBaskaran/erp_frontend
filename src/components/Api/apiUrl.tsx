import { apiUrl } from "../Api/BaseUrl";

export const LoginForm = async (email: string, password: string,) => {
    try {
        const response = await apiUrl.post(`auth/login`, { email, password }); 
        console.log(response.data);
        
        // ✅ Changed delete to post
        return response.data;
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
};
export const addUsers = async (user: { name: string; email: string; phone?: string, address: string }) => {

    try {
        const response = await apiUrl.post(`/users/register`, user);
        console.log("response", response);

        // ✅ Changed delete to post
        return response.data;
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
};
export const assignRoleAndDept = async (userId: number,roleId: number,deptId: number) => {
    try {
        const response = await apiUrl.post(`/users/assign-role-department`, {userId,roleId,deptId});
        console.log("response", userId,deptId,roleId);
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
  

export const addDepartment = async ( name: string) => {

    try {
        const response = await apiUrl.post(`/users/add-department`, {name} );
        console.log("responseDepartment", response);

        // ✅ Changed delete to post
        return response.data;
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
};
export const addRole = async ( dept_id: number,roleName: string) => {

    try {
        const response = await apiUrl.post(`/users/add-role`,{dept_id,roleName});
        console.log("response", response);
        return response.data;
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        throw error;
    }
}
export const showUsers = async () => {
    try {
      const response = await apiUrl.get('/admin/users');
 
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
export const ChangeUser = async (email:string,oldPassword:string,newPassword:string) => {
    try {
      const response = await apiUrl.post(`/auth/change-password`,{email,oldPassword,newPassword}); 
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
