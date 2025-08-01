// src/components/MessageBox.tsx
import React from "react";

interface MessageBoxProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-emerald-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";
  const textColor = "text-white";
  const borderColor =
    type === "success"
      ? "border-emerald-700"
      : type === "error"
      ? "border-red-700"
      : "border-blue-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className={`relative p-6 rounded-lg shadow-xl max-w-sm w-full border-b-4 ${bgColor} ${borderColor} transform transition-all duration-300 ease-out scale-100 opacity-100`}
        role="alert"
      >
        <p className={`text-lg font-semibold mb-2 ${textColor}`}>
          {type === "success"
            ? "Успіх!"
            : type === "error"
            ? "Помилка!"
            : "Інформація"}
        </p>
        <p className={`text-sm ${textColor} mb-4`}>{message}</p>
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 p-1 rounded-full ${textColor} hover:bg-opacity-80 transition-colors`}
          aria-label="Закрити"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
