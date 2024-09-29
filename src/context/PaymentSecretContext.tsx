import { createContext, ReactNode, useState } from "react";

export type CustomerType = {
  address?: CustomerAddressType;
  name?: string;
};

export type CustomerAddressType = {
  city?: string;
  country?: string;
  line1?: string;
  line2?: null | string;
  postal_code?: string;
  state?: string;
};
export type PaymentContextType = {
  clientSecret: string;
  setClientSecret: React.Dispatch<React.SetStateAction<string>>;
  customerSessionSecret: string;
  setCustomerSessionSecret: React.Dispatch<React.SetStateAction<string>>;
  customer: CustomerType | null | undefined;
  setCustomer: React.Dispatch<
    React.SetStateAction<CustomerType | null | undefined>
  >;
  paymentAmount: number;
  setPaymentAmount: React.Dispatch<React.SetStateAction<number>>;
};

const initialPaymentContext: PaymentContextType = {
  clientSecret: "",
  setClientSecret: () => {},
  customerSessionSecret: "",
  setCustomerSessionSecret: () => {},
  customer: null,
  setCustomer: () => {},
  paymentAmount: 0,
  setPaymentAmount: () => {},
};
export const PaymentContext = createContext(initialPaymentContext);

type CustomerProviderProps = {
  children: ReactNode;
};
export function PaymentProvider({ children }: CustomerProviderProps) {
  const [customer, setCustomer] = useState(initialPaymentContext.customer);
  const [clientSecret, setClientSecret] = useState(
    initialPaymentContext.clientSecret
  );
  const [customerSessionSecret, setCustomerSessionSecret] = useState(
    initialPaymentContext.customerSessionSecret
  );
  const [paymentAmount, setPaymentAmount] = useState(0);

  return (
    <PaymentContext.Provider
      value={{
        customer,
        setCustomer,
        clientSecret,
        setClientSecret,
        customerSessionSecret,
        setCustomerSessionSecret,
        paymentAmount,
        setPaymentAmount,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}
