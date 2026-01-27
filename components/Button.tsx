interface ButtonProps {
  children: React.ReactNode;
  variant?: "pink" | "cyan" | "yellow" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export default function Button({
  children,
  variant = "pink",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "font-bold rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    pink: "bg-pink text-white hover:brightness-110 shadow-lg shadow-pink/30",
    cyan: "bg-cyan text-gray-900 hover:brightness-110 shadow-lg shadow-cyan/30",
    yellow: "bg-yellow text-gray-900 hover:brightness-110 shadow-lg shadow-yellow/30",
    outline: "bg-transparent border-2 border-pink text-pink hover:bg-pink hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
