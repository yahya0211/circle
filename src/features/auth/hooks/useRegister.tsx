import { useState, ChangeEvent } from "react";
import getError from "../../../utils/GetError";
import { API } from "../../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function useRegister() {
  const [form, setForm] = useState<Register>({
    fullname: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [Error, setError] = useState<string>("");
  const [isRegisterSuccess, setRegisterSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }
  async function handleRegister() {
    try {
      setIsLoading(true);

      const response = await API.post("register", form);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsError(false);
      setError("");
      setRegisterSuccess(true);
    } catch (error: any) {
      setIsError(true);
      setError(getError(error));
    } finally {
      setIsLoading(false);
      window.setTimeout(() => 3000);
      navigate("/login");
    }
  }
  return {
    form,
    handleChange,
    handleRegister,
    isLoading,
    isError,
    Error,
    isRegisterSuccess,
  };
}
