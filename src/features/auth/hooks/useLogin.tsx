import { useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../redux/store";
import { loginAsync } from "../../../redux/auth";
import { useNavigate } from "react-router-dom";
import getError from "../../../utils/GetError";
import { IFormInput } from "../../../lib/loginValidation"; // Ensure this interface matches your form data structure

export function useLogin() {
  const [form, setForm] = useState<IFormInput>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [Error, setError] = useState<string>("");
  const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleLogin() {
    setIsLoading(true);
    setIsError(false);
    setError("");
    try {
      await dispatch(loginAsync(form)).unwrap();
      toast.success("Login Success", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsLoginSuccess(true);
      navigate("/");
    } catch (err: any) {
      setIsError(true);
      setError(getError(err));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    handleChange,
    handleLogin,
    isLoading,
    isError,
    Error,
    isLoginSuccess,
  };
}
