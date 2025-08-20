import React, { useEffect, useState } from "react";
import { FileText, Plus, Sparkles, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContextInputModal } from "./ContextInputModal";
import { motion } from "framer-motion";

interface ContextButtonProps {
  onContextChange: (context: string) => void;
  hasContext?: boolean;
}

export function ContextButton({ onContextChange, hasContext = false }: ContextButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="h-full glass-effect overflow-hidden flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center p-8">
          <motion.div
            className="text-center space-y-6 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Icon */}
            <motion.div
              className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Database className="w-10 h-10 text-primary" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Title and Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Knowledge Base
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Add context from documents, URLs, or text to enhance your AI conversations with relevant information.
              </p>
            </div>

            {/* Status Badge */}
            {hasContext && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex justify-center"
              >
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Context Active
                </Badge>
              </motion.div>
            )}

            {/* Action Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 2 }}
                >
                  <Plus className="w-5 h-5" />
                  {hasContext ? "Manage Context" : "Add Context"}
                  <FileText className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Feature List */}
            <motion.div
              className="grid grid-cols-2 gap-3 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                PDFs & Docs
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Web URLs
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Text & JSON
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                YouTube
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
      <ContextInputModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onContextChange={onContextChange}
      />
    </>
  );
}
