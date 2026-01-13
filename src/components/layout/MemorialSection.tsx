"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Quote, Sparkles, Flower2 } from "lucide-react";

export const InMemoriam = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeInOut"
      } 
    },
  };

  const verses = [
    {
      text: "Yo soy la resurrección y la vida. El que cree en mí vivirá, aunque muera; y todo el que vive y cree en mí no morirá jamás.",
      ref: "Juan 11:25-26"
    },
    {
      text: "El Señor está cerca de los quebrantados de corazón; salva a los de espíritu abatido.",
      ref: "Salmo 34:18"
    },
    {
      text: "Bienaventurados los que lloran, porque ellos recibirán consolación.",
      ref: "Mateo 5:4"
    },
    {
      text: "No temas, porque yo estoy contigo; no te angusties, porque yo soy tu Dios. Te fortaleceré y te ayudaré.",
      ref: "Isaías 41:10"
    }
  ];

  const [current, setCurrent] = React.useState(0);

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? verses.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === verses.length - 1 ? 0 : prev + 1));

  return (
    <section className="relative py-24 md:py-32 bg-transparent overflow-hidden">
      {/* Fondo animado de partículas suaves */}
      <div className="pointer-events-none absolute inset-0 z-0 animate-pulse bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100 via-orange-200 to-orange-400 opacity-40 blur-sm" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-orange-600 blur-[1px] opacity-80" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Navegación de versículos */}
        <motion.div variants={itemVariants} className="mb-16 flex items-center justify-center gap-4">
          <button 
            onClick={handlePrev} 
            aria-label="Anterior" 
            className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 shadow-lg transition-colors duration-200"
          >
            &#8592;
          </button>
          <div className="flex-1">
            <div className="bg-gradient-to-br from-orange-50 via-white to-orange-100 border-2 border-orange-200 rounded-2xl shadow-2xl px-8 py-8 mx-auto max-w-2xl relative">
              <Flower2 size={32} className="absolute -top-6 left-1/2 -translate-x-1/2 text-orange-300 drop-shadow-lg" />
              <blockquote className="font-serif text-2xl md:text-4xl text-orange-900 italic leading-relaxed tracking-wide mb-4 animate-fade-in">
                “{verses[current].text}”
              </blockquote>
              <figcaption className="text-orange-600 font-semibold tracking-widest uppercase text-base mt-2 flex items-center justify-center gap-2">
                <Quote size={18} className="inline-block text-orange-400" />
                {verses[current].ref}
              </figcaption>
            </div>
          </div>
          <button 
            onClick={handleNext} 
            aria-label="Siguiente" 
            className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 shadow-lg transition-colors duration-200"
          >
            &#8594;
          </button>
        </motion.div>

        {/* Separador decorativo */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-16 opacity-60">
          <div className="h-1 w-16 bg-gradient-to-r from-transparent via-orange-200 to-orange-400 rounded-full blur-[1px]" />
          <Sparkles size={20} className="text-orange-300 animate-pulse" />
          <div className="h-1 w-16 bg-gradient-to-l from-transparent via-orange-200 to-orange-400 rounded-full blur-[1px]" />
        </motion.div>

        {/* Título destacado */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif text-orange-700 mb-8 flex items-center justify-center gap-3 animate-fade-in">
            <Flower2 size={28} className="text-orange-400" />
            Honrando la Vida y el Legado de María Floria Vences Romero
            <Flower2 size={28} className="text-orange-400" />
          </h2>
          <p className="text-orange-900 text-lg md:text-xl leading-loose font-light animate-fade-in">
            Recordamos a Flor, no solo por el vacío que dejó su 
            partida, sino por la calidez inmensa que llenó nuestros días. Fue una 
            madre amorosa, una amiga leal y una mujer de fe inquebrantable. Su sonrisa 
            era capaz de iluminar hasta los momentos más oscuros.
          </p>
          <p className="text-orange-900 text-lg md:text-xl leading-loose font-light animate-fade-in">
            Sus manos, siempre dispuestas a ayudar, y su corazón generoso,
            sembraron amor en cada persona que tuvo la dicha de conocerla. Su
            legado no es de tristeza, sino de una luz que sigue brillando en
            quienes la amamos. Hoy honramos su vida, sus enseñanzas y el amor
            eterno que nos regaló.
          </p>
        </motion.div>

        {/* Gradiente inferior animado */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-orange-400 to-transparent blur-[2px] opacity-80 animate-pulse" />
      </motion.div>
    </section>
  );
};