"use client";

import { useState, useTransition } from "react";
import { X, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { createTransaction } from "@/app/actions/transactions";
import LocationAutocomplete from "./LocationAutocomplete";
import type { Account } from "@/lib/types";
import { todayISO } from "@/lib/utils";

import CurrencyInput from "./CurrencyInput";

export default function TransactionModal({
  accounts,
  onClose,
}: {
  accounts: Account[];
  onClose: () => void;
}) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatMonths, setRepeatMonths] = useState(6);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("type", type);
    formData.set("is_recurring", isRecurring ? "true" : "false");
    if (isRecurring) {
      formData.set("repeat_months", repeatMonths.toString());
    }
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
          <CurrencyInput
            name="amount"
            required
            placeholder="Valor (ex: R$ 1.948,88)"
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
              Data de Vencimento / Lançamento
            </label>
            <input
              name="date"
              type="date"
              required
              defaultValue={todayISO()}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900"
              />
              <span className="text-xs font-medium text-gray-700">
                Tornar conta fixa / recorrente (se repete todo mês)
              </span>
            </label>
          </div>

          {isRecurring && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
              <label className="text-xs text-gray-600 block">
                Gerar automaticamente para os próximos:
              </label>
              <select
                value={repeatMonths}
                onChange={(e) => setRepeatMonths(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value={3}>3 meses</option>
                <option value={6}>6 meses (Recomendado)</option>
                <option value={9}>9 meses</option>
                <option value={12}>12 meses (1 ano)</option>
              </select>
              <p className="text-[11px] text-gray-400">
                Os lançamentos futuros aparecerão em &quot;A vencer&quot; e entrarão no saldo no dia correspondente de cada mês.
              </p>
            </div>
          )}

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
