// ── Easing presets ──
const smooth = [0.25, 0.46, 0.45, 0.94]
const spring = { type: 'spring', stiffness: 300, damping: 24 }
const springLight = { type: 'spring', stiffness: 200, damping: 18 }
const springBouncy = { type: 'spring', stiffness: 400, damping: 15 }

// ── Entrance animations ──
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smooth } },
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smooth } },
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: smooth } },
}

export const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: smooth } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const scaleInBlur = {
  hidden: { opacity: 0, scale: 0.7, filter: 'blur(10px)' },
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: smooth } },
}

export const rotateIn = {
  hidden: { opacity: 0, rotate: -10, scale: 0.9 },
  visible: { opacity: 1, rotate: 0, scale: 1, transition: { ...spring, stiffness: 200 } },
}

export const clipReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 1, ease: [0.77, 0, 0.18, 1] } },
}

export const clipRevealUp = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1, ease: [0.77, 0, 0.18, 1] } },
}

export const skewReveal = {
  hidden: { opacity: 0, skewY: 3, y: 40 },
  visible: { opacity: 1, skewY: 0, y: 0, transition: { duration: 0.8, ease: smooth } },
}

// ── Text animations ──
export const textReveal = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: smooth } },
}

export const letterReveal = {
  hidden: { y: 50, opacity: 0 },
  visible: (i) => ({
    y: 0, opacity: 1,
    transition: { delay: i * 0.03, duration: 0.5, ease: smooth },
  }),
}

export const wordReveal = {
  hidden: { y: 40, opacity: 0, rotateX: 15 },
  visible: (i) => ({
    y: 0, opacity: 1, rotateX: 0,
    transition: { delay: i * 0.06, duration: 0.6, ease: smooth },
  }),
}

// ── Stagger containers ──
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export const staggerContainerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
}

export const staggerContainerSlow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smooth } },
}

export const staggerItemScale = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: smooth } },
}

export const staggerItemLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: smooth } },
}

// ── Hover animations ──
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -8, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const cardHover3D = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.3, ease: 'easeOut' } },
}

export const magneticPull = {
  rest: { x: 0, y: 0 },
  hover: { scale: 1.05, transition: { duration: 0.3, ease: 'easeOut' } },
}

export const iconFloat = {
  rest: { y: 0 },
  hover: { y: -4, scale: 1.1, transition: { duration: 0.3, ease: 'easeOut' } },
}

// ── Continuous animations ──
export const float = {
  y: [0, -12, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
}

export const floatSlow = {
  y: [0, -8, 0],
  transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
}

export const pulse = {
  scale: [1, 1.03, 1],
  opacity: [1, 0.8, 1],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
}

export const glowPulse = {
  boxShadow: [
    '0 0 20px rgba(0,240,255,0.1)',
    '0 0 40px rgba(0,240,255,0.25)',
    '0 0 20px rgba(0,240,255,0.1)',
  ],
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
}

// ── Page transitions ──
export const pageEnter = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: smooth } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3, ease: smooth } },
}

export const pageEnterFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: smooth } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: smooth } },
}

export const pageEnterScale = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: smooth } },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(2px)', transition: { duration: 0.3, ease: smooth } },
}

// ── Counter ──
export const counterAnimation = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ── Loading ──
export const loadingContainer = {
  initial: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.6, ease: smooth } },
}

export const loadingLogo = {
  initial: { scale: 0.6, opacity: 0, rotate: -10 },
  animate: { scale: 1, opacity: 1, rotate: 0, transition: { duration: 0.6, ease: smooth } },
}
