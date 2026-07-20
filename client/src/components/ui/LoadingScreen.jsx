import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1
              className="text-6xl font-heading font-bold text-gradient mb-4"
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(253,248,245,0.3)',
                  '0 0 40px rgba(253,248,245,0.5)',
                  '0 0 20px rgba(253,248,245,0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AW
            </motion.h1>
            <motion.div
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="h-0.5 bg-gradient-primary rounded-full w-32 mx-auto"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
