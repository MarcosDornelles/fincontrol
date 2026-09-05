import { createClient } from "@/lib/supabase/server";
import TransactionList from "@/components/TransactionList";
import type { Transaction } from "@/lib/types";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function monthRange(monthParam?: string) {
  const base = monthParam ? new Date(monthParam + "-01T00:00:00") : new Date();
  const year = base.getFullYear();
  const month = base.getMonth();
  const start = new Date(year, month, 1).toISOString().slice(0, 10);
  const end = new Date(year, month + 1, 0).toISOString().slice(0, 10);
  const label = base.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const prev = new Date(year, month - 1, 1).toISOString().slice(0, 7);
  const next = new Date(year, month + 1, 1).toISOString().slice(0, 7);
  return { start, end, label, prev, next };
}

export default async function TransacoesPage({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const { start, end, label, prev, next } = monthRange(searchParams.month);
  const supabase = createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, accounts(name), locations(name)")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false });

  const txs = (transactions as Transaction[]) || [];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-900 px-1">Transações</h1>

      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-3 py-2.5">
        <Link href={`/transacoes?month=${prev}`} className="p-1.5 text-gray-400 hover:text-gray-800">
          <ChevronLeft size={18} />
        </Link>
        <span className="text-sm font-medium text-gray-900 capitalize">{label}</span>
        <Link href={`/transacoes?month=${next}`} className="p-1.5 text-gray-400 hover:text-gray-800">
          <ChevronRight size={18} />
        </Link>
      </div>

      <TransactionList transactions={txs} />
    </div>
  );
}
