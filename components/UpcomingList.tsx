import { CalendarClock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

export default function UpcomingList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">A vencer</h3>
      <ul className="space-y-2">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3"
          >
            <CalendarClock size={18} className="text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {t.type === "income" ? t.description || "Entrada" : t.locations?.name || "Saída"}
              </p>
              <p className="text-xs text-gray-400">Vence em {formatDate(t.date)}</p>
            </div>
            <span className="text-sm font-semibold text-gray-700">{formatCurrency(t.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
