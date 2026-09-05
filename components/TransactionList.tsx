"use client";

import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/lib/types";
import { deleteTransaction } from "@/app/actions/transactions";

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-10">Nenhum lançamento ainda.</p>;
  }

  return (
    <ul className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {transactions.map((t) => (
        <li key={t.id} className="flex items-center gap-3 px-4 py-3.5 group">
          {t.type === "income" ? (
            <ArrowUpCircle size={22} className="text-income shrink-0" />
          ) : (
            <ArrowDownCircle size={22} className="text-expense shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {t.type === "income" ? t.description || "Entrada" : t.locations?.name || "Saída"}
            </p>
            <p className="text-xs text-gray-400">
              {formatDate(t.date)} · {t.accounts?.name}
            </p>
          </div>

          <span className={`text-sm font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}>
            {t.type === "income" ? "+" : "-"}
            {formatCurrency(t.amount)}
          </span>

          <form action={deleteTransaction.bind(null, t.id)}>
            <button
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition ml-1"
              aria-label="Excluir"
            >
              <Trash2 size={15} />
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
