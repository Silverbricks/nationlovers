"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-hero-gradient overflow-hidden pt-16">
      {/* Kangaroo watermark */}
      <div className="absolute inset-0 flex items-center justify-end pr-12 pointer-events-none select-none">
        <span className="text-[18rem] opacity-[0.04]">🦘</span>
      </div>

      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-wide relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Tag line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot" />
            <span className="text-white/80 text-sm font-medium">Australia&apos;s #1 Civic Platform</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4"
          >
            Australia&apos;s Voice.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          >
            <span className="text-gold">Every Issue.</span>{" "}
            <span className="text-white">Every Solution.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-white/70 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed"
          >
            Report real Australian issues. Submit your solutions. Vote for the best fixes.
            Together, we hold decision-makers accountable.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/report">
              <Button size="lg" className="group">
                <Megaphone className="w-5 h-5" />
                Report an Issue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/issues">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white hover:text-navy border-2"
              >
                Browse All Issues
              </Button>
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-14 flex flex-wrap gap-8"
          >
            {[
              { num: "50,000+", label: "Australians reporting" },
              { num: "9", label: "Issue categories" },
              { num: "8", label: "States & territories" },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-gold text-2xl font-bold">{num}</p>
                <p className="text-white/60 text-sm">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
