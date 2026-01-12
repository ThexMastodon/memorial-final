"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, BookOpen, Flame, Sprout, Image, Wind} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "INICIO", icon: Heart, id: "home", color: "text-red-300", fill: "fill-red-200" },
    { name: "FE", icon: BookOpen, id: "faith", color: "text-yellow-300", fill: "fill-yellow-100" },
    { name: "LUZ", icon: Flame, id: "wall-of-light", color: "text-orange-300", fill: "fill-orange-200" },
    { name: "RECUERDOS", icon: Sprout, id: "memory-tree", color: "text-green-300", fill: "fill-green-200" },
    // { name: "GALERÍA", icon: Image, id: "gallery", color: "text-blue-300", fill: "fill-blue-200" },
    { name: "CIELO", icon: Wind, id: "sky-of-wishes", color: "text-cyan-300", fill: "fill-cyan-200" }
  ];

export const FloatingNavbar = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
  const isVisible = true;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map(item => item.id);
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new window.IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px 0px -70% 0px",
      threshold: 0.15
    });
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);

    if(element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center gap-2 px-2 py-2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-2xl sm:gap-2 sm:px-2 sm:py-2 gap-1 px-1 py-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                    "sm:gap-2 sm:px-4 sm:py-2 gap-1 px-2 py-1 text-xs",
                    isActive
                      ? "bg-black text-white shadow-lg"
                      : "text-gray-700 hover:bg-black/80 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-black rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2 sm:gap-2 gap-1">
                    <item.icon
                      size={windowWidth < 640 ? 18 : 22}
                      className={cn(
                        isActive
                          ? item.fill + " text-white"
                          : item.color + " ",
                        "transition-colors duration-300"
                      )}
                      fill={isActive ? "currentColor" : "none"}
                      strokeWidth={isActive ? 1.5 : 2}
                    />
                    {isActive && (
                      <span className="hidden xs:inline sm:block">{item.name}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};