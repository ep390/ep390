 "use client";
 
 import { useState, useCallback, useMemo } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { useMidiHandlers } from "@/components/midi";
 
 const PARTICLE_COLORS = ["#c07eff", "#fcbb00", "#00a544", "#155dfc", "#ff6568"];
 
 function Particle({ onComplete }: { onComplete: () => void }) {
   const angle = Math.random() * 360;
   const distance = 50 + Math.random() * 50;
   const duration = 0.5 + Math.random() * 0.5;
   const particleSize = 3 + Math.random() * 4;
   const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
 
   return (
     <motion.div
       className="absolute rounded-full"
       style={{
         backgroundColor: color,
         width: particleSize,
         height: particleSize,
       }}
       initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
       animate={{
         x: Math.cos(angle * (Math.PI / 180)) * distance,
         y: Math.sin(angle * (Math.PI / 180)) * distance,
         opacity: 0,
         scale: 0,
       }}
       transition={{ duration, ease: "easeOut" }}
       onAnimationComplete={onComplete}
     />
   );
 }
 
 export default function MidiVisualizer() {
   const [particles, setParticles] = useState<{ id: number }[]>([]);
   const [clockPulse, setClockPulse] = useState(0);
 
   const addParticle = useCallback(() => {
     setParticles((current) => [...current, { id: Date.now() + Math.random() }]);
   }, []);
 
   const removeParticle = useCallback((id: number) => {
     setParticles((current) => current.filter((p) => p.id !== id));
   }, []);
 
   useMidiHandlers({
     noteOn: () => {
       addParticle();
     },
     clock: () => {
       setClockPulse((c) => c + 1);
     },
   });
 
   const particleElements = useMemo(
     () =>
       particles.map((p) => (
         <Particle key={p.id} onComplete={() => removeParticle(p.id)} />
       )),
     [particles, removeParticle]
   );
 
   return (
     <div className="relative w-full h-32 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center">
       <motion.div
         className="absolute w-4 h-4 bg-zinc-700 rounded-full"
         animate={{ scale: [1, 1.5, 1] }}
         transition={{ duration: 0.1, repeat: Infinity, repeatType: "loop" }}
         key={clockPulse} // Re-trigger animation on clock
       />
       <div className="relative">{particleElements}</div>
       <div className="absolute bottom-2 right-2 text-xs text-zinc-500 font-mono">
         Waiting for MIDI...
       </div>
     </div>
   );
 }
