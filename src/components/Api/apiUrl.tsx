import { apiUrl } from "../Api/BaseUrl";


export const LoginForm = async (email: string, password: string,) => {

    try {
        const response = await apiUrl.post(`/auth/login`, { email, password }); 
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
export const showUsers = async () => {
    try {
      const response = await apiUrl.get('/admin/users');
      console.log("✅ Response:", response.data.data);
 
      return response.data;
    } catch (error) {
      console.log("❌ Error fetching users:", error);
      throw error;
    }
};
