import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface FilterBarProps {
  selectedStatus: string | null;
  selectedPlatform: string | null;
  onStatusChange: (status: string | null) => void;
  onPlatformChange: (platform: string | null) => void;
  onReset: () => void;
}

const FilterBar = ({
  selectedStatus,
  selectedPlatform,
  onStatusChange,
  onPlatformChange,
  onReset
}: FilterBarProps) => {
  const statuses = ["upcoming", "ongoing", "ending-soon", "closed"];
  const platforms = ["Devpost", "MLH", "Unstop", "DoraHacks", "Hack2Skill", "Devfolio", "LabAI"];

  const hasActiveFilters = selectedStatus || selectedPlatform;

  return (
    <div className="border-b border-border bg-card">
      <div className="container py-6">
        <div className="flex flex-col gap-4">
          {/* Status Filters */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  className="cursor-pointer capitalize transition-all hover:scale-105"
                  onClick={() => onStatusChange(selectedStatus === status ? null : status)}
                >
                  {status.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>

          {/* Platform Filters */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Platform</h3>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <Badge
                  key={platform}
                  variant={selectedPlatform === platform ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => onPlatformChange(selectedPlatform === platform ? null : platform)}
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <div className="flex justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
