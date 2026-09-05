import { Wallet } from "lucide-react";
import { signIn, signUp } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gray-900 text-white rounded-2xl p-3 mb-3">
            <Wallet size={28} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">FinControl</h1>
          <p className="text-sm text-gray-500">Suas finanças, sob controle.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form action={signIn} className="space-y-3">
            <input
              name="email"
              type="email"
              required
              placeholder="E-mail"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Senha"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />

            {searchParams.error && (
              <p className="text-xs text-red-600">{searchParams.error}</p>
            )}
            {searchParams.message && (
              <p className="text-xs text-green-600">{searchParams.message}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 transition"
            >
              Entrar
            </button>
            <button
              formAction={signUp}
              type="submit"
              className="w-full bg-gray-100 text-gray-900 rounded-xl py-3 text-sm font-medium hover:bg-gray-200 transition"
            >
              Criar conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
