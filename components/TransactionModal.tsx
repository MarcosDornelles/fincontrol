"use client";

import { useState, useTransition } from "react";
import { X, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { createTransaction } from "@/app/actions/transactions";
import LocationAutocomplete from "./LocationAutocomplete";
import type { Account } from "@/lib/types";
import { todayISO } from "@/lib/utils";

export default function TransactionModal({
  accounts,
  onClose,
}: {
  accounts: Account[];
  onClose: () => void;
}) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("type", type);
    startTransition(async () => {
      try {
        await createTransaction(formData);
        onClose();
      } catch (e: any) {
        setError(e.message || "Erro ao salvar");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
      <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-6 pb-8 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Nova Transação</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition ${
              type === "expense" ? "bg-red-50 text-red-600 ring-2 ring-red-200" : "bg-gray-50 text-gray-500"
            }`}
          >
            <ArrowDownCircle size={18} /> Saída
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition ${
              type === "income" ? "bg-green-50 text-green-600 ring-2 ring-green-200" : "bg-gray-50 text-gray-500"
            }`}
          >
            <ArrowUpCircle size={18} /> Entrada
          </button>
        </div>

        <form action={handleSubmit} className="space-y-3">
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="Valor (R$)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          <select
            name="account_id"
            required
            defaultValue=""
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          >
            <option value="" disabled>
              {type === "income" ? "Em qual conta entrou?" : "De qual conta saiu?"}
            </option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          {type === "expense" ? (
            <LocationAutocomplete />
          ) : (
            <input
              name="description"
              placeholder="Descrição (ex: Salário)"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          )}

          <div>
            <label className="text-xs text-gray-500 ml-1">
              Data (use uma data futura para lançamentos como contas do mês seguinte)
            </label>
            <input
              name="date"
              type="date"
              required
              defaultValue={todayISO()}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isPending || accounts.length === 0}
            className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </button>

          {accounts.length === 0 && (
            <p className="text-xs text-amber-600 text-center">
              Cadastre uma conta em &quot;Minhas Contas&quot; antes de lançar.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
