import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  label?: string;
  value: string;
  options: { label: string; value: string; icon?: LucideIcon }[];
  onChange: (value: string) => void;
  className?: string;
}

export function Selector({ label, value, options, onChange, className }: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="text-xs font-medium text-muted-foreground ml-1">{label}</span>}
      <div className="flex bg-secondary/50 p-1 rounded-lg border border-border/50">
        {options.map((opt) => {
          const isActive = opt.value === value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
