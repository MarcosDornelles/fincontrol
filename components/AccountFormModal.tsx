"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { createAccount } from "@/app/actions/accounts";

export default function AccountFormModal({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createAccount(formData);
        onClose();
      } catch (e: any) {
        setError(e.message || "Erro ao salvar");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
      <div className="bg-white w-full md:max-w-sm rounded-t-3xl md:rounded-3xl p-6 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Nova Conta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-3">
          <input
            name="name"
            required
            placeholder="Nome (ex: Conta Bancária 1)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          <select
            name="type"
            required
            defaultValue="bank"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="bank">Conta Bancária</option>
            <option value="wallet">Carteira Física</option>
          </select>

          <input
            name="initial_balance"
            type="number"
            step="0.01"
            defaultValue={0}
            placeholder="Saldo inicial (R$)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
}
