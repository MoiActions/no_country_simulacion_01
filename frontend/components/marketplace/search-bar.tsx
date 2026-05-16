"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
}

export function SearchBar({ value, onChange, onFilterClick }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, empresa o habilidad..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {onFilterClick && (
        <Button variant="outline" onClick={onFilterClick}>
          <Filter className="mr-2 h-4 w-4" />
          Filtros avanzados
        </Button>
      )}
    </div>
  );
}
