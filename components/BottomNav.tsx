"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, Landmark } from "lucide-react";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { href: "/contas", label: "Minhas Contas", icon: Landmark },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-40">
      <div className="flex justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-2.5 px-4 text-[11px] ${
                active ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
