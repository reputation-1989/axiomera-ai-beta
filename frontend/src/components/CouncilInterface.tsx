'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, AlertCircle, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

type StepType = "generation" | "critique" | "refinement" | "convergence";

interface CouncilStep {
  step_type: StepType;
  description: string;
  details: Record<string, any>;
}

export default function CouncilInterface() {
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<CouncilStep[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!prompt.trim() || isRunning) return;
    setIsRunning(true);
    setSteps([]);

    try {
      const response = await fetch('http://localhost:8000/api/v1/council/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim()) {
            try {
              const step = JSON.parse(line);
              setSteps(prev => [...prev, step]);
            } catch (e) {
              console.error("Error parsing JSON", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps]);

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto p-6 font-sans">
      <header className="mb-12 text-center pt-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ShieldCheck className="w-10 h-10 text-white" />
          <h1 className="text-4xl font-bold tracking-tighter text-white">AxiomeraAI</h1>
        </div>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Verification-first reasoning engine. The Council analyzes, critiques, and converges on truth.
        </p>
      </header>

      <div className="flex-1 flex flex-col gap-8 min-h-0">

        {/* Output / Visualization Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-[#121212] rounded-xl border border-zinc-800 p-6 shadow-2xl relative"
        >
          {steps.length === 0 && !isRunning ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600">
              <Brain className="w-16 h-16 mb-4 opacity-20" />
              <p>Awaiting inquiry...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-l-2 border-zinc-700 pl-6 py-2"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {step.step_type === 'generation' && <Brain className="w-5 h-5 text-blue-400" />}
                      {step.step_type === 'critique' && <AlertCircle className="w-5 h-5 text-amber-400" />}
                      {step.step_type === 'refinement' && <ArrowRight className="w-5 h-5 text-purple-400" />}
                      {step.step_type === 'convergence' && <CheckCircle className="w-5 h-5 text-emerald-400" />}

                      <span className="text-sm uppercase tracking-widest text-zinc-500 text-xs font-semibold">
                        {step.step_type}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-zinc-200 mb-2">{step.description}</h3>

                    {step.details && (
                      <div className="bg-zinc-900/50 p-4 rounded-md text-sm text-zinc-400 font-mono">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(step.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isRunning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-zinc-500 pl-6"
                >
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse delay-75">●</span>
                  <span className="animate-pulse delay-150">●</span>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-[#121212] border border-zinc-800 rounded-xl p-2 flex items-end gap-2 shadow-lg">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the Council..."
            className="w-full bg-transparent text-white p-4 resize-none outline-none min-h-[60px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isRunning}
            className="p-4 bg-white text-black rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
