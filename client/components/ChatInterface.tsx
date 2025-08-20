import { useState, useRef, useEffect } from "react";
import { User, ExternalLink, Settings, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import hitesh_sir from '../../public/hitesh_sir.jpg';
import { AiInput } from "@/components/ui/ai-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { StreamingText } from "./TypingAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import socket from "@/utils/socketConnection";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ url: string; title: string }>;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatInterfaceProps {
  context: string;
}

const personas = [
  {
    id: "helpful",
    name: "Helpful Assistant",
    description: "Friendly and comprehensive responses",
    greeting: "Hello! I'm your AI assistant. I can help you with questions based on the context you've provided. How can I assist you today?",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    shadowColor: "rgba(59, 130, 246, 0.5)",
    avatar: "🤖",
  },
  {
    id: "expert",
    name: "Expert Analyst",
    description: "Technical and detailed analysis",
    greeting: "Greetings. I'm your expert analyst. I provide detailed, technical analysis based on your provided context. What would you like me to analyze?",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    shadowColor: "rgba(147, 51, 234, 0.5)",
    avatar: "🔬",
  },
  {
    id: "creative",
    name: "Creative Thinker",
    description: "Innovative and imaginative responses",
    greeting: "Hey there! I'm your creative AI companion. I love exploring ideas and thinking outside the box with your context. What interesting challenge can we tackle together?",
    color: "bg-green-500/10 text-green-700 dark:text-green-300",
    shadowColor: "rgba(34, 197, 94, 0.5)",
    avatar: "✨",
  },
  {
    id: "concise",
    name: "Concise Advisor",
    description: "Brief and to-the-point answers",
    greeting: "Hi. I'm your concise advisor. I provide clear, direct answers based on your context. What do you need to know?",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    shadowColor: "rgba(249, 115, 22, 0.5)",
    avatar: "⚡",
  },
];

export function ChatInterface({ context }: ChatInterfaceProps) {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: selectedPersona.greeting,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  // const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, streamingMessage]);

  useEffect(() => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: selectedPersona.greeting,
      timestamp: new Date(),
    }]);
  }, [selectedPersona]);

  const simulateStreamingResponse = (assistantMessage: string, sources: any[] = []) => {
    const randomResponse = assistantMessage;
    let personalizedResponse = randomResponse;

    switch (selectedPersona.id) {
      case "expert":
        personalizedResponse = `Technical Analysis: ${randomResponse}`;
        break;
      case "creative":
        personalizedResponse = `Creative Insight: ${randomResponse} Let me think creatively about this...`;
        break;
      case "concise":
        personalizedResponse = randomResponse.split('.')[0] + '.';
        break;
    }

    const fullResponse = `${personalizedResponse}`;

    const streamingMsg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: fullResponse,
      sources,
      timestamp: new Date(),
      isStreaming: true,
    };

    setStreamingMessage(streamingMsg);

    setTimeout(() => {
      setMessages(prev => [...prev, { ...streamingMsg, isStreaming: false }]);
      setStreamingMessage(null);
      setIsLoading(false);
    }, fullResponse.length * 30);
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    socket.emit('MessageFromClient', userMessage);
  };

  useEffect(() => {
    const handleServerMessage = (data: any) => {
      setIsLoading(false);

      simulateStreamingResponse(data?.content || "");
    }

    socket.on("MessageFromServer", handleServerMessage);

    return () => {
      socket.off("MessageFromServer", handleServerMessage);
    };
  }, []);

  useEffect(() => {
    if (messages?.length > 1) {
      localStorage.removeItem("chat");
      console.log("Item removed");
      localStorage.setItem('chat', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const msgs = JSON.parse(localStorage.getItem("chat") || "[]");
    setMessages(msgs.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }))
    );
  }, []);

  return (
    <Card className="h-full flex flex-col glass-effect overflow-hidden">
      <motion.div
        className="p-4 border-b border-border/50 bg-background/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={hitesh_sir}></AvatarImage>
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-lg">
                  {selectedPersona.avatar}
                </AvatarFallback>
              </Avatar>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Hitesh Choudhary
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </motion.div>
              </h3>
              <p className="text-sm text-muted-foreground">
                RAG-powered knowledge base
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-accent transition-colors"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>AI Persona (Dummy)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {personas.map((persona) => (
                <DropdownMenuItem
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-lg">{persona.avatar}</span>
                    <span className="font-medium">{persona.name}</span>
                    {selectedPersona.id === persona.id && (
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {persona.description}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <motion.div
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Badge variant="outline" className={cn("text-xs", selectedPersona.color)}>
            {selectedPersona.avatar} {selectedPersona.name}
          </Badge>
        </motion.div>
      </motion.div>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  className={cn(
                    "flex gap-4 group",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "flex gap-3 max-w-[85%] items-start",
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex-shrink-0"
                    >
                      <Avatar className="h-8 w-8 border border-border/50">
                        {message.role === "user" ? (
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        ) : (
                          <>
                            <AvatarImage src={hitesh_sir}></AvatarImage>
                            <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50">
                              {selectedPersona.avatar}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                    </motion.div>

                    <motion.div
                      className={cn(
                        "relative px-4 py-3 rounded-2xl backdrop-blur-sm border border-border/20",
                        message.role === "user"
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
                          : "bg-gradient-to-br from-muted/50 to-muted/30 shadow-md"
                      )}
                      whileHover={{
                        scale: 1.01,
                        boxShadow: message.role === "user"
                          ? "0 12px 32px rgba(124, 58, 237, 0.25)"
                          : `0 12px 32px ${selectedPersona.shadowColor}`,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Message content */}
                      <div className="space-y-2">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <motion.div
                            className="mt-3 pt-3 border-t border-border/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <p className="text-xs font-medium mb-2 opacity-80 flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              Sources:
                            </p>
                            <div className="space-y-1">
                              {message.sources.map((source, index) => (
                                <motion.a
                                  key={index}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-all duration-200 hover:underline p-1 rounded hover:bg-background/10"
                                  whileHover={{ x: 2 }}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  {source.title}
                                </motion.a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Message timestamp */}
                      <motion.div
                        className="absolute -bottom-5 text-xs opacity-0 group-hover:opacity-50 transition-opacity"
                        style={{
                          [message.role === "user" ? "right" : "left"]: "0"
                        }}
                      >
                        {typeof message?.timestamp == 'string' ? message?.timestamp : message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </motion.div>

                      {/* Sparkle effect for AI messages */}
                      {message.role === "assistant" && (
                        <motion.div
                          className="absolute -top-1 -right-1 text-yellow-400"
                          animate={{
                            rotate: [0, 360],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Zap className="h-3 w-3" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streaming Message */}
            <AnimatePresence>
              {streamingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="flex gap-3 max-w-[85%] items-start">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      <Avatar className="h-8 w-8 border border-border/50">
                        <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50">
                          {selectedPersona.avatar}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <motion.div
                      className="px-4 py-3 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border border-border/20 shadow-md"
                      whileHover={{
                        scale: 1.01,
                        boxShadow: `0 12px 32px ${selectedPersona.shadowColor}`,
                      }}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        <StreamingText
                          text={streamingMessage.content}
                          speed={30}
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            <AnimatePresence>
              {isLoading && !streamingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="flex gap-3 max-w-[85%] items-start">
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50">
                        {selectedPersona.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border border-border/20">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <motion.div
        className="p-4 border-t border-border/50 bg-background/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <AiInput
          onSend={handleSendMessage}
          placeholder="Ask me anything about your context..."
          disabled={isLoading}
        />
      </motion.div>
    </Card>
  );
}
