import * as yup from "yup";

export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required.")
      .matches(/^[A-Za-z]+$/i, "Enter a valid name.")
      .min(3, "Username should be at-last 3 characters."),
    email: yup
      .string()
      .email()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email."
      )
      .required("Email is required."),
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Password should be at-last 6 characters."),
  })
  .required();

export const loginSchema = yup
  .object({
    identifier: yup
      .string()
      .email()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email."
      )
      .required("Email is required."),
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Password should be at-last 6 characters."),
  })
  .required();

export const updateSchema = yup.object().shape({
  title: yup.string().min(1, "Not allow null"),
  description: yup.string().min(1, "Not allow null"),
});
