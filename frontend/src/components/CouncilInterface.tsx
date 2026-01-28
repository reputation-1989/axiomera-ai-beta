'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Brain, AlertCircle, CheckCircle, ArrowRight,
  Sparkles, Code, Scale, FlaskConical, Users, User, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Selector } from './Selector';

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

  // Settings State
  const [mode, setMode] = useState("council");
  const [model, setModel] = useState("gpt4");
  const [domain, setDomain] = useState("general");

  const handleSubmit = async () => {
    if (!prompt.trim() || isRunning) return;
    setIsRunning(true);
    setSteps([]);

    try {
      const response = await fetch('/api/v1/council/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        buffer += chunk;
        const lines = buffer.split('\n');

        // Process all complete lines
        for (let i = 0; i < lines.length - 1; i++) {
           const line = lines[i].trim();
           if (line) {
             try {
                const step = JSON.parse(line);
                setSteps(prev => [...prev, step]);
             } catch(e) {
                console.error("JSON Parse Error", e);
             }
           }
        }
        // Keep the last partial line in buffer
        buffer = lines[lines.length - 1];
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [steps]);

  return (
    <div className="flex flex-col h-screen w-full bg-background/50 backdrop-blur-sm">

      {/* Top Configuration Bar */}
      <header className="px-8 py-4 border-b border-border/40 flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-10">
         <div className="flex items-center gap-6">
            <Selector
              value={mode}
              onChange={setMode}
              options={[
                { label: "Council Mode", value: "council", icon: Users },
                { label: "Single Agent", value: "single", icon: User },
              ]}
            />
             <Selector
              value={domain}
              onChange={setDomain}
              options={[
                { label: "General", value: "general", icon: Sparkles },
                { label: "Coding", value: "code", icon: Code },
                { label: "Academic", value: "academic", icon: FlaskConical },
              ]}
            />
         </div>

         <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium mr-2">Model:</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-secondary/50 border border-border/50 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="gpt4">GPT-4 Turbo</option>
              <option value="claude3">Claude 3 Opus</option>
              <option value="mistral">Mistral Large</option>
              <option value="llama3">Llama 3 70B</option>
            </select>
         </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative flex flex-col max-w-5xl mx-auto w-full">

        {/* Output Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 pb-32"
        >
          {steps.length === 0 && !isRunning ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
              <Brain className="w-24 h-24 mb-6 stroke-1" />
              <p className="text-lg font-medium">Awaiting complex inquiry...</p>
              <p className="text-sm">Select your council and begin.</p>
            </div>
          ) : (
            <div className="space-y-8">
               {/* User Prompt Bubble */}
               {isRunning && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                 >
                    <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg">
                      {prompt}
                    </div>
                 </motion.div>
               )}

              <AnimatePresence mode='popLayout'>
                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="group relative"
                  >
                     {/* Connector Line */}
                     {idx < steps.length - 1 && (
                        <div className="absolute left-6 top-10 bottom-[-2rem] w-0.5 bg-border/40 -z-10 group-hover:bg-primary/20 transition-colors" />
                     )}

                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md border border-border/50 bg-card",
                        step.step_type === 'generation' && "text-blue-500",
                        step.step_type === 'critique' && "text-amber-500",
                        step.step_type === 'refinement' && "text-purple-500",
                        step.step_type === 'convergence' && "text-emerald-500",
                      )}>
                        {step.step_type === 'generation' && <Brain className="w-6 h-6" />}
                        {step.step_type === 'critique' && <Scale className="w-6 h-6" />}
                        {step.step_type === 'refinement' && <FlaskConical className="w-6 h-6" />}
                        {step.step_type === 'convergence' && <CheckCircle className="w-6 h-6" />}
                      </div>

                      <div className="flex-1 bg-card border border-border/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                           <span className={cn(
                             "text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full",
                             step.step_type === 'generation' && "bg-blue-500/10 text-blue-500",
                             step.step_type === 'critique' && "bg-amber-500/10 text-amber-500",
                             step.step_type === 'refinement' && "bg-purple-500/10 text-purple-500",
                             step.step_type === 'convergence' && "bg-emerald-500/10 text-emerald-500",
                           )}>
                             {step.step_type}
                           </span>
                           <h3 className="text-sm font-semibold text-foreground/90">{step.description}</h3>
                        </div>

                        {step.details && (
                          <div className="bg-secondary/30 p-4 rounded-lg text-sm text-muted-foreground font-mono leading-relaxed overflow-x-auto border border-border/30">
                            {/* Pretty print specific keys if needed, or raw JSON for now */}
                             {Object.entries(step.details).map(([key, val]) => (
                               <div key={key} className="mb-1 last:mb-0">
                                  <span className="text-primary/70 font-semibold">{key}:</span>
                                  <span className="ml-2">
                                    {typeof val === 'string' ? val : JSON.stringify(val)}
                                  </span>
                               </div>
                             ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isRunning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-muted-foreground pl-16 pt-2"
                >
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-medium animate-pulse">The Council is deliberating...</span>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input Area (Floating at bottom) */}
        <div className="absolute bottom-8 left-0 right-0 px-8 z-20">
           <div className="relative bg-card border border-primary/20 rounded-2xl shadow-2xl p-2 flex items-end gap-2 ring-1 ring-border/50 focus-within:ring-primary/50 transition-all">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask the Council to solve a complex problem..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 p-4 resize-none outline-none min-h-[60px] max-h-[200px] text-lg"
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
                className="mb-1 mr-1 p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
           </div>
           <p className="text-center text-[10px] text-muted-foreground/40 mt-3">
              AxiomeraAI produces verified, multi-model outputs. Latency may be higher than standard models.
           </p>
        </div>

      </div>
    </div>
  );
}
