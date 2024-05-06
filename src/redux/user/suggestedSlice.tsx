import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import getError from "../../utils/GetError";
import { API } from "../../utils/api";

const jwtToken = localStorage.getItem("jwtToken");

type initialStateT = {
  data: Suggested[];
  isLoading: boolean;
  isError: boolean;
  error: string;
};

const initialState: initialStateT = {
  data: [],
  isLoading: true,
  isError: false,
  error: "",
};

export const getSuggested = createAsyncThunk("suggested", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("jwtToken");
    // console.log("Token Sugested:", token);

    const response = await API.get("getSuggested", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    return rejectWithValue({ errorMessage: getError(error) });
  }
});

const suggestedSlice = createSlice({
  name: "suggested",
  initialState,
  reducers: {}, //
  extraReducers: (builder) => {
    builder.addCase(getSuggested.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSuggested.fulfilled, (state, action: PayloadAction<Suggested[]>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.error = "";
    });
    builder.addCase(getSuggested.rejected, (state, action: PayloadAction<any>) => {
      state.data = [];
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.errorMessage || "Unknown Error Occured";
    });
  },
});

export default suggestedSlice.reducer;
