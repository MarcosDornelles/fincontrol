"use client";

import { useState } from "react";
import { Landmark, Wallet as WalletIcon, Plus, Trash2 } from "lucide-react";
import { accountBalance, formatCurrency } from "@/lib/utils";
import type { Account, Transaction } from "@/lib/types";
import AccountFormModal from "@/components/AccountFormModal";
import { deleteAccount } from "@/app/actions/accounts";

export default function ContasClient({
  accounts,
  transactions,
}: {
  accounts: Account[];
  transactions: Transaction[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-xl font-semibold text-gray-900">Minhas Contas</h1>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-white bg-gray-900 rounded-xl px-3.5 py-2 hover:bg-gray-800"
        >
          <Plus size={16} /> Nova
        </button>
      </div>

      <div className="space-y-3">
        {accounts.map((acc) => {
          const Icon = acc.type === "bank" ? Landmark : WalletIcon;
          const balance = accountBalance(acc, transactions);
          return (
            <div
              key={acc.id}
              className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 group"
            >
              <div className="bg-gray-100 rounded-xl p-2.5 text-gray-700">
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{acc.name}</p>
                <p className="text-xs text-gray-400">
                  {acc.type === "bank" ? "Conta bancária" : "Carteira física"}
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(balance)}</span>
              <form action={deleteAccount.bind(null, acc.id)}>
                <button
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition ml-1"
                  aria-label="Excluir conta"
                >
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          );
        })}

        {accounts.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">
            Nenhuma conta cadastrada. Toque em &quot;Nova&quot; para começar.
          </p>
        )}
      </div>

      {open && <AccountFormModal onClose={() => setOpen(false)} />}
    </div>
  );
}
