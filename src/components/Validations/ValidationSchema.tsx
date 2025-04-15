
import * as yup from "yup";
export const getRegisterSchema = () => {
    return yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),
      name: yup.string().required("Name is required"),
      address: yup.string().required("Address is required"),
      phone: yup
      .string()
      .trim()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    });
  };
  export const getLoginSchema = (isStrongPassword: boolean) => {
    return yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),
      password: isStrongPassword
      ? yup
          .string()
          // .min(8, "Password must be at least 8 characters")
          .matches(/[A-Z]/, "Must contain at least one uppercase letter")
          .matches(/[a-z]/, "Must contain at least one lowercase letter")
          .matches(/\d/, "Must contain at least one number")
          .required("Password is required")
      : yup.string()
      // .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    });
  };
  export const getDepartmentSchema = () => {
    return yup.object().shape({
      name: yup.string().required("Name is required"),
    });
  };