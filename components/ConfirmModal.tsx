"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmText = "Excluir",
  cancelText = "Cancelar",
  isDangerous = true,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-2xl ${
              isDangerous ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            <AlertTriangle size={24} />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">{description}</p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 rounded-xl py-2.5 text-xs font-medium hover:bg-gray-200 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full text-white rounded-xl py-2.5 text-xs font-medium transition ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
