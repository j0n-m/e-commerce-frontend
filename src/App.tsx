import "./App.css";
import { CartProvider } from "./context/CartContext";
import ECommerceApp from "./components/ECommerceApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  NavigateOptions,
  ScrollRestoration,
  ToOptions,
  useRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "./context/ThemeContext";
import { PaymentProvider } from "./context/PaymentSecretContext";
import { AuthProvider } from "./context/AuthContext";
import { RouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    href: ToOptions["to"];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

export const queryClient = new QueryClient();
function App() {
  const router = useRouter();
  return (
    <>
      <RouterProvider
        navigate={(to, options) => router.navigate({ to, ...options })}
        useHref={(to) => router.buildLocation({ to }).href}
      >
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <ThemeProvider>
              <PaymentProvider>
                <AuthProvider>
                  <ScrollRestoration />
                  <ECommerceApp />
                </AuthProvider>
              </PaymentProvider>
            </ThemeProvider>
          </CartProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </RouterProvider>
    </>
  );
}

export default App;
