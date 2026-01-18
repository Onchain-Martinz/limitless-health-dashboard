import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SlideContainerProps = {
  children: ReactNode;
};

type SlideItemProps = {
  children: ReactNode;
  className?: string;
};

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
};

export function SlideContainer({ children }: SlideContainerProps) {
  return (
    <motion.div
      className="story-card"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function SlideItem({ children, className }: SlideItemProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
