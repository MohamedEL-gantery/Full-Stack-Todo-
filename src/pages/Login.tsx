import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMsg from "../components/InputErrorMsg";
import { Login_Form } from "../data";
import { loginSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interface";

type IFormInput = {
  identifier: string;
  password: string;
};

const LoginPage = () => {
  //Handler
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(loginSchema) });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data
      );
      if (status === 200) {
        toast.success("You will navigate to the home page after 2 seconds.", {
          duration: 1500,
          position: "bottom-center",
          style: {
            background: "black",
            color: "white",
            width: "fit-content",
          },
          icon: "👏",
        });
      }

      localStorage.setItem("loggedInUser", JSON.stringify(resData));
      setTimeout(() => {
        location.replace("/");
      }, 2000);
    } catch (err) {
      const errorObj = err as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
        duration: 4000,
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  //Render
  const loginForm = Login_Form.map(
    ({ name, placeholder, type, validation }, index) => (
      <div key={index}>
        <Input
          placeholder={placeholder}
          type={type}
          {...register(name, validation)}
        />
        {errors[name] && <InputErrorMsg msg={errors[name]?.message} />}
      </div>
    )
  );

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {loginForm}
        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
