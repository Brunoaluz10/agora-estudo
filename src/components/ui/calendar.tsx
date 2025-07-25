"use client";

import * as React from "react";
import { Calendar as CalendarPrimitive } from "@headlessui/react-calendar";

export function Calendar({
  selected,
  onSelect,
  className = "",
  mode = "single",
  captionLayout = "dropdown"
}: {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  className?: string;
  mode?: "single";
  captionLayout?: "dropdown" | "buttons";
}) {
  return (
    <CalendarPrimitive
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      className={`rounded-md border shadow-sm bg-gray-900 text-white ${className}`}
      captionLayout={captionLayout}
    />
  );
} 