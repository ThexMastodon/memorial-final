"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import { toast } from "sonner";

type Candle = {
  id: number;
  visitor_name: string;
  message: string;
  created_at: string;
};

export const WallOfLight = () => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{ name: string; message: string }>({ name: "", message: "" });
  const [viewCandle, setViewCandle] = useState<Candle | null>(null);
  const [newCandleId, setNewCandleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCandles = async () => {
      const { data } = await supabase
        .from("candles")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setCandles(data as Candle[]);
    };

    fetchCandles();

    const channel = supabase
      .channel("realtime-candles")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "candles" },
        (payload) => {
          const newCandle = payload.new as Candle;
          setCandles((current) => {
            if (current.some((c) => c.id === newCandle.id)) {
              return current;
            }
            return [newCandle, ...current];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.message.trim() || !formData.name.trim()) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("candles")
      .insert([{ visitor_name: formData.name, message: formData.message }])
      .select()
      .single();

    if (error) {
      toast.error("Error al encender la vela.");
    } else if (data) {
      setCandles((prev) => {
        if (prev.some(c => c.id === data.id)) return prev;
        return [data as Candle, ...prev];
      });

      toast(
        <div className="flex items-center gap-4 px-2 py-1">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/80 to-amber-900/80 shadow-lg">
            <svg viewBox="0 0 20 30" className="w-7 h-7">
              <path d="M10 0 Q18 15 18 22 A 8 8 0 0 1 2 22 Q2 15 10 0" fill="#F59E0B" className="opacity-20 blur-[1px]" />
              <path d="M10 2 Q16 15 16 22 A 6 6 0 0 1 4 22 Q4 15 10 2" fill="url(#flameIconGrad)" />
              <path d="M10 12 Q12 21 12 24 A 2 2 0 0 1 8 24 Q8 21 10 12" fill="#FFF" className="opacity-80" />
              <defs>
                <linearGradient id="flameIconGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#FCD34D" />
                  <stop offset="80%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="text-amber-100 font-serif text-lg leading-tight">¡Luz encendida!</span>
            <span className="text-amber-300 text-xs mt-1">Gracias por compartir tu memoria.</span>
          </div>
        </div>,
        {
          style: {
            background: "#18120a",
            border: "1px solid #f59e0b55",
            color: "#fef3c7",
            boxShadow: "0 2px 24px 0 #f59e0b33",
            fontFamily: 'serif',
            minWidth: '260px',
            padding: '0.5rem 1.5rem',
          },
          position: "top-center",
          duration: 4000,
        }
      );

      setFormData({ name: "", message: "" });
      setNewCandleId(data.id);
      setIsFormOpen(false);
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-amber-50 font-sans selection:bg-amber-900/30 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-amber-900/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-amber-800/5 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 flex-1 flex flex-col px-6 md:px-12">
        <header className="flex flex-col items-center justify-center py-16 md:py-24 space-y-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full transform translate-y-2" />
            <div className="w-12 h-16">
              <CustomFlameIcon className="w-full h-full" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-light tracking-[0.2em] text-amber-100/90 uppercase text-center">
            Luz Eterna
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <p className="text-amber-100/40 font-light text-sm md:text-base max-w-md mx-auto text-center leading-relaxed tracking-wide">
            Un santuario de memorias. <br className="hidden md:block"/>
            Cada llama es un recuerdo que perdura.
          </p>
        </header>

        <div className="flex-1 w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-8 gap-y-16 pb-32 place-items-center items-end">
          <AnimatePresence mode="popLayout">
            {candles.map((candle) => (
              <StylizedFlame
                key={candle.id}
                data={candle}
                isNew={newCandleId === candle.id}
                onAnimationEnd={() => setNewCandleId(null)}
                onClick={() => setViewCandle(candle)}
              />
            ))}
          </AnimatePresence>
          
          {candles.length === 0 && (
            <div className="col-span-full text-center text-white/30 py-20 font-serif italic text-sm">
              El santuario está en silencio. Sé el primero en encender una luz.
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex justify-end items-end py-8 pr-8">
        <motion.button
          onClick={() => setIsFormOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center justify-center w-16 h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border border-amber-500/30 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] hover:border-amber-500/60 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/20 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-6 h-8 relative z-10 transform group-hover:scale-110 transition-transform duration-300">
            <CustomFlameIcon className="w-full h-full drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
          </div>
          <span className="absolute right-full mr-4 bg-amber-950/80 text-amber-100 text-xs px-3 py-1.5 rounded backdrop-blur-sm border border-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tracking-wider uppercase">
            Encender Luz
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
              onClick={() => setIsFormOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-amber-500/10 p-8 md:p-12 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 text-amber-100/20 hover:text-amber-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="relative z-10 text-center space-y-8">
                <div>
                  <h2 className="text-2xl font-serif text-amber-100 tracking-wide">Encender una Luz</h2>
                  <p className="text-amber-100/40 text-sm mt-2">Comparte un pensamiento o memoria.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-amber-500/40 ml-1">Tu Nombre</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-amber-500/20 py-3 text-amber-50 focus:border-amber-500/60 focus:outline-none transition-colors placeholder:text-amber-900/30"
                      placeholder="Anónimo"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-amber-500/40 ml-1">Mensaje</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-transparent border-b border-amber-500/20 py-3 text-amber-50 focus:border-amber-500/60 focus:outline-none transition-colors placeholder:text-amber-900/30 resize-none h-24"
                      placeholder="Escribe aquí..."
                      required
                    />
                  </div>

                  <div className="pt-6 flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative px-10 py-3 bg-amber-900/20 hover:bg-amber-900/40 text-amber-200 text-sm tracking-widest uppercase rounded-full transition-all border border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="opacity-50">Encendiendo...</span>
                      ) : (
                        <>
                          <span>Encender</span>
                          <div className="w-3 h-4">
                            <CustomFlameIcon className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewCandle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
              onClick={() => setViewCandle(null)}
            />
            <motion.div 
              layoutId={`candle-view-${viewCandle?.id}`}
              className="relative z-10 max-w-md w-full text-center space-y-8 px-8 py-12"
            >
              <div className="flex justify-center">
                <div className="relative w-16 h-24">
                  <div className="absolute inset-0 bg-amber-500/30 blur-[40px] rounded-full" />
                  <div className="w-full h-full animate-pulse">
                    <CustomFlameIcon className="w-full h-full drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
                  </div>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <p className="text-2xl md:text-3xl font-serif text-amber-50/90 leading-relaxed tracking-wide italic">
                  "{viewCandle?.message}"
                </p>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-px bg-amber-500/30" />
                    <p className="text-amber-500/70 uppercase tracking-[0.2em] text-xs font-medium">
                      {viewCandle?.visitor_name}
                    </p>
                    <p className="text-amber-900/40 text-[10px] font-mono">
                      {viewCandle && new Date(viewCandle.created_at).toLocaleDateString('es-MX', { dateStyle: 'long' })}
                    </p>
                </div>
              </motion.div>

              <button 
                onClick={() => setViewCandle(null)}
                className="absolute top-0 right-0 p-4 text-white/10 hover:text-white/50 transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

const CustomFlameIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 30" className={className}>
    <path d="M10 0 Q18 15 18 22 A 8 8 0 0 1 2 22 Q2 15 10 0" 
      fill="#F59E0B" className="opacity-20 blur-[1px]" />
    <path d="M10 2 Q16 15 16 22 A 6 6 0 0 1 4 22 Q4 15 10 2" 
      fill="url(#flameIconGrad)" />
    <path d="M10 12 Q12 21 12 24 A 2 2 0 0 1 8 24 Q8 21 10 12" 
      fill="#FFF" className="opacity-80" />
    <defs>
      <linearGradient id="flameIconGrad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="80%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);


type StylizedFlameProps = {
  data: Candle;
  isNew: boolean;
  onClick: () => void;
  onAnimationEnd?: () => void;
};

const StylizedFlame: React.FC<StylizedFlameProps> = ({ data, isNew, onClick, onAnimationEnd }) => {
  const randomDelay = React.useMemo(() => Math.random() * 2, []);
  const randomDuration = React.useMemo(() => 2 + Math.random() * 2, []);
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div
      layout
      layoutId={`candle-view-${data.id}`}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="group relative flex flex-col items-center justify-end cursor-pointer h-24 w-12"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onAnimationComplete={onAnimationEnd}
    >
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full pointer-events-none"
        animate={hovered
          ? { background: "rgba(251,191,36,0.25)", scale: 1.25, opacity: 1, filter: "blur(48px)" }
          : { background: "rgba(251,191,36,0.05)", scale: 1, opacity: 0.7, filter: "blur(32px)" }
        }
        transition={{ duration: 0.4 }}
      />
      {/* LA LLAMA Animada SVG */}
      <motion.div
        animate={{ 
          scaleY: [1, 1.15, 0.9, 1],
          filter: [
            "drop-shadow(0 0 2px rgba(251,191,36,0.3))",
            "drop-shadow(0 0 8px rgba(251,191,36,0.5))",
            "drop-shadow(0 0 2px rgba(251,191,36,0.3))"
          ]
        }}
        transition={{ 
          duration: randomDuration, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: randomDelay 
        }}
        className="relative z-10 w-4 h-8"
      >
        <CustomFlameIcon className="w-full h-full" />

        {isNew && (
          <motion.div
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 4, opacity: [0, 0.5, 0] }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-amber-100/30 blur-md rounded-full"
          />
        )}
      </motion.div>

      <div className="w-1.5 h-8 bg-gradient-to-b from-amber-100/10 to-transparent rounded-t-full mt-1 opacity-40 group-hover:opacity-60 transition-opacity" />

      <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none z-20">
        <p className="text-[10px] text-amber-100/70 uppercase tracking-widest whitespace-nowrap bg-[#0a0a0a] px-2 py-1 rounded border border-amber-900/30 shadow-lg">
          {data.visitor_name.split(' ')[0]}
        </p>
      </div>
    </motion.div>
  );
};