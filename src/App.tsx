import "./App.css";
import { CartProvider } from "./context/CartContext";
import ECommerceApp from "./components/ECommerceApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ScrollRestoration } from "@tanstack/react-router";
import { ThemeProvider } from "./context/ThemeContext";
import { useState } from "react";
import { PaymentContext } from "./context/PaymentSecretContext";

export const queryClient = new QueryClient();
function App() {
  const [clientSecret, setClientSecret] = useState("");
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <ThemeProvider>
            <PaymentContext.Provider value={{ clientSecret, setClientSecret }}>
              <ScrollRestoration />
              <ECommerceApp />
            </PaymentContext.Provider>
          </ThemeProvider>
        </CartProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
