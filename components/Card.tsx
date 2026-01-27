interface CardProps {
  emoji: string;
  title: string;
  subtitle?: string;
  time?: string;
  participants?: { emoji: string; name: string }[];
  variant?: "default" | "highlight";
  onClick?: () => void;
}

export default function Card({
  emoji,
  title,
  subtitle,
  time,
  participants = [],
  variant = "default",
  onClick,
}: CardProps) {
  const variants = {
    default: "bg-white border border-gray-200",
    highlight: "bg-pink-light border-2 border-pink",
  };

  return (
    <div
      onClick={onClick}
      className={`${variants[variant]} rounded-2xl p-4 transition-all duration-200 hover:shadow-lg cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-gray-900 truncate">{title}</h3>
            {time && (
              <span className="text-sm font-medium text-pink whitespace-nowrap">
                {time}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
          {participants.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {participants.slice(0, 5).map((p, i) => (
                <span
                  key={i}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-sm"
                  title={p.name}
                >
                  {p.emoji}
                </span>
              ))}
              {participants.length > 5 && (
                <span className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full text-xs font-medium">
                  +{participants.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
