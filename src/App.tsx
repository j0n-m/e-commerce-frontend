import "./App.css";
import { CartProvider } from "./context/CartContext";
import ECommerceApp from "./components/ECommerceApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ScrollRestoration } from "@tanstack/react-router";

export const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <ScrollRestoration />
          <ECommerceApp />
        </CartProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
