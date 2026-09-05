import { createClient } from "@/lib/supabase/server";
import type { Account, Transaction } from "@/lib/types";
import ContasClient from "./ContasClient";

export default async function ContasPage() {
  const supabase = createClient();

  const [{ data: accounts }, { data: transactions }] = await Promise.all([
    supabase.from("accounts").select("*").order("created_at"),
    supabase.from("transactions").select("*"),
  ]);

  return (
    <ContasClient
      accounts={(accounts as Account[]) || []}
      transactions={(transactions as Transaction[]) || []}
    />
  );
}
