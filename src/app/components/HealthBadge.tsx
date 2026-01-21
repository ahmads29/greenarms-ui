import { cn } from "@/app/components/ui/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

interface HealthBadgeProps {
  lastSeenAt: string | null;
  status: "active" | "inactive";
  className?: string;
}

export function HealthBadge({ lastSeenAt, status, className }: HealthBadgeProps) {
  const getHealthStatus = () => {
    if (status === "inactive") {
      return { label: "Inactive", className: "bg-gray-100 text-gray-800" };
    }

    if (!lastSeenAt) {
      return { label: "Offline", className: "bg-red-100 text-red-800" };
    }

    const lastSeen = new Date(lastSeenAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSeen.getTime()) / 1000 / 60;

    if (diffMinutes < 30) {
      return { label: "Online", className: "bg-green-100 text-green-800" };
    } else {
      return { label: "Offline", className: "bg-red-100 text-red-800" };
    }
  };

  const healthStatus = getHealthStatus();

  const tooltipText = lastSeenAt
    ? `Last seen: ${formatDistanceToNow(new Date(lastSeenAt), { addSuffix: true })}`
    : "Never seen";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-medium cursor-help",
              healthStatus.className,
              className
            )}
          >
            {healthStatus.label}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
