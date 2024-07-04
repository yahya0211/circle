import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export interface IFormLogin {
  email: string;
  password: string;
}

export const useLoginValidation = () => {
  const initialValue: IFormLogin = {
    email: "",
    password: "",
  };

  const schema = yup.object().shape({
    email: yup.string().required("Isi email yang benar"),
    password: yup.string().required("Password tidak boleh kosong"),
  });

  return useForm<IFormLogin>({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
    mode: "all",
    reValidateMode: "onSubmit",
  });
};
