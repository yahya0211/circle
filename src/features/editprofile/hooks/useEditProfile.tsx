import { useState, ChangeEvent, useEffect } from "react";
import { API } from "../../../utils/api";
import { toast } from "react-toastify";
import getError from "../../../utils/GetError";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../../redux/user/profileSlice";

// Define the type to handle both string (URL) and File
interface EditProfileType {
  fullname: string;
  username: string;
  bio: string;
  photo_profile: string | File | null;
}

export function useEditProfile() {
  const profile = useAppSelector((state) => state.profile);
  const [form, setForm] = useState<EditProfileType>({
    fullname: "",
    username: "",
    bio: "",
    photo_profile: null,
  });
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isEditProfileSuccess, setIsEditProfileSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (profile.data) {
      setForm({
        fullname: "",
        username: "",
        bio: "",
        photo_profile: null,
      });
    }
  }, [profile]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = event.target;

    if (name === "photo_profile" && files && files[0]) {
      setForm({
        ...form,
        [name]: files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  }

  async function handleEditProfile() {
    if (!form.fullname || !form.bio || !form.username) {
      setIsError(true);
      setError("All fields are required");
      return;
    }

    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setIsError(true);
      setError("JWT token not found in localStorage");
      return;
    }

    try {
      setIsLoading(true);
      const decodeToken = jwtToken.split(".")[1];
      const userData = JSON.parse(atob(decodeToken));
      const idUser = userData?.User?.id;

      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("username", form.username);
      formData.append("bio", form.bio);
      if (form.photo_profile instanceof File) {
        formData.append("image", form.photo_profile);
      } else if (typeof form.photo_profile === "string") {
        formData.append("photo_profile", form.photo_profile);
      }

      const response = await API.put(`editProfile/${idUser}`, formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(getProfile());

      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsError(false);
      setError("");
      setIsEditProfileSuccess(true);
    } catch (error) {
      setIsError(true);
      setError(getError(error));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    handleChange,
    handleEditProfile,
    isLoading,
    isError,
    error,
    isEditProfileSuccess,
  };
}
