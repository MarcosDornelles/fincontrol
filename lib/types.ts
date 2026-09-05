export type Account = {
  id: string;
  user_id: string;
  name: string;
  type: "bank" | "wallet";
  initial_balance: number;
  created_at: string;
};

export type Location = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type PaymentMethod = "pix" | "boleto" | "credit" | "debit" | "cash";

export type Transaction = {
  id: string;
  user_id: string;
  account_id: string;
  location_id: string | null;
  type: "income" | "expense";
  amount: number;
  description: string | null;
  date: string; // yyyy-mm-dd
  is_recurring?: boolean;
  payment_method?: PaymentMethod | null;
  created_at: string;
  accounts?: { name: string } | null;
  locations?: { name: string } | null;
};
