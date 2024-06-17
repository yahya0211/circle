import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API } from "../../../utils/api";
import getError from "../../../utils/GetError";

const jwtToken = localStorage.getItem("jwtToken");

const fetchInfinityThreads = async ({ pageParam = 1 }) => {
  const response = await API.get(`findAllThread/${pageParam}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  return response.data;
};

 export const fetchThreadUser = async (userId: string) => {
  const response = await API.get(`findByUserId/${userId}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return response.data;
};


export const useInfinityThreads = () => {
  return useInfiniteQuery({
    queryKey: ["threads-infinity"],
    queryFn: fetchInfinityThreads,
    refetchOnWindowFocus: false,
    getNextPageParam: (LastPage, pages) => {
      if (LastPage.data.data.length) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: true,
  });
};

const postThread = (thread: ThreadPostType) => {
  return API.post("/uploadMultiple", thread, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const usePostThread = (reset: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postThread,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["threads-infinity"],
      });
      reset();
    },
    onError: (error) => {
      toast.error(getError(error)),
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        };
    },
  });
};

const postLikeThread = (threadId: string) => {
  return API.post(`thread/${threadId}/like`, "", {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
};

export const usePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLikeThread,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["threads-infinity"],
      });
    },
    onError: (error) => {
      toast.error(getError(error)),
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        };
    },
  });
};

const deleteThread = (threadId: string) => {
  return API.delete(`deleteThread/${threadId}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
};

export const useDeleteThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteThread,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["threads-infinity"],
      });
    },
    onError: (error) => {
      toast.error(getError(error)),
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        };
    },
  });
};

const fetchDetailThread = async (threadId: string) => {
  const response = await API.get(`findThreadById/${threadId}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return response.data;
};

export const useDetailThread = (threadId: string) => {
  return useQuery({
    queryKey: ["detail-findThreadById"],
    queryFn: () => fetchDetailThread(threadId),
    refetchOnWindowFocus: false,
  });
};

const postReply = async (reply: ReplyPostType) => {
  const threadId = reply.threadId;
  const payload = {
    ...reply,
  };
  delete payload.threadId;
  const response = await API.post(`addReply/${threadId}/reply`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const usePostReply = (reset: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReply,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detail-findThreadById"],
      });
      reset();
    },
    onError: (error) => {
      toast.error(getError(error)),
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        };
    },
  });
};
