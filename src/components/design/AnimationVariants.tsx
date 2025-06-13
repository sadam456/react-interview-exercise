export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export const cardFlipVariants = {
  front: {
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  back: {
    rotateY: 180,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const searchVariants = {
  focus: {
    scale: 1.02,
    boxShadow: "0 8px 25px rgba(66, 153, 225, 0.15)",
    transition: { duration: 0.2 },
  },
  blur: {
    scale: 1,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.2 },
  },
};

export const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(66, 153, 225, 0.3)",
      "0 0 30px rgba(66, 153, 225, 0.5)",
      "0 0 20px rgba(66, 153, 225, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
