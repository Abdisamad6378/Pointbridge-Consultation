import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageHeroProps = {
  image: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  tall?: boolean;
};

export function PageHero({ image, eyebrow, title, description, children, tall }: PageHeroProps) {
  return (
    <section className={`relative isolate overflow-hidden ${tall ? "min-h-[88vh]" : "min-h-[50vh]"}`}>
      <div className="absolute inset-0 -z-10">
        <img src={image} alt="" className="h-full w-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.07_260/0.95)] via-[oklch(0.22_0.08_260/0.88)] to-[oklch(0.28_0.10_256/0.75)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.68_0.19_144/0.15),transparent_50%)]" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 py-32 sm:px-6 lg:px-8 md:py-40 text-white">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl text-base sm:text-lg text-white/90 leading-relaxed"
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
