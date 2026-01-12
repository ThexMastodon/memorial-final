"use client";

import React, { useEffect, useState, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Send, Sparkles, Moon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface Wish {
  id: number;
  wish_text: string;
  created_at: string;
  randomX?: number;
  randomDuration?: number;
  randomDelay?: number;
  styleIndex?: number;
}

const LanternClassic = () => (
  <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
    <svg width="60" height="80" viewBox="0 0 70 90" className="overflow-visible drop-shadow-[0_0_15px_rgba(251,146,60,0.4)]">
      <defs>
        <radialGradient id="grad-classic" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="70%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
      </defs>
      <rect x="10" y="0" width="50" height="85" rx="20" fill="url(#grad-classic)" />
      <path d="M25 0 V85 M45 0 V85" stroke="#7c2d12" strokeOpacity="0.2" strokeWidth="1" />
      <path d="M10 28 H60 M10 56 H60" stroke="#7c2d12" strokeOpacity="0.1" strokeWidth="1" fill="none" />
      <ellipse cx="35" cy="85" rx="15" ry="3" fill="#431407" />
    </svg>
  </motion.div>
);

const LanternSoft = () => (
  <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
    <div className="relative">
      <div className="absolute inset-0 bg-orange-500/40 blur-2xl rounded-full" />
      <svg width="60" height="80" viewBox="0 0 60 80" className="relative z-10">
        <defs>
          <linearGradient id="grad-soft" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#fff7ed" />
          </linearGradient>
        </defs>
        <path 
          d="M10 80 C10 80 0 50 0 30 C0 10 15 0 30 0 C45 0 60 10 60 30 C60 50 50 80 50 80 H10 Z" 
          fill="url(#grad-soft)" 
        />
      </svg>
    </div>
  </motion.div>
);

const LanternGeometric = () => (
  <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
    <svg width="60" height="80" viewBox="0 0 80 100" className="drop-shadow-lg">
      <path d="M40 0 L75 25 L65 85 L15 85 L5 25 Z" fill="#f97316" />
      <path d="M40 0 L75 25 L40 40 Z" fill="#fdba74" opacity="0.5" />
      <path d="M40 0 L5 25 L40 40 Z" fill="#ea580c" opacity="0.3" />
      <path d="M5 25 L15 85 L40 40 Z" fill="#c2410c" opacity="0.4" />
      <path d="M75 25 L65 85 L40 40 Z" fill="#fb923c" opacity="0.2" />
      <path d="M15 85 L65 85 L40 40 Z" fill="#ffedd5" opacity="0.6" />
      <rect x="25" y="85" width="30" height="3" fill="#292524" />
    </svg>
  </motion.div>
);

const LanternCylindrical = () => (
  <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
    <svg width="50" height="90" viewBox="0 0 50 100" className="drop-shadow-[0_0_20px_rgba(251,146,60,0.5)]">
      <defs>
        <linearGradient id="grad-cyl" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="20%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#ffedd5" />
          <stop offset="80%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="50" height="95" rx="10" fill="url(#grad-cyl)" />
      <ellipse cx="25" cy="95" rx="25" ry="5" fill="#7c2d12" />
      <ellipse cx="25" cy="95" rx="20" ry="3" fill="none" stroke="#fb923c" strokeWidth="2" />
    </svg>
  </motion.div>
);

const LanternRound = () => (
  <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
    <svg width="70" height="70" viewBox="0 0 70 70" className="drop-shadow-[0_0_25px_rgba(251,146,60,0.6)]">
      <defs>
        <radialGradient id="grad-round" cx="0.5" cy="0.5" r="0.5">
          <stop offset="40%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
      </defs>
      <circle cx="35" cy="35" r="34" fill="url(#grad-round)" />
      <path d="M35 69 V 75" stroke="#7c2d12" strokeWidth="2" />
      <rect x="30" y="68" width="10" height="2" fill="#431407" />
    </svg>
  </motion.div>
);

const LanternPatterned = () => (
  <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
    <svg width="60" height="80" viewBox="0 0 70 90" className="drop-shadow-[0_0_15px_rgba(251,146,60,0.3)]">
      <defs>
        <linearGradient id="grad-pattern" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <rect x="10" y="0" width="50" height="85" rx="5" fill="url(#grad-pattern)" />
      <circle cx="35" cy="20" r="4" fill="#ffedd5" className="animate-pulse" />
      <circle cx="35" cy="42" r="6" fill="#ffedd5" className="animate-pulse" />
      <circle cx="35" cy="65" r="4" fill="#ffedd5" className="animate-pulse" />
      <path d="M20 30 L25 42 L20 54" fill="none" stroke="#ffedd5" strokeWidth="2" opacity="0.6" />
      <path d="M50 30 L45 42 L50 54" fill="none" stroke="#ffedd5" strokeWidth="2" opacity="0.6" />
      <rect x="25" y="85" width="20" height="3" fill="#431407" />
    </svg>
  </motion.div>
);

// Galería de estilos de globos para el modal visual
const lanternGalleryData: {
  title: string;
  desc: string;
  icon: ReactElement;
}[] = [
  {
    title: "1. Clásico",
    desc: "Forma tradicional con varillas de bambú visibles y luz cálida.",
    icon: <LanternClassic />,
  },
  {
    title: "2. Luz Eterna",
    desc: "Minimalista, sin bordes. Un gradiente puro de luz difusa.",
    icon: <LanternSoft />,
  },
  {
    title: "3. Geométrico",
    desc: "Estilo 'Low Poly' con facetas angulares modernas.",
    icon: <LanternGeometric />,
  },
  {
    title: "4. Cilíndrico",
    desc: "Forma alargada tipo 'Khom Loi', majestuosa y estable.",
    icon: <LanternCylindrical />,
  },
  {
    title: "5. Esférico",
    desc: "Como una pequeña luna llena flotando en el cielo.",
    icon: <LanternRound />,
  },
  {
    title: "6. Papel Picado",
    desc: "Con patrones sutiles que dejan escapar rayos de luz.",
    icon: <LanternPatterned />,
  },
];

const SkyOfWishes = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [open, setOpen] = useState(false);

  const augmentWishData = (wish: Wish): Wish => ({
    ...wish,
    randomX: Math.floor(Math.random() * 90) + 5,
    randomDuration: Math.floor(Math.random() * 20) + 25,
    randomDelay: Math.random() * 5,
    styleIndex: wish.styleIndex !== undefined ? wish.styleIndex : Math.floor(Math.random() * 6),
  });

  useEffect(() => {
    const fetchWishes = async () => {
      const { data } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) {
        const visualData = data.map(augmentWishData);
        setWishes(visualData);
      }
    };

    fetchWishes();

    const channel = supabase
      .channel("realtime_wishes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes" },
        (payload) => {
          const newWish = augmentWishData(payload.new as Wish);
          setWishes((current) => {
            if(current.some(w => w.id === newWish.id)) return current;

            const updated = [newWish, ...current];
            return updated.slice(0, 25);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newMessage.trim()) return;

    setIsSending(true);

    const { data, error } = await supabase
      .from ("wishes")
      .insert([{ wish_text: newMessage.trim(), styleIndex: selectedStyle }])
      .select()
      .single();

    if (error) {
      toast.error("No se pudo enviar tu deseo al cielo.", {
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #f59e42',
        },
        icon: <span className="ml-2"><Sparkles className="text-orange-300" size={22} /></span>,
      });
    } else if (data) {
      const visualWish = augmentWishData({ ...(data as Wish), styleIndex: selectedStyle });

      visualWish.randomDuration = 20;
      setWishes((prev) => [visualWish, ...prev]);
      setNewMessage("");
      toast.custom((t) => (
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full shadow-xl border border-orange-400/40 bg-[#1e293b]"
          style={{ minWidth: '0', maxWidth: '340px', boxShadow: '0 2px 16px #f59e4280' }}
        >
          <div className="flex-shrink-0 w-10 h-12 flex items-center justify-center">
            {lanternGalleryData[selectedStyle]?.icon}
          </div>
          <div className="flex-1 flex flex-col items-start justify-center">
            <div className="font-serif text-orange-200 text-base mb-1">¡Deseo enviado!</div>
            <div className="text-xs text-white/70">Tu deseo viaja hacia las estrellas.</div>
          </div>
        </div>
      ));
      setOpen(false);
    }
    setIsSending(false);
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center justify-end overflow-hidden">

      <div className="absolute top-10 right-10 md:right-20 opacity-80">
        <div className="relative">
          <Moon size={100} className="text-yellow-100 fill-yellow-100" />
          <div className="absolute inset-0 bg-yellow-100/30 blur-2xl rounded-full" />
        </div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Star key={i} />
        ))}
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <AnimatePresence>
          {wishes.map((wish) => (
            <Lantern key={wish.id} data={wish} />
          ))}
        </AnimatePresence>
      </div>  

      <div className="relative z-30 w-full max-w-lg px-6 pb-40 md:pb-32 flex flex-col items-center">
        <Button
          className="rounded-full border border-orange-400 bg-transparent hover:bg-orange-50/10 text-orange-300 px-6 py-2 font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-300/40 focus:ring-offset-2 shadow-none text-base"
          onClick={() => setOpen(true)}
        >
          <Sparkles size={16} className="text-orange-300" />
          Enviar un deseo al cielo
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl bg-[#0f172a] border border-orange-400/10">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-serif text-orange-200 mb-2">Elige tu globo y escribe tu deseo</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              {lanternGalleryData.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all shadow-xl focus:outline-none ${selectedStyle === idx ? 'border-orange-400 bg-orange-400/10' : 'border-white/10 bg-white/5 hover:border-orange-300/40'}`}
                  onClick={() => setSelectedStyle(idx)}
                  aria-label={item.title}
                >
                  <div className="h-20 flex items-center justify-center">{item.icon}</div>
                  <div className="text-center">
                    <div className="font-serif text-base text-orange-100 mb-1">{item.title}</div>
                    <div className="text-xs text-white/40">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-center">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Envia un deseo al cielo..."
                className="border-0 bg-white/10 text-white placeholder:text-white-40 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 w-full"
                maxLength={100}
              />
              <div className="flex gap-2 w-full justify-center">
                <Button
                  type="submit"
                  disabled={isSending || !newMessage}
                  className="rounded-full border border-indigo-400 bg-transparent hover:bg-indigo-50/10 text-indigo-300 px-6 py-2 font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300/40 focus:ring-offset-2 shadow-none text-base flex items-center gap-2"
                >
                  <Send size={16} className="text-indigo-300" /> Enviar deseo
                </Button>
              </div>
            </form>
            <p className="text-center text-white/20 text-xs mt-2 font-serif tracking-wide">
              Los deseos vuelan alto y brillan por siempre.
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SkyOfWishes;

const Lantern = ({ data }: { data: Wish}) => {
  const lanternSvgs = [
    <LanternClassic key="classic" />, <LanternSoft key="soft" />, <LanternGeometric key="geo" />,
    <LanternCylindrical key="cyl" />, <LanternRound key="round" />, <LanternPatterned key="patterned" />
  ];
  const styleIdx = data.styleIndex ?? 0;
  return (
    <motion.div
      initial={{ y: "110vh", opacity: 0, x: `${data.randomX}%` }}
      animate={{
        y: ["110vh", "0vh", "-100vh"],
        opacity: [0, 1, 1, 1, 0],
        x: [`${data.randomX}%`, `${(data.randomX || 50) + 5}%`, `${(data.randomX || 50) - 5}%`]
      }}
      transition={{
        y: { duration: data.randomDuration, ease: "linear", delay: data.randomDelay, repeat: Infinity, repeatType: "loop" },
        opacity: { duration: data.randomDuration, times: [0, 0.1, 0.8, 0.99, 1], repeat: Infinity, repeatType: "loop" },
        x: { duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut"}
      }}
      className="absolute bottom-0 pointer-events-auto group"
      style={{ left: `${data.randomX}%` }}
    >
      <div className="relative flex flex-col items-center">
        {lanternSvgs[styleIdx]}
        <div className="w-2 h-2 bg-yellow-100 blur-[2px] mt-[-4px]" />
        <div className="absolute top-full mt-2 w-48 flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center">
            <p className="text-white text-xs font-serif  italic leading-relaxed uppercase">
              "{data.wish_text}"
            </p>
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent my-2" />
          </div>
          <div className="w-px h-4 bg-white/20 absolute -top-4" />
        </div>
      </div>
    </motion.div>
  )
}

const Star = () => {
  const [style, setStyle] = useState({ top: "0%", left: "0%", scale: 1 });

  useEffect(() => {
    setStyle({
      top: `${Math.random() * 60}%`,
      left: `${Math.random() * 100}%`,
      scale: Math.random() * 0.5 + 0.5
    });
  }, []);

  return (
    <motion.div
      className="absolute bg-white rounded-full w-1 h-1 shadow-[0_0_5px_white]"
      style={{ ...style }}
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}