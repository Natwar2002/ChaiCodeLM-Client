import React, { useState, useEffect } from "react";
import { FileText, Link, Plus, Upload, X, CheckCircle, AlertCircle, Loader2, Check, Globe, Youtube, File, FileSpreadsheet, Presentation, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { indexData } from '../apis/index'
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import socket from "@/utils/socketConnection";
import DataProcessingLoader from "./DataProcessingLoader";

interface ContextInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContextChange: (context: string) => void;
}

interface ContextSource {
  id: string;
  type: "text" | "pdf" | "csv" | "pptx" | "doc" | "docx" | "json" | "url" | "youtube";
  name: string;
  content: string | File;
  status: "processing" | "success" | "error";
}

type InputType = "text" | "json" | "website" | "youtube" | "pdf" | "csv" | "pptx" | "doc" | "docx";

const inputTypes = [
  { type: "text" as const, label: "Text", icon: FileText },
  { type: "json" as const, label: "JSON", icon: Code2 },
  { type: "website" as const, label: "Website", icon: Globe },
  { type: "youtube" as const, label: "YouTube", icon: Youtube },
  { type: "pdf" as const, label: "PDF", icon: File },
  { type: "csv" as const, label: "CSV", icon: FileSpreadsheet },
  { type: "pptx" as const, label: "PPTX", icon: Presentation },
  { type: "doc" as const, label: "DOC", icon: FileText },
  { type: "docx" as const, label: "DOCX", icon: FileText },
];

export function ContextInputModal({ open, onOpenChange, onContextChange }: ContextInputModalProps) {
  const [selectedType, setSelectedType] = useState<InputType>("text");
  const [inputValue, setInputValue] = useState("");
  const [sources, setSources] = useState<ContextSource[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [showProcessing, setShowProccessing] = useState(false);

  const updateContext = (currentSources: ContextSource[]) => {
    const successfulSources = currentSources.filter(s => s.status === "success");
    const allContent = successfulSources.map(s => `[${s.type.toUpperCase()}: ${s.name}]\n${s.content}`).join("\n\n");
    onContextChange(allContent);
  };

  useEffect(() => {
    updateContext(sources);
    console.log(sources);
  }, [sources]);

  const addSource = (source: Omit<ContextSource, "id">) => {
    const newSource: ContextSource = {
      ...source,
      id: Date.now().toString(),
    };

    setSources([newSource]);

    // if (source.status === "processing") {
    //   setIsProcessing(true);

    //   setTimeout(() => {
    //     setSources(prev => prev.map(s =>
    //       s.id === newSource.id
    //         ? { ...s, status: Math.random() > 0.1 ? "success" : "error" as const }
    //         : s
    //     ));
    //     setIsProcessing(false);

    //     const isSuccess = Math.random() > 0.1;
    //     toast({
    //       title: isSuccess ? "Content added!" : "Processing failed",
    //       description: isSuccess
    //         ? `${source.type.toUpperCase()} content processed successfully.`
    //         : `Failed to process ${source.type.toUpperCase()} content.`,
    //       variant: isSuccess ? "default" : "destructive",
    //     });
    //   }, 2000);
    // } else {
    //   toast({
    //     title: "Content added!",
    //     description: `${source.type.toUpperCase()} content added successfully.`,
    //   });
    // }
  };

  const removeSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const clearAll = () => {
    setSources([]);
    setInputValue("");
    toast({
      title: "All content cleared",
      description: "Knowledge base has been cleared.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addSource({
        type: selectedType as ContextSource["type"],
        name: file.name,
        content: file,
        status: "processing",
      });
    }
    e.target.value = '';
  };

  const handleAddContext = async () => {
    if (!inputValue.trim() || isProcessing) return;
    setShowProccessing(true);

    const value = inputValue.trim();

    if (selectedType === "website" || selectedType === "youtube") {
      setIsProcessing(true);

      try {
        const extractedContent = selectedType === "youtube"
          ? `${value}`
          : `${value}`;

        await new Promise(resolve => setTimeout(resolve, 1500));

        addSource({
          type: selectedType === "youtube" ? "youtube" : "url",
          name: selectedType === "youtube" ? `YouTube: ${new URL(value).hostname}` : new URL(value).hostname,
          content: extractedContent,
          status: "processing",
        });

        setIsProcessing(false);
        setInputValue("");

      } catch (error) {
        setIsProcessing(false);
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL.",
          variant: "destructive",
        });
      }
    } else {
      addSource({
        type: selectedType === "json" ? "json" : "text",
        name: selectedType === "json" ? "JSON Object" : "Text Input",
        content: value,
        status: "success",
      });
      setInputValue("");
    }
  };

  const getStatusIcon = (status: ContextSource["status"]) => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
  };

  const getPlaceholder = () => {
    switch (selectedType) {
      case "text": return "Enter your text content...";
      case "json": return "Paste your JSON object here...";
      case "website": return "Enter website URL (https://example.com)";
      case "youtube": return "Enter YouTube URL (https://youtube.com/watch?v=...)";
      default: return "Upload a file using the button below...";
    }
  };

  const isFileType = ["pdf", "csv", "pptx", "doc", "docx"].includes(selectedType);
  const isUrlType = ["website", "youtube"].includes(selectedType);
  const isTextType = ["text", "json"].includes(selectedType);


  useEffect(() => {
    let timer;
    if (sources && sources.length > 0) {
      console.log('Uploading data to index', sources);
      setShowProccessing(true);
      async function call() {
        const res = await indexData({ source: sources[0].content, type: sources[0].type });
        toast({
          title: "Content added!",
          description: "content processed successfully.",
          variant: "default"
        });
        console.log(res);
        timer = setTimeout(() => {
          onOpenChange(false);
          setSources([]);
        }, 0);
      }
      call();
    }
    return () => clearTimeout(timer);
  }, [sources]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Add Context
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type Switcher */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Content Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {inputTypes.map(({ type, label, icon: Icon }) => (
                <motion.button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedType(type);
                    setInputValue("");
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border text-sm transition-all",
                    selectedType === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent border-border"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isFileType ? "File Upload" : "Content Input"}
            </Label>

            {isFileType ? (
              <div className="flex flex-col gap-2">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Click to upload {selectedType.toUpperCase()} file
                  </p>
                  <input
                    type="file"
                    accept={`.${selectedType}`}
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isProcessing}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {isTextType ? (
                  <Textarea
                    placeholder={getPlaceholder()}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                ) : (
                  <Input
                    type="url"
                    placeholder={getPlaceholder()}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Add Button */}
          {!isFileType && (
            <Button
              onClick={handleAddContext}
              disabled={!inputValue.trim() || isProcessing}
              className="w-full h-11"
              size="lg"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Context
            </Button>
          )}

          {/* Sources List */}
          {sources.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Added Sources ({sources.length})
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-7 text-xs"
                >
                  Clear All
                </Button>
              </div>

              <ScrollArea className="max-h-32 overflow-y-scroll">
                <div className="space-y-2 flex gap-1 flex-wrap">
                  <AnimatePresence>
                    {sources.map((source) => (
                      <motion.div
                        key={source.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg"
                      >
                        {getStatusIcon(source.status)}
                        <Badge variant="outline" className="text-xs">
                          {source.type.toUpperCase()}
                        </Badge>
                        <span className="text-sm flex-1 truncate">
                          {source.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeSource(source.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Processing Indicator */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Processing content...
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {
          showProcessing && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <DataProcessingLoader setShowProccessing={setShowProccessing} />
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}
