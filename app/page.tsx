import Link from "next/link";

const fontFamily = '"Gv. time", system-ui, sans-serif';

// Star sparkle (4-point star)
function Star({ size, color, className }: { size: number; color: string; className?: string }) {
  return (
    <svg
      className={`absolute ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
    </svg>
  );
}

// Circle dot
function Dot({ size, color, className }: { size: number; color: string; className?: string }) {
  return (
    <div
      className={`absolute rounded-full ${className}`}
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
}

// Cross sparkle
function Cross({ size, color, className }: { size: number; color: string; className?: string }) {
  return (
    <svg
      className={`absolute ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M10 0H14V10H24V14H14V24H10V14H0V10H10V0Z" />
    </svg>
  );
}

// Sticker Logo - Cards stacked with rotation
function LogoSticker() {
  return (
    <div className="relative flex items-center justify-center mb-8" style={{ height: 180 }}>
      {/* Sparkles */}
      <Star size={20} color="#F50CA0" className="-top-2 left-8 opacity-80" />
      <Star size={14} color="#43DDE2" className="top-4 -left-2 opacity-70" />
      <Star size={24} color="#F9F940" className="-top-4 right-4 opacity-90" />
      <Star size={16} color="#F50CA0" className="top-8 right-0 opacity-60" />
      <Dot size={8} color="#43DDE2" className="top-16 -left-4 opacity-50" />
      <Dot size={6} color="#F50CA0" className="bottom-8 left-4 opacity-60" />
      <Cross size={12} color="#43DDE2" className="-top-2 left-1/4 opacity-50" />
      <Star size={12} color="#43DDE2" className="bottom-4 right-8 opacity-70" />
      <Dot size={10} color="#F9F940" className="top-2 right-16 opacity-60" />
      <Cross size={10} color="#F50CA0" className="bottom-12 -right-2 opacity-50" />

      {/* Stacked card layers */}
      <div className="relative" style={{ width: 280, height: 100 }}>
        {/* Layer 3 - Yellow (back, rotated right) */}
        <div
          className="absolute shadow-sm"
          style={{
            width: 280,
            height: 100,
            backgroundColor: "#F9F940",
            borderRadius: 28,
            transform: "rotate(6deg) translateY(8px)",
            transformOrigin: "center center",
          }}
        />
        {/* Layer 2 - Cyan (middle, rotated left slightly) */}
        <div
          className="absolute shadow-sm"
          style={{
            width: 280,
            height: 100,
            backgroundColor: "#43DDE2",
            borderRadius: 28,
            transform: "rotate(-3deg) translateY(4px)",
            transformOrigin: "center center",
          }}
        />
        {/* Layer 1 - Pink (front, slight rotation) */}
        <div
          className="absolute flex items-center justify-center shadow-lg"
          style={{
            width: 280,
            height: 100,
            backgroundColor: "#F50CA0",
            borderRadius: 28,
            transform: "rotate(-1deg)",
            transformOrigin: "center center",
          }}
        >
          {/* Bora! text - clean and bold */}
          <span
            className="font-black select-none tracking-tight"
            style={{
              fontFamily,
              fontSize: "3.5rem",
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Bora!
          </span>
        </div>
      </div>
    </div>
  );
}

// Primary Button - Modern pill style with depth
function PrimaryButton({
  children,
  href,
  variant,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  variant: "pink" | "cyan";
  icon?: string;
}) {
  const isPink = variant === "pink";

  return (
    <Link href={href} className="block w-full group">
      <div
        className="relative w-full transition-transform duration-150 active:scale-[0.98]"
        style={{ height: 56 }}
      >
        {/* Shadow/depth layer */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundColor: isPink ? "#c4087f" : "#2fb8bd",
            transform: "translateY(4px)",
          }}
        />
        {/* Main button */}
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center gap-3 transition-transform duration-150 group-hover:translate-y-[2px] group-active:translate-y-[3px]"
          style={{
            backgroundColor: isPink ? "#F50CA0" : "#43DDE2",
          }}
        >
          {icon && <span className="text-xl">{icon}</span>}
          <span
            className="font-bold text-lg"
            style={{
              color: isPink ? "#ffffff" : "#0a4a4d",
              fontFamily,
            }}
          >
            {children}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const exampleCode = "ABC123";

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-white px-8 py-12"
      style={{ fontFamily }}
    >
      <div className="w-full max-w-sm">
        {/* Logo Sticker */}
        <LogoSticker />

        {/* Subtitle */}
        <p className="text-center text-slate-500 text-lg mb-10">
          Planes en el hostel, sin vueltas.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-5 mb-8">
          <PrimaryButton href={`/join?code=${exampleCode}`} variant="pink" icon="🎉">
            Unirme a un grupo
          </PrimaryButton>
          <PrimaryButton href={`/tv?code=${exampleCode}`} variant="cyan" icon="📺">
            Modo TV
          </PrimaryButton>
        </div>

        {/* Helper text */}
        <p className="text-center text-slate-400 text-sm mb-10">
          Escaneá el QR del hostel para entrar.
        </p>

        {/* Dev Info Card */}
        <div
          className="bg-white border border-slate-200 p-5 mb-8"
          style={{ borderRadius: 20 }}
        >
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-4">
            DEV INFO
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 font-medium">Código:</span>
              <span
                className="px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{ backgroundColor: "#FEF9C3", color: "#854d0e" }}
              >
                {exampleCode} ~
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 font-medium">URL:</span>
              <code
                className="text-sm font-mono bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg flex-1"
              >
                /join?code={exampleCode}
              </code>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-6" />

        {/* Footer Links */}
        <div className="flex justify-center gap-8">
          <Link
            href={`/admin?code=${exampleCode}`}
            className="text-base text-slate-400 hover:text-slate-600 transition-colors font-medium"
          >
            Admin
          </Link>
          <Link
            href={`/board?code=${exampleCode}`}
            className="text-base text-slate-400 hover:text-slate-600 transition-colors font-medium"
          >
            Board
          </Link>
        </div>
      </div>
    </main>
  );
}
