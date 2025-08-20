"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

export function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 50,
  minLeftWidth = 35,
  maxLeftWidth = 65,
  className
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth);
      setLeftWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [minLeftWidth, maxLeftWidth]);

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full w-full min-h-0", className)}
    >
      {/* Left Panel */}
      <div
        style={{ 
          width: `${leftWidth}%`,
          minWidth: `${minLeftWidth}%`,
          maxWidth: `${maxLeftWidth}%`
        }}
        className="flex-shrink-0 h-full overflow-hidden"
      >
        <div className="h-full w-full">
          {leftPanel}
        </div>
      </div>

      {/* Resizer */}
      <div
        className={cn(
          "flex-shrink-0 relative flex items-center justify-center w-1 bg-border hover:bg-border/80 cursor-col-resize transition-colors group",
          isDragging && "bg-primary"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
        <motion.div
          className={cn(
            "flex items-center justify-center w-6 h-12 bg-background border border-border rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
            isDragging && "opacity-100"
          )}
          animate={{
            scale: isDragging ? 1.1 : 1,
          }}
          transition={{ duration: 0.1 }}
        >
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </motion.div>
      </div>

      {/* Right Panel */}
      <div
        style={{ 
          width: `${100 - leftWidth}%`,
          minWidth: `${100 - maxLeftWidth}%`,
          maxWidth: `${100 - minLeftWidth}%`
        }}
        className="flex-shrink-0 h-full overflow-hidden"
      >
        <div className="h-full w-full">
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
