import { createContext } from "react";

export type PaymentContextType = {
  clientSecret: string;
  setClientSecret: React.Dispatch<React.SetStateAction<string>>;
};

const initialPaymentContext: PaymentContextType = {
  clientSecret: "",
  setClientSecret: () => {},
};

export const PaymentContext = createContext(initialPaymentContext);
