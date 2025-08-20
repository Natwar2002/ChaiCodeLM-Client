"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
}

export function TypingAnimation({
  text,
  speed = 30,
  onComplete,
  className = "",
  showCursor = true
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsTyping(true);

    if (text.length === 0) {
      setIsTyping(false);
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < text.length) {
          setDisplayedText(text.slice(0, prev + 1));
          return prev + 1;
        } else {
          setIsTyping(false);
          onComplete?.();
          clearInterval(timer);
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span className={`inline-block ${className}`}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {displayedText}
      </motion.span>

      <AnimatePresence>
        {isTyping && showCursor && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{
              opacity: [1, 0, 1],
              scale: [1, 0.8, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="ml-1 text-primary font-bold"
          >
            ▋
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// Alternative streaming effect for more realistic typing
export function StreamingText({
  text,
  speed = 50,
  className = "",
  onComplete
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setIsStreaming(true);

    let index = 0;
    const stream = () => {
      if (index < text.length) {
        // Vary the speed for more natural typing
        const chars = Math.floor(Math.random() * 3) + 1;
        const nextChars = text.slice(index, index + chars);

        setDisplayedText(prev => prev + nextChars);
        index += chars;

        // Random delay between 20-80ms for natural feel
        const delay = Math.random() * 60 + 20;
        setTimeout(stream, delay);
      } else {
        setIsStreaming(false);
        onComplete?.();
      }
    };

    const initialDelay = setTimeout(stream, speed);
    return () => clearTimeout(initialDelay);
  }, [text, speed, onComplete]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {displayedText}
      {isStreaming && (
        <motion.span
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block w-2 h-4 bg-primary/60 ml-1 rounded-sm"
        />
      )}
    </motion.span>
  );
}
