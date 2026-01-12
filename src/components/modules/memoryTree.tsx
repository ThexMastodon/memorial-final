"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Upload, Plus, X, Image as ImageIcon, Loader2, Sprout } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SVGTransformProps {
  transform: string;
  color?: string;
  opacity?: number;
}

const RealisticLeaf = ({ transform, color = "#5D8C7B", opacity = 1 }: SVGTransformProps) => (
  <g transform={transform} opacity={opacity}>
    <path d="M0,0 Q5,-8 15,0 Q5,8 0,0" fill={color} />
    <path d="M0,0 Q5,0 12,0" stroke="white" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
  </g>
);

const RealisticFlower = ({ transform, color = "#E07A5F" }: SVGTransformProps) => (
  <g transform={transform}>
    <path d="M0,0 C-2,-3 -4,-2 -3,0 C-4,2 -2,3 0,0" fill={color} />
    <g transform="rotate(72)">
      <path d="M0,0 C2,-3 4,-2 3,0 C4,2 2,3 0,0" fill={color} />
    </g>
    <g transform="rotate(144)">
      <path d="M0,0 C2,-3 4,-2 3,0 C4,2 2,3 0,0" fill={color} />
    </g>
    <g transform="rotate(216)">
      <path d="M0,0 C2,-3 4,-2 3,0 C4,2 2,3 0,0" fill={color} />
    </g>
    <g transform="rotate(288)">
      <path d="M0,0 C2,-3 4,-2 3,0 C4,2 2,3 0,0" fill={color} />
    </g>
    <circle cx="0" cy="0" r="1.5" fill="#FFE5D9" />
  </g>
);

const Tendril = ({ transform }: { transform: string }) => (
  <path 
    d="M0,0 Q5,-5 2,-8 T5,-12" 
    stroke="#5D8C7B" 
    strokeWidth="1" 
    fill="none" 
    transform={transform} 
    opacity="0.6"
  />
);

interface CurvedBranchProps {
  isRight: boolean;
  isMobile: boolean;
}

const CurvedBranch = ({ isRight, isMobile }: CurvedBranchProps) => {
  const width = isMobile ? 60 : 130;
  const height = 80;
  const pathRight = `M0,${height} C20,${height} 50,${height-30} ${width},10`;
  const pathLeft = `M${width},${height} C${width-20},${height} ${width-50},${height-30} 0,10`;
  const pathMobile = `M0,${height} C15,${height} 30,${height-15} ${width},10`;
  const path = isMobile ? pathMobile : (isRight ? pathRight : pathLeft);
  const elements = isRight || isMobile ? [
    { type: 'leaf', x: width * 0.3, y: height * 0.85, rot: -10 },
    { type: 'leaf', x: width * 0.5, y: height * 0.65, rot: 15 },
    { type: 'tendril', x: width * 0.45, y: height * 0.7, rot: -40 },
    { type: 'flower', x: width * 0.75, y: height * 0.3, rot: 0 },
    { type: 'leaf', x: width * 0.85, y: height * 0.2, rot: -20 }
  ] : [ 
    { type: 'leaf', x: width * 0.7, y: height * 0.85, rot: 10 },
    { type: 'leaf', x: width * 0.5, y: height * 0.65, rot: -15 },
    { type: 'tendril', x: width * 0.55, y: height * 0.7, rot: 40 },
    { type: 'flower', x: width * 0.25, y: height * 0.3, rot: 0 },
    { type: 'leaf', x: width * 0.15, y: height * 0.2, rot: 20 }
  ];
  return (
    <svg 
      className={`absolute pointer-events-none z-0 overflow-visible
        ${isMobile 
          ? 'left-[1px] top-6 w-[60px] h-[80px]' 
          : `top-1/2 w-[130px] h-[80px] ${isRight ? 'left-1/2 -ml-[1px]' : 'right-1/2 -mr-[1px]'}`
        }
      `}
      style={{ marginTop: isMobile ? '0' : '-35px' }}
    >
      <motion.path
        d={path}
        fill="none"
        stroke="#8C705F"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.line 
        x1={isRight || isMobile ? width : 0} 
        y1="10" 
        x2={isRight || isMobile ? width : 0} 
        y2="35"
        stroke="#8C705F"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {elements.map((el, i) => {
          const transform = `translate(${el.x}, ${el.y}) rotate(${el.rot})`;
          if (el.type === 'leaf') return <RealisticLeaf key={i} transform={transform} />;
          if (el.type === 'flower') return <RealisticFlower key={i} transform={transform} />;
          if (el.type === 'tendril') return <Tendril key={i} transform={transform} />;
          return null;
        })}
      </motion.g>
      <circle cx={isMobile || isRight ? 0 : width} cy={height} r="3" fill="#8C705F" />
    </svg>
  );
};


interface Memory {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
}

export const MemoryTree = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMemories = async () => {
      const { data } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });
      if (data) setMemories(data);
    };
    fetchMemories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
      .from("memory-images")
      .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
      .from("memory-images")
      .getPublicUrl(fileName);

      const { data: newMemory, error: dbError } = await supabase
      .from("memories")
      .insert([{ title, image_url: publicUrl }])
      .select()
      .single();

      if(dbError) throw dbError;

      setMemories([newMemory, ...memories]);
      toast.custom((t) => (
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl shadow-xl border border-orange-400/40 bg-[#1e293b]"
          style={{ minWidth: '0', maxWidth: '340px', boxShadow: '0 2px 16px #f59e4280' }}
        >
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <Sprout size={32} className="text-green-400" />
          </div>
          <div className="flex-1 flex flex-col items-start justify-center">
            <div className="font-serif text-orange-200 text-base mb-1">¡Recuerdo compartido!</div>
            <div className="text-xs text-white/70">Gracias por compartir tu recuerdo.</div>
          </div>
        </div>
      ));

      setTitle("");
      setFile(null);
      setPreview(null);
      setShowUploadForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al subir tu recuerdo. Intenta de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFBF7] font-sans text-stone-800 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-60 pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")` 
        }}>
      </div>

      <div className="w-full mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-stone-200/60 pb-8">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="p-2.5 bg-emerald-50 rounded-full border border-emerald-100">
                <Sprout className="w-6 h-6 text-emerald-800" />
              </div>
              <h1 className="text-4xl font-serif text-emerald-950 tracking-wide">Árbol de Vida</h1>
            </div>
            <p className="text-stone-500 font-serif italic pl-1 text-lg">"Floreciendo recuerdos en el tiempo"</p>
          </div>
          <Button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-900 text-emerald-50 text-sm font-medium rounded-full shadow-lg shadow-emerald-900/10 hover:bg-emerald-800 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Plantar Recuerdo</span>
          </Button>
        </header>

        <AnimatePresence>
          {showUploadForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/20 backdrop-blur-md"
                onClick={() => setShowUploadForm(false)}
              />
              <motion.form
                initial={{ opacity: 0, scale: 0.8, y: 50, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onSubmit={handleUpload}
                className="relative bg-white w-full max-w-sm shadow-2xl rounded-3xl overflow-hidden z-10 border border-white/50"
              >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-50 to-[#FDFBF7] z-0" />
                <div className="relative z-10 p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-serif text-2xl text-emerald-950 mb-1">Nueva Semilla</h3>
                      <p className="text-xs text-emerald-700/60 font-medium uppercase tracking-wider">Cultivando momentos</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowUploadForm(false)} 
                      className="bg-white/50 p-2 rounded-full hover:bg-white text-stone-400 hover:text-stone-600 transition-all shadow-sm"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="group">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden bg-stone-50/50
                          ${preview ? 'border-emerald-200 shadow-inner' : 'border-stone-200 hover:border-emerald-300 hover:bg-white hover:shadow-lg hover:shadow-emerald-50'}
                        `}
                      >
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        {preview ? (
                          <Image src={preview} alt="Preview" fill className="object-cover" />
                        ) : (
                          <div className="text-center space-y-3 p-4">
                            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto border border-stone-100 group-hover:scale-110 transition-transform duration-300">
                                <ImageIcon className="w-6 h-6 text-emerald-600/70" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-sm font-medium text-stone-600 block group-hover:text-emerald-700 transition-colors">Toca para subir foto</span>
                              <span className="text-[10px] text-stone-400 block uppercase tracking-wide">Formatos JPG, PNG</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Título del recuerdo</label>
                      <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Escribe un nombre..."
                        className="w-full bg-stone-50 border-b-2 border-stone-100 rounded-t-lg px-4 py-3 text-stone-800 placeholder:text-stone-300 focus:border-emerald-500 focus:bg-white outline-none transition-all font-serif"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isUploading || !file || !title}
                      className="w-full py-4 bg-emerald-900 text-emerald-50 rounded-2xl font-medium tracking-wide hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all shadow-xl shadow-emerald-900/10"
                    >
                      {isUploading ? <Loader2 className="animate-spin mr-2" />: <Upload className="mr-2 size-4" />}
                      {isUploading ? "Subiendo..." : "Plantar"}
                    </Button>
                  </div>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        <div className="relative min-h-[500px] px-2 md:px-0 pb-32">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] md:-ml-[1px] z-0">
            <div className="w-full h-full bg-stone-200 rounded-full" />
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute top-0 left-0 w-full bg-[#5D8C7B] rounded-full"
              />
          </div>
          <div className="relative space-y-20 py-12">
            {memories.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-24 ml-12 md:ml-0"
              >
                <div className="inline-block p-8 rounded-full bg-stone-50 mb-6 border border-stone-100">
                  <Sprout className="w-12 h-12 text-stone-300" strokeWidth={1.5} />
                </div>
                <p className="text-stone-400 font-serif text-xl italic">El jardín espera florecer...</p>
              </motion.div>
            )}
            {memories.map((memory, index) => (
              <MemoryBranch
                key={memory.id}
                data={memory}
                index={index}
                onClick={() => setSelectedMemory(memory)}
              />
            ))}
            {selectedMemory && (
              <PolaroidModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoryBranch = ({ data, index, onClick }: { data: Memory; index: number; onClick: () => void }) => {
  const isEven = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "relative flex items-center w-full",
        "md:justify-center",
      )}
    >
      <div className="md:hidden">
        <CurvedBranch isRight={true} isMobile={true} />
      </div>
      <div className="hidden md:block">
        <CurvedBranch isRight={isEven} isMobile={false} />
      </div>
      <div className={cn(
        "w-full md:w-5/12 pl-12 md:pl-0 flex",
        isEven ? "md:justify-end md:mr-auto md:pr-12" : "md:justify-start md:ml-auto md:pl-12"
      )}>
        <div className="group relative">
          {/* Polaroid Style */}
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl border border-stone-200 pt-6 px-6 flex flex-col items-center cursor-pointer" style={{ paddingBottom: 0 }} onClick={onClick} tabIndex={0} role="button" aria-label="Ver polaroid grande">
            <div className="w-full bg-stone-100 rounded-md overflow-hidden mb-3 flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
              <Image 
                src={data.image_url}
                alt={data.title}
                width={480}
                height={360}
                className="object-cover w-full h-full"
                style={{ borderRadius: '8px' }}
                sizes="(max-width: 640px) 100vw, 480px"
                priority={index < 2}
              />
            </div>
            {/* Pie de polaroid */}
            <div className="w-full text-center bg-white border-t border-stone-200 pt-4 pb-6 rounded-b-lg">
              <h4 className="font-serif text-lg text-stone-800 mb-1 truncate">{data.title}</h4>
              <p className="text-sm text-stone-400 uppercase tracking-widest">{new Date(data.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PolaroidModal = ({ memory, onClose }: { memory: Memory, onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
    <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200 p-8 max-w-2xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
      <div className="w-full bg-stone-100 rounded-md overflow-hidden mb-4 flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
        <Image 
          src={memory.image_url}
          alt={memory.title}
          width={800}
          height={600}
          className="object-cover w-full h-full"
          style={{ borderRadius: '12px' }}
        />
      </div>
      <div className="w-full text-center bg-white border-t border-stone-200 pt-6 pb-6 rounded-b-lg">
        <h4 className="font-serif text-2xl text-stone-800 mb-2 break-words">{memory.title}</h4>
        <p className="text-base text-stone-400 uppercase tracking-widest">{new Date(memory.created_at).toLocaleDateString()}</p>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-2xl font-bold">×</button>
    </div>
  </div>
);