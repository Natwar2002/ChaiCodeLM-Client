import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    Layers,
    Brain,
    Save,
    Sparkles
} from 'lucide-react';
import socket from '@/utils/socketConnection';
interface DataProcessingLoaderProps {
    setShowProccessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataProcessingLoader: React.FC<DataProcessingLoaderProps> = ({ setShowProccessing }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [count, setCount] = useState(0);

    const steps = [
        { text: 'Processing Data', icon: Database, color: 'from-blue-400 to-blue-600' },
        { text: 'Chunking Data', icon: Layers, color: 'from-purple-400 to-purple-600' },
        { text: 'Embedding Data', icon: Brain, color: 'from-pink-400 to-pink-600' },
        { text: 'Storing Data', icon: Save, color: 'from-green-400 to-green-600' },
    ];

    useEffect(() => {
        let subscribed = false;

        if (!subscribed) {
            const handler = (data: number) => {
                setCount(data);
                console.log(data);
            };
            socket.on("LoadingDoc", handler);
            subscribed = true;

            return () => {
                socket.off("LoadingDoc", handler);
                subscribed = false;
            };
        }
    }, []);

    useEffect(() => {
        if (count >= steps.length) {
            setShowProccessing(false);
            setCurrentStep(0); // reset if 4 or above
        } else {
            setCurrentStep(count);
        }
    }, [count, steps.length]);

    // Update step based on `count` coming from socket
    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    return 0; // Reset when step changes
                }
                return prev + 2;
            });
        }, 40);

        return () => clearInterval(progressInterval);
    }, [currentStep]);

    const currentStepData = steps[currentStep];
    const IconComponent = currentStepData?.icon;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
            className="relative w-80 h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
        >
            {/* Animated Background Gradient */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${currentStepData?.color} opacity-10`}
                animate={{
                    background: [
                        `linear-gradient(45deg, ${currentStepData?.color})`,
                        `linear-gradient(135deg, ${currentStepData?.color})`,
                        `linear-gradient(225deg, ${currentStepData?.color})`,
                        `linear-gradient(315deg, ${currentStepData?.color})`,
                    ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                            left: `${10 + (i * 10)}%`,
                            top: `${20 + Math.sin(i) * 20}%`,
                        }}
                        animate={{
                            y: [-5, 5, -5],
                            x: [-2, 2, -2],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                {/* Icon and Text */}
                <div className="flex items-center space-x-3">
                    {/* Animated Icon */}
                    <motion.div
                        key={currentStep}
                        initial={{ rotateY: -90, scale: 0 }}
                        animate={{ rotateY: 0, scale: 1 }}
                        exit={{ rotateY: 90, scale: 0 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="relative"
                    >
                        <motion.div
                            className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm"
                            whileHover={{ scale: 1.1 }}
                            animate={{
                                boxShadow: [
                                    "0 0 0 0 rgba(255,255,255,0.3)",
                                    "0 0 0 8px rgba(255,255,255,0)",
                                    "0 0 0 0 rgba(255,255,255,0)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <IconComponent className="w-4 h-4 text-white" />
                            </motion.div>
                        </motion.div>

                        {/* Sparkle Effect */}
                        <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{
                                rotate: 360,
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="w-3 h-3 text-yellow-300 opacity-80" />
                        </motion.div>
                    </motion.div>

                    {/* Animated Text */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.h3
                                key={currentStep}
                                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                transition={{ duration: 0.4 }}
                                className="text-white font-semibold text-lg"
                            >
                                {currentStepData.text}
                            </motion.h3>
                        </AnimatePresence>

                        {/* Typing Animation Dots */}
                        <div className="flex space-x-1 mt-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 h-1 bg-white/60 rounded-full"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.4, 1, 0.4],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/70">
                        <span>Progress</span>
                        <motion.span
                            key={progress}
                            animate={{ scale: [1, 1.1, 1] }}
                            className="font-mono"
                        >
                            {progress}%
                        </motion.span>
                    </div>

                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                        {/* Background Shimmer */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: [-100, 300] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Progress Fill */}
                        <motion.div
                            className={`h-full bg-gradient-to-r ${currentStepData.color} rounded-full relative overflow-hidden`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {/* Progress Bar Glow */}
                            <motion.div
                                className="absolute inset-0 bg-white/30 rounded-full"
                                animate={{
                                    opacity: [0.3, 0.7, 0.3],
                                    scale: [1, 1.02, 1],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />

                            {/* Moving Highlight */}
                            <motion.div
                                className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ x: [-32, progress * 3.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Border Animation */}
            <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                    background: `linear-gradient(45deg, transparent, ${currentStepData.color.split(' ')[1]}, transparent)`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
        </motion.div>
    );
};

export default DataProcessingLoader;