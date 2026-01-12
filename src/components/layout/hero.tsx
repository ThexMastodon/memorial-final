"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const Hero = () => {
  const yearPassed = useMemo(() => {
    const deathDate = new Date("2022-01-15T00:00:00");
    const today = new Date();

    let years = today.getFullYear() - deathDate.getFullYear();

    const hasAnniversaryPassedThisYear =
      today.getMonth() > deathDate.getMonth() ||
      (today.getMonth() === deathDate.getMonth() && today.getDate() >= deathDate.getDate());

    if (!hasAnniversaryPassedThisYear) {
      years -= 1;
    }
    return years;
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.jpg"
          alt="Memorial Background"
          fill
          className="object-cover opacity-60 grayscale-30"
          priority
        />

        <div className="absolute inset-0 bg-neutral-950/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-48 h-48 md:w-56 md:h-56 mb-8 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl"
        >
          <Image
            src="/images/portrait.jpg"
            alt="Retrato Memorial"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif text-white tracking-wide mb-4"
        >
          María Floria Vences Romero
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex items-center gap-4 text-white/70 text-lg md:text-xl font-light tracking-widest uppercase mb-8"
        >
          <span>Año de nacimiento</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
          <span>14 Julio 1968</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full"
        >
          <p className="text-sm md:text-base text-orange-100/90 font-serif italic">
            {yearPassed}º Aniversario Luctuoso
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
      >
        <span className="text-xs tracking-widest uppercase">Desliza</span>
      </motion.div>
    </section>
  );
};