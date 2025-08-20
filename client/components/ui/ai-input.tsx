"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Search, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AiInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AiInput({
  onSend,
  placeholder = "Ask me anything...",
  disabled = false,
  className
}: AiInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend?.(value.trim());
      setValue("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full max-w-4xl mx-auto",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Colorful Shadow Background */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
          animate={{
            opacity: isFocused || isHovered ? 1 : 0,
          }}
          style={{
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)",
            backgroundSize: "400% 400%",
            filter: "blur(20px)",
            transform: "scale(1.1)",
            zIndex: -1,
          }}
        >
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full"
            style={{
              background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)",
              backgroundSize: "400% 400%",
            }}
          />
        </motion.div>

        <div className={cn(
          "relative flex items-end w-full min-h-[60px] p-4 bg-background/90 backdrop-blur-sm border border-border/50 rounded-2xl transition-all duration-300",
          isFocused && "border-primary/50 shadow-lg shadow-primary/10",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          {/* Search Icon */}
          {/* <motion.div
            className="flex items-center justify-center w-6 h-6 mr-3 text-muted-foreground"
            animate={{
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
            }}
            transition={{ duration: 0.2 }}
          >
            <Search className="w-5 h-5" />
          </motion.div> */}

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "flex-1 bg-transparent border-0 outline-none resize-none text-sm placeholder:text-muted-foreground",
              "min-h-[32px] max-h-[120px] leading-6 py-1",
              disabled && "cursor-not-allowed"
            )}
            style={{
              height: 'auto',
              overflowY: value.split('\n').length > 2 ? 'auto' : 'hidden'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />

          {/* Submit Button */}
          <AnimatePresence>
            {value.trim() && (
              <motion.button
                type="submit"
                disabled={disabled}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-center justify-center w-8 h-8 ml-2 bg-primary text-primary-foreground rounded-xl transition-all duration-200 relative overflow-hidden",
                  "hover:bg-primary/90 active:scale-95",
                  disabled && "opacity-50 cursor-not-allowed hover:scale-100"
                )}
              >
                <Send className="w-4 h-4 relative z-10" />

                {/* Button Gradient Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* AI Sparkle Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isFocused ? 1 : 0.6,
            scale: isFocused ? 1 : 0.8,
            rotate: isFocused ? 360 : 0
          }}
          transition={{ duration: 0.3 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
        </motion.div>

        {/* Floating Particles Effect */}
        <AnimatePresence>
          {isFocused && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 100 - 50,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -50],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}
