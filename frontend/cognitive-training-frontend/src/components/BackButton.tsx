// src/components/BackButton.tsx
import { useRouter } from "next/router";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-200"
      aria-label="Volver"
    >
      {/* Usamos un SVG de flecha; puedes personalizarlo según tu diseño */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-purple-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}
