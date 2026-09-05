"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const type = formData.get("type") as "income" | "expense";
  const amount = Number(formData.get("amount"));
  const account_id = formData.get("account_id") as string;
  const date = formData.get("date") as string;
  const description = (formData.get("description") as string) || null;
  const locationName = (formData.get("location") as string)?.trim();

  if (!type || !amount || amount <= 0 || !account_id || !date) {
    throw new Error("Dados inválidos");
  }

  let location_id: string | null = null;

  if (type === "expense" && locationName) {
    const { data: existing } = await supabase
      .from("locations")
      .select("id")
      .eq("user_id", user.id)
      .ilike("name", locationName)
      .maybeSingle();

    if (existing) {
      location_id = existing.id;
    } else {
      const { data: created, error } = await supabase
        .from("locations")
        .insert({ user_id: user.id, name: locationName })
        .select("id")
        .single();
      if (error) throw error;
      location_id = created.id;
    }
  }

  const payment_method = (formData.get("payment_method") as string) || null;
  const isRecurring = formData.get("is_recurring") === "true";
  const repeatMonths = Math.min(Math.max(Number(formData.get("repeat_months") || 6), 1), 12);

  if (isRecurring) {
    const transactionsToInsert = [];
    const baseDate = new Date(date + "T00:00:00");
    const originalDay = baseDate.getDate();

    for (let i = 0; i < repeatMonths; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setMonth(baseDate.getMonth() + i);

      // Trata viradas de mês com menos dias (ex: dia 31 em fevereiro)
      if (nextDate.getDate() !== originalDay) {
        nextDate.setDate(0);
      }

      const dateISO = nextDate.toISOString().slice(0, 10);

      transactionsToInsert.push({
        user_id: user.id,
        account_id,
        location_id,
        type,
        amount,
        description,
        date: dateISO,
        is_recurring: true,
        payment_method,
      });
    }

    const { error } = await supabase.from("transactions").insert(transactionsToInsert);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      account_id,
      location_id,
      type,
      amount,
      description,
      date,
      is_recurring: false,
      payment_method,
    });
    if (error) throw error;
  }

  revalidatePath("/");
  revalidatePath("/transacoes");
  revalidatePath("/contas");
}

export async function updateTransaction(id: string, formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const type = formData.get("type") as "income" | "expense";
  const amount = Number(formData.get("amount"));
  const account_id = formData.get("account_id") as string;
  const date = formData.get("date") as string;
  const description = (formData.get("description") as string) || null;
  const locationName = (formData.get("location") as string)?.trim();
  const payment_method = (formData.get("payment_method") as string) || null;

  if (!type || !amount || amount <= 0 || !account_id || !date) {
    throw new Error("Dados inválidos");
  }

  let location_id: string | null = null;

  if (type === "expense" && locationName) {
    const { data: existing } = await supabase
      .from("locations")
      .select("id")
      .eq("user_id", user.id)
      .ilike("name", locationName)
      .maybeSingle();

    if (existing) {
      location_id = existing.id;
    } else {
      const { data: created, error } = await supabase
        .from("locations")
        .insert({ user_id: user.id, name: locationName })
        .select("id")
        .single();
      if (error) throw error;
      location_id = created.id;
    }
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      account_id,
      location_id,
      type,
      amount,
      description,
      date,
      payment_method,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/transacoes");
  revalidatePath("/contas");
}

export async function deleteTransaction(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/transacoes");
  revalidatePath("/contas");
}
