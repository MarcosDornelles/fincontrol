"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import TransactionModal from "./TransactionModal";
import type { Account } from "@/lib/types";

export default function FAB({ accounts }: { accounts: Account[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Nova transação"
        className="fixed z-30 bottom-20 right-5 md:bottom-8 md:right-8 bg-gray-900 text-white rounded-full p-4 shadow-lg hover:bg-gray-800 active:scale-95 transition"
      >
        <Plus size={26} />
      </button>

      {open && <TransactionModal accounts={accounts} onClose={() => setOpen(false)} />}
    </>
  );
}
