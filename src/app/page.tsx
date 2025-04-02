"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";
import Link from "next/link";
import SpecialDates from "@/components/special-dates";
import RelationshipTimeline from "@/components/relationship-timeline";

// Pre-generate positions for decorative elements to avoid hydration mismatch
const HEARTS_POSITIONS = [
  { left: "10%", top: "15%", size: "1.2rem", delay: 0 },
  { left: "20%", top: "45%", size: "1.5rem", delay: 1 },
  { left: "35%", top: "75%", size: "1.8rem", delay: 2 },
  { left: "50%", top: "25%", size: "1.3rem", delay: 3 },
  { left: "65%", top: "65%", size: "1.1rem", delay: 1.5 },
  { left: "80%", top: "35%", size: "1.7rem", delay: 2.5 },
  { left: "90%", top: "85%", size: "1.4rem", delay: 0.5 },
  { left: "15%", top: "55%", size: "1.9rem", delay: 3.5 },
  { left: "70%", top: "10%", size: "1.6rem", delay: 1.2 },
  { left: "40%", top: "90%", size: "1.3rem", delay: 2.8 },
];

export default function HomePage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to indicate when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="page-transition">
      <Navigation />

      <motion.main
        className="notion-container mt-8 pb-12 relative min-h-[70vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          happy two years bubas!!
        </motion.h1>

        {/* Special Dates Component */}
        <SpecialDates />

        {/* Relationship Timeline */}
        <RelationshipTimeline />

        {/* Navigation Links to Other Sections */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <Link href="/music">
            <button className="notion-button">
              go to music
            </button>
          </Link>
          <Link href="/letters">
            <button className="notion-button">
              go to letters
            </button>
          </Link>
        </div>

        {/* Decorative hearts - Only render on client side with fixed positions to avoid hydration mismatches */}
        {isClient && HEARTS_POSITIONS.map((position, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/40 pointer-events-none"
            style={{
              left: position.left,
              top: position.top,
              fontSize: position.size,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: position.delay,
            }}
          >
            <Heart aria-hidden="true" />
          </motion.div>
        ))}
      </motion.main>
    </div>
  );
}
