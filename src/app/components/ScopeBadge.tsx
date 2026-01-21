import { cn } from "@/app/components/ui/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";

type Scope = "device" | "plant" | "country-wide";

interface ScopeBadgeProps {
  scope: Scope;
  className?: string;
}

export function ScopeBadge({ scope, className }: ScopeBadgeProps) {
  const getScopeStyles = (s: Scope) => {
    switch (s) {
      case "device":
        return "bg-indigo-100 text-indigo-800";
      case "plant":
        return "bg-green-100 text-green-800";
      case "country-wide":
        return "bg-orange-100 text-orange-800";
    }
  };

  const getScopeLabel = (s: Scope) => {
    switch (s) {
      case "device":
        return "Device";
      case "plant":
        return "Plant";
      case "country-wide":
        return "Country-wide";
    }
  };

  const getScopeTooltip = (s: Scope) => {
    switch (s) {
      case "device":
        return "Device-specific: Overrides plant and country-wide prices";
      case "plant":
        return "Plant-level: Applies to all devices at this plant";
      case "country-wide":
        return "Country-wide: Applies to all plants and devices";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-medium cursor-help",
              getScopeStyles(scope),
              className
            )}
          >
            {getScopeLabel(scope)}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getScopeTooltip(scope)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
