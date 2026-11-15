import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

/**
 * SwapButton — circular button that rotates 180 degrees on click.
 *
 * Props:
 *   onSwap – callback fired when the button is clicked
 */
export default function SwapButton({ onSwap }) {
  const [rotated, setRotated] = useState(false);
  const reduceMotion = useReducedMotion();

  function handleClick() {
    setRotated((prev) => !prev);
    onSwap?.();
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className="w-12 h-12 bg-background border-2 border-border rounded-full shadow-md hover:shadow-lg hover:border-primary/30 transition-shadow flex items-center justify-center focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
      animate={{ rotate: rotated ? 180 : 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 24 }
      }
      aria-label="Swap products"
    >
      <ArrowLeftRight size={20} className="text-foreground" />
    </motion.button>
  );
}
