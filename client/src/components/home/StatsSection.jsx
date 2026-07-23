import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useApp } from '../../context/AppContext'
import SectionReveal from '../ui/SectionReveal'
import { staggerContainerFast, staggerItemScale } from '../../animations/variants'

function AnimatedCounter({ value, suffix, label }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true })
  useEffect(() => {
    if (!inView) return
    let start = 0; const duration = 2000; const step = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => { start += step; if (start >= value) { setCount(value); clearInterval(timer) } else setCount(start) }, 16)
    return () => clearInterval(timer)
  }, [inView, value])
  return (
    <div ref={ref} className="text-center">
      <motion.span className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-gradient block"
        initial={{ scale: 0.3, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.2 }}>
        {count}{suffix}
      </motion.span>
      <motion.p className="text-text-muted text-sm mt-2 font-medium tracking-wide"
        initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.5 }}>
        {label}
      </motion.p>
    </div>
  )
}

export default function StatsSection() {
  const { stats } = useApp()
  const displayStats = stats || []
  return (
    <section className="py-12 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {displayStats.length > 0 && (
          <motion.div variants={staggerContainerFast} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {displayStats.map((stat, i) => (
              <motion.div key={stat.id || stat.label || i} variants={staggerItemScale}
                className="text-center p-4 sm:p-6 md:p-8 rounded-2xl glass-card group hover:border-accent/20">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
