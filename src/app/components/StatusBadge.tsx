import { cn } from "@/app/components/ui/utils";

type Decision = "CHARGING" | "DISCHARGING" | "NEUTRAL" | "UNKNOWN" | null;

interface StatusBadgeProps {
  decision: Decision;
  effectiveStatus?: Decision;
  className?: string;
}

export function StatusBadge({ decision, effectiveStatus, className }: StatusBadgeProps) {
  const status = effectiveStatus || decision;

  const getStatusStyles = (s: Decision) => {
    switch (s) {
      case "CHARGING":
        return "bg-green-100 text-green-800";
      case "DISCHARGING":
        return "bg-red-100 text-red-800";
      case "NEUTRAL":
        return "bg-gray-100 text-gray-800";
      case "UNKNOWN":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (s: Decision) => {
    if (!s) return "UNKNOWN";
    return s;
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusStyles(status),
        className
      )}
    >
      {getStatusText(status)}
    </span>
  );
}
