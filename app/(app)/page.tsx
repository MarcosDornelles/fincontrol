import { createClient } from "@/lib/supabase/server";
import BalanceCard from "@/components/BalanceCard";
import UpcomingList from "@/components/UpcomingList";
import TransactionList from "@/components/TransactionList";
import type { Account, Transaction } from "@/lib/types";
import { totalBalance, upcoming } from "@/lib/utils";

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: accounts }, { data: transactions }] = await Promise.all([
    supabase.from("accounts").select("*").order("created_at"),
    supabase
      .from("transactions")
      .select("*, accounts(name), locations(name)")
      .order("date", { ascending: false })
      .limit(50),
  ]);

  const accs = (accounts as Account[]) || [];
  const txs = (transactions as Transaction[]) || [];
  const total = totalBalance(accs, txs);
  const upcomingTxs = upcoming(txs).slice(0, 5);
  const recent = txs.filter((t) => t.date <= new Date().toISOString().slice(0, 10)).slice(0, 8);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 px-1">Início</h1>

      <BalanceCard accounts={accs} transactions={txs} total={total} />

      <UpcomingList transactions={upcomingTxs} />

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">Últimos lançamentos</h3>
        <TransactionList transactions={recent} accounts={accs} />
      </div>
    </div>
  );
}
