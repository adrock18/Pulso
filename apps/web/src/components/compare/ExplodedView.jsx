import { motion, useReducedMotion } from 'framer-motion';

/**
 * ExplodedView — product image with box-content items arranged radially.
 *
 * Props:
 *   product  – { image, boxContents: string[], name }
 */
export default function ExplodedView({ product }) {
  const reduceMotion = useReducedMotion();

  if (!product) return null;

  const { image, boxContents, name } = product;
  const parts = boxContents ?? [];

  // Radial positioning: distribute parts evenly in a circle
  const radiusDesktop = 120;
  const radiusMobile = 80;

  function getPartPosition(index, total) {
    const angle = (2 * Math.PI * index) / total - Math.PI / 2; // start from top
    return {
      xDesktop: Math.cos(angle) * radiusDesktop,
      yDesktop: Math.sin(angle) * radiusDesktop,
      xMobile: Math.cos(angle) * radiusMobile,
      yMobile: Math.sin(angle) * radiusMobile,
    };
  }

  // Image entrance — scale up
  const imageVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        },
      };

  // Part entrance — spring burst from center
  const partVariants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
        visible: (pos) => ({
          opacity: 1,
          scale: 1,
          x: pos.xDesktop,
          y: pos.yDesktop,
          transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
          },
        }),
      };

  // Connector line from part toward center
  const lineVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 0.3 } }
    : {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
          pathLength: 1,
          opacity: 0.3,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        },
      };

  // If no boxContents, just show the product image with a scale-up entrance
  if (parts.length === 0) {
    return (
      <div className="flex items-center justify-center py-6">
        <motion.img
          src={image}
          alt={name}
          className="h-32 w-auto object-contain"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center py-8 overflow-visible">
      {/* Central product image */}
      <motion.div
        className="relative z-10"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-24 w-auto object-contain sm:h-28"
          />
        ) : (
          <div className="h-24 w-24 rounded-xl bg-muted/40 flex items-center justify-center">
            <span className="text-muted-foreground/30 text-2xl">?</span>
          </div>
        )}
      </motion.div>

      {/* SVG connector lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 5 }}
      >
        {parts.map((_, i) => {
          const pos = getPartPosition(i, parts.length);
          // Draw from part position toward center (0,0 relative to SVG center)
          const cx = '50%';
          const cy = '50%';
          return (
            <motion.line
              key={`line-${i}`}
              x1={cx}
              y1={cy}
              x2={`calc(50% + ${pos.xDesktop}px)`}
              y2={`calc(50% + ${pos.yDesktop}px)`}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: reduceMotion ? 0 : 0.3 + i * 0.08 + 0.15 }}
            />
          );
        })}
      </svg>

      {/* Part pills — positioned absolutely from center */}
      <div className="absolute inset-0" style={{ zIndex: 15 }}>
        <div className="relative w-full h-full flex items-center justify-center">
          {parts.map((part, i) => {
            const pos = getPartPosition(i, parts.length);

            return (
              <motion.span
                key={part}
                className="absolute bg-card border border-border/50 rounded-full px-3 py-1 text-xs font-medium shadow-sm whitespace-nowrap"
                custom={pos}
                variants={partVariants}
                initial="hidden"
                animate="visible"
                transition={
                  reduceMotion
                    ? { duration: 0.15 }
                    : { delay: 0.3 + i * 0.08 }
                }
                style={
                  reduceMotion
                    ? { transform: `translate(${pos.xMobile}px, ${pos.yMobile}px)` }
                    : undefined
                }
              >
                {part}
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
