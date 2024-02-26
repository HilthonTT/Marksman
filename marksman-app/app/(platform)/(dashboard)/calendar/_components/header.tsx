"use client";

import { AlertTriangle, CalendarIcon } from "lucide-react";

export const Header = () => {
  return (
    <div className="flex items-center justify-between pt-8 px-4">
      <h1 className="text-2xl font-bold italic text-muted-foreground flex items-center gap-1">
        <CalendarIcon />
        Calendar
      </h1>
      <span className="flex items-center text-rose-500 text-xs">
        <AlertTriangle className="h-5 w-5 mr-2" />
        Everyone in this organization will be able to see this.
      </span>
    </div>
  );
};
