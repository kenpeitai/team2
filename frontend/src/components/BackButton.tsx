"use client";

import { useRouter } from "next/navigation";
import React from "react";

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
  className?: string;
};

export default function BackButton({ fallbackHref, label = "戻る", className = "" }: BackButtonProps) {
  const router = useRouter();

  const onClick = React.useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    if (fallbackHref) {
      router.push(fallbackHref);
      return;
    }
    router.back();
  }, [router, fallbackHref]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4A1 1 0 018 6.586L5.414 9H17a1 1 0 110 2H5.414L8 13.414a1 1 0 010 1.293z"
          clipRule="evenodd"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}


