"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAccount(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as "bank" | "wallet";
  const initial_balance = Number(formData.get("initial_balance") || 0);

  if (!name || !type) throw new Error("Dados inválidos");

  const { error } = await supabase
    .from("accounts")
    .insert({ user_id: user.id, name, type, initial_balance });

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/contas");
}

export async function deleteAccount(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("accounts").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/contas");
}
