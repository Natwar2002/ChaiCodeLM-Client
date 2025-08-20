import React, { useState } from "react";
import { Brain, Sparkles, Menu, Maximize2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ContextButton } from "@/components/ContextButton";
import { ChatInterface } from "@/components/ChatInterface";
import { ResizablePanels } from "@/components/ui/resizable-panels";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

export default function Index() {
  const [context, setContext] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-3/4 left-3/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Header */}
      <motion.header
        className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="p-2 rounded-xl bg-primary/10 border border-primary/20 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="h-6 w-6 text-primary relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20"
                  animate={{
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
              <div>
                <motion.h1
                  className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                >
                  ChaiCode LM
                </motion.h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Intelligent context-aware AI
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.div
                className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary border border-primary/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-3 w-3" />
                </motion.div>
                AI Powered
              </motion.div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Desktop Layout */}
        <motion.div
          className="hidden lg:block h-[calc(100vh-120px)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ResizablePanels
            leftPanel={
              <motion.div
                className="h-full pr-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ContextButton
                  onContextChange={setContext}
                  hasContext={Boolean(context.trim())}
                />
              </motion.div>
            }
            rightPanel={
              <motion.div
                className="h-full pl-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ChatInterface context={context} />
              </motion.div>
            }
            defaultLeftWidth={35}
            minLeftWidth={25}
            maxLeftWidth={50}
          />
        </motion.div>

        {/* Mobile Layout */}
        <motion.div
          className="lg:hidden space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Mobile Navigation */}
          <div className="flex gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 h-12 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-all duration-200"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2"
                  >
                    <Menu className="h-4 w-4" />
                    Context Input
                    <Maximize2 className="h-3 w-3 ml-auto opacity-60" />
                  </motion.div>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-96 p-0">
                <motion.div
                  className="h-full overflow-auto p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContextButton
                    onContextChange={setContext}
                    hasContext={Boolean(context.trim())}
                  />
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Chat - Always Visible */}
          <motion.div
            className="h-[calc(100vh-200px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ChatInterface context={context} />
          </motion.div>
        </motion.div>
      </main>

      {/* Floating Action Indicators */}
      <AnimatePresence>
        {context && (
          <motion.div
            className="fixed bottom-6 left-6 z-40"
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary">
              <motion.div
                className="flex items-center gap-2"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Context Active
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
