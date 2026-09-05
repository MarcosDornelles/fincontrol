import { formatCurrency } from "@/lib/utils";
import type { Account, Transaction } from "@/lib/types";
import { accountBalance } from "@/lib/utils";
import { Landmark, Wallet as WalletIcon } from "lucide-react";

export default function BalanceCard({
  accounts,
  transactions,
  total,
}: {
  accounts: Account[];
  transactions: Transaction[];
  total: number;
}) {
  return (
    <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-sm">
      <p className="text-xs text-gray-400 mb-1">Saldo total líquido</p>
      <p className="text-3xl font-semibold tracking-tight mb-5">{formatCurrency(total)}</p>

      <div className="space-y-2">
        {accounts.map((acc) => {
          const balance = accountBalance(acc, transactions);
          const Icon = acc.type === "bank" ? Landmark : WalletIcon;
          return (
            <div key={acc.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-300">
                <Icon size={15} /> {acc.name}
              </span>
              <span className="font-medium">{formatCurrency(balance)}</span>
            </div>
          );
        })}
        {accounts.length === 0 && (
          <p className="text-xs text-gray-400">Nenhuma conta cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}
