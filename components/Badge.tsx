interface BadgeProps {
  children: React.ReactNode;
  variant?: "pink" | "cyan" | "yellow" | "gray";
}

export default function Badge({ children, variant = "pink" }: BadgeProps) {
  const variants = {
    pink: "bg-pink-light text-pink",
    cyan: "bg-cyan-light text-cyan",
    yellow: "bg-yellow-light text-yellow",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`${variants[variant]} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}
    >
      {children}
    </span>
  );
}
