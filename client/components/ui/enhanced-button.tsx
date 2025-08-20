"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";

interface EnhancedButtonProps extends ButtonProps {
  glow?: boolean;
  ripple?: boolean;
}

export function EnhancedButton({ 
  children, 
  className, 
  glow = false, 
  ripple = false, 
  ...props 
}: EnhancedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative inline-block"
    >
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          glow && "shadow-lg shadow-primary/25 hover:shadow-primary/40",
          className
        )}
        {...props}
      >
        {children}
        
        {/* Ripple effect */}
        {ripple && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-md"
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </Button>
      
      {/* Glow effect */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-md blur-md -z-10" />
      )}
    </motion.div>
  );
}

// Floating Action Button variant
export function FloatingButton({ 
  children, 
  className, 
  ...props 
}: ButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative"
    >
      <Button
        className={cn(
          "rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground",
          "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-primary before:to-purple-500 before:opacity-0 hover:before:opacity-20 before:transition-opacity",
          className
        )}
        size="icon"
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
