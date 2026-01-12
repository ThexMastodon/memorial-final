"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";

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
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Fondos decorativos corregidos */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-100 via-white to-white opacity-50" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >

        <motion.div variants={itemVariants} className="mb-16 flex items-center justify-center gap-4">
          <button 
            onClick={handlePrev} 
            aria-label="Anterior" 
            className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 shadow-lg transition-colors duration-200"
          >
            &#8592;
          </button>
          
          <div className="flex-1">
            <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 border border-orange-100 rounded-xl shadow-xl px-8 py-6 mx-auto max-w-2xl">
              <blockquote className="font-serif text-xl md:text-3xl text-orange-900 italic leading-relaxed tracking-wide mb-4">
                “{verses[current].text}”
              </blockquote>
              <figcaption className="text-orange-600 font-semibold tracking-widest uppercase text-sm mt-2 flex items-center justify-center gap-2">
                <Quote size={16} className="inline-block text-orange-400" />
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

        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-16 opacity-50">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-neutral-400" />
          <Sparkles size={16} className="text-orange-300" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-neutral-400" />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif text-black/80 mb-8">
            Honrando la Vida y el Legado de María Floria Vences Romero
          </h2>
          
          <p className="text-neutral-700 text-lg md:text-xl leading-loose font-light">
            Recordamos a Flor, no solo por el vacío que dejó su 
            partida, sino por la calidez inmensa que llenó nuestros días. Fue una 
            madre amorosa, una amiga leal y una mujer de fe inquebrantable. Su sonrisa 
            era capaz de iluminar hasta los momentos más oscuros.
          </p>

          <p className="text-neutral-700 text-lg md:text-xl leading-loose font-light">
            Sus manos, siempre dispuestas a ayudar, y su corazón generoso,
            sembraron amor en cada persona que tuvo la dicha de conocerla. Su
            legado no es de tristeza, sino de una luz que sigue brillando en
            quienes la amamos. Hoy honramos su vida, sus enseñanzas y el amor
            eterno que nos regaló.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </motion.div>
    </section>
  );
};