"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, Landmark, Wallet, LogOut } from "lucide-react";
import { signOut } from "@/app/login/actions";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { href: "/contas", label: "Minhas Contas", icon: Landmark },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 border-r border-gray-100 bg-white px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="bg-gray-900 text-white rounded-xl p-2">
          <Wallet size={18} />
        </div>
        <span className="font-semibold text-gray-900">FinControl</span>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut}>
        <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-100 w-full">
          <LogOut size={18} />
          Sair
        </button>
      </form>
    </aside>
  );
}
