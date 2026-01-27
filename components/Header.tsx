"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  title?: string;
  hostelName?: string;
  hostelCity?: string;
  rightContent?: React.ReactNode;
}

export default function Header({
  showBack = false,
  backHref,
  title,
  hostelName,
  hostelCity,
  rightContent,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div>
            {title ? (
              <h1 className="text-xl font-bold">{title}</h1>
            ) : (
              <Link href="/" className="text-2xl font-black">
                <span className="text-pink">Bora</span>
                <span className="text-cyan">!</span>
              </Link>
            )}
            {hostelName && (
              <p className="text-xs text-gray-500">
                {hostelName} · {hostelCity}
              </p>
            )}
          </div>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
    </header>
  );
}
