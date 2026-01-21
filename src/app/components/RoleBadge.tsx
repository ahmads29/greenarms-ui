import { cn } from "@/app/components/ui/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";

type Role = "master" | "slave" | "standalone";

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const getRoleStyles = (r: Role) => {
    switch (r) {
      case "master":
        return "bg-blue-100 text-blue-800";
      case "slave":
        return "bg-purple-100 text-purple-800";
      case "standalone":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleTooltip = (r: Role) => {
    switch (r) {
      case "master":
        return "Master: Makes decisions for slave devices";
      case "slave":
        return "Slave: Follows master device decisions";
      case "standalone":
        return "Standalone: Acts as its own master";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-medium cursor-help capitalize",
              getRoleStyles(role),
              className
            )}
          >
            {role}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getRoleTooltip(role)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
