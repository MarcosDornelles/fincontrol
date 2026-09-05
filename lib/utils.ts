import type { Account, Transaction } from "./types";

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Só transações com data <= hoje contam no saldo atual. */
export function isRealized(dateISO: string): boolean {
  return dateISO <= todayISO();
}

export function accountBalance(account: Account, transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.account_id === account.id && isRealized(t.date))
    .reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), Number(account.initial_balance));
}

export function totalBalance(accounts: Account[], transactions: Transaction[]): number {
  return accounts.reduce((sum, acc) => sum + accountBalance(acc, transactions), 0);
}

export function upcoming(transactions: Transaction[]): Transaction[] {
  const today = todayISO();
  return transactions
    .filter((t) => t.date > today)
    .sort((a, b) => a.date.localeCompare(b.date));
}
