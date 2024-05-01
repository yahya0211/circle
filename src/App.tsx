import "react-toastify/dist/ReactToastify.css";
import { Fragment } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast, ToastContainer } from "react-toastify";
import getError from "./utils/GetError";
import Router from "./router/router";
import store from "./redux/store";
import { Provider } from "react-redux";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(getError(error), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    },
  }),
});

function App() {
  return (
    <>
      <Fragment>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider>
              <Router />
            </ChakraProvider>
            <ReactQueryDevtools initialIsOpen={false} position="bottom" />
          </QueryClientProvider>
        </Provider>
        <ToastContainer />
      </Fragment>
    </>
  );
}

export default App;
