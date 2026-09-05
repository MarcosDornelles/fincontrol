import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import FAB from "@/components/FAB";
import type { Account } from "@/lib/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-dvh md:pl-60">
      <Sidebar />
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-28 md:pb-16">{children}</main>
      <FAB accounts={(accounts as Account[]) || []} />
      <BottomNav />
    </div>
  );
}
