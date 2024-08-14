import { IRegisterInput, ILoginInput } from "../interface";

export const Register_Form: IRegisterInput[] = [
  {
    name: "username",
    placeholder: "Enter Username",
    type: "text",
    validation: {
      required: true,
      pattern: /^[A-Za-z]+$/i,
      minLength: 3,
    },
  },
  {
    name: "email",
    placeholder: "Enter Email",
    type: "email",
    validation: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  },
  {
    name: "password",
    placeholder: "Enter Password",
    type: "password",
    validation: {
      required: true,
      minLength: 6,
    },
  },
];

export const Login_Form: ILoginInput[] = [
  {
    name: "identifier",
    placeholder: "Enter Email",
    type: "email",
    validation: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  },
  {
    name: "password",
    placeholder: "Enter Password",
    type: "password",
    validation: {
      required: true,
      minLength: 6,
    },
  },
];
