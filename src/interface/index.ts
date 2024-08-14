export interface IRegisterInput {
  name: "email" | "password" | "username";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
  };
}

export interface IErrorResponse {
  error: {
    details?: {
      errors: {
        message: string;
      }[];
    };
    message?: string;
  };
}

export interface ILoginInput {
  name: "identifier" | "password";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
  };
}

export interface ITodo {
  id?: number;
  title: string;
  description: string;
}
