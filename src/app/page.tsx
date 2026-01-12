import { FloatingNavbar } from "@/components/layout/floatingNavbar";
import { Hero } from "@/components/layout/hero";
import { InMemoriam } from "@/components/layout/MemorialSection";
import { WallOfLight } from "@/components/modules/wallOfLight";
import { MemoryTree } from "@/components/modules/memoryTree";
import SkyOfWishes from "@/components/modules/skyOfWishes";

export default function HomePage() {
  return (
    <main className="bg-white-900 min-h-screen text-white selection:bg-orange-500/30">
      <FloatingNavbar />
      <section
        id="home"
      >
        <Hero />
      </section>
      
      <section
        id="faith"
        className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      >
        <div className="absolute left-0 bottom-0 w-full flex flex-row gap-1 justify-start items-end opacity-100 pointer-events-none select-none z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <img
              key={i}
              src="/alcatraz.jpg"
              alt="Alcatraz decorativo"
              className="w-20 md:w-28 h-auto"
              style={{zIndex: 0}}
            />
          ))}
        </div>
        <div className="relative z-10 w-full">
          <InMemoriam />
        </div>
      </section>

      <section
        id="wall-of-light"
        className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-black-950 to-black-950 z-0" />

        <WallOfLight />
      </section>

      <section
        id="memory-tree"
        className="min-h-screen flex flex-col items-center py-24 px-4 relative bg-white-900 border-t border-white/5 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>

        <MemoryTree />
      </section>

      <section
        id="gallery"
        className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      >
      </section>

      <section 
        id="sky-of-wishes" 
        className="min-h-screen relative w-full overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#312e81] to-[#4c1d95] z-0" />
        
        <div className="absolute top-20 w-full text-center z-20 pointer-events-none">
          <h2 className="text-4xl font-thin tracking-widest font-serif text-white/90">
            Un Deseo al Cielo
          </h2>
        </div>

        <SkyOfWishes />
      </section>
    </main>
  )
}