"use client";

import React, { useState, useEffect } from "react";

interface CurrencyInputProps {
  name: string;
  defaultValue?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function CurrencyInput({
  name,
  defaultValue = 0,
  placeholder = "R$ 0,00",
  required = false,
  className = "",
}: CurrencyInputProps) {
  // Guarda o valor em centavos como string inteira
  const [rawValue, setRawValue] = useState<string>(() => {
    if (!defaultValue) return "";
    return Math.round(defaultValue * 100).toString();
  });

  // Converte a string de dígitos para formato BRL (ex: "194888" -> "R$ 1.948,88")
  const formattedDisplay = React.useMemo(() => {
    if (!rawValue) return "";
    const cents = parseInt(rawValue, 10);
    if (isNaN(cents)) return "";
    
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }, [rawValue]);

  // Converte para valor numérico decimal em reais (ex: 1948.88) para enviar ao backend
  const numericValue = React.useMemo(() => {
    if (!rawValue) return "0";
    const cents = parseInt(rawValue, 10);
    return isNaN(cents) ? "0" : (cents / 100).toFixed(2);
  }, [rawValue]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Mantém apenas os dígitos digitados pelo usuário
    const digitsOnly = e.target.value.replace(/\D/g, "");
    // Remove zeros à esquerda desnecessários se houver
    const cleanDigits = digitsOnly.replace(/^0+/, "");
    setRawValue(cleanDigits);
  }

  return (
    <div>
      {/* Campo visível formatado como R$ 1.948,88 */}
      <input
        type="text"
        inputMode="numeric"
        value={formattedDisplay}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={className}
      />
      {/* Campo oculto com valor decimal padronizado (ex: 1948.88) enviado no FormData */}
      <input type="hidden" name={name} value={numericValue} />
    </div>
  );
}
