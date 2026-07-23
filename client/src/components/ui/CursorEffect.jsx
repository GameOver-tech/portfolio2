import { useEffect, useRef } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'

export default function CursorEffect() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  useMousePosition()

  useEffect(() => {
    const cursor = cursorRef.current; const follower = followerRef.current
    if (!cursor || !follower) return
    let mouseX = -100, mouseY = -100, followerX = -100, followerY = -100
    let rafId
    const handleMouse = (e) => { mouseX = e.clientX; mouseY = e.clientY; cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)` }
    const animate = () => {
      followerX += (mouseX - followerX) * 0.1; followerY += (mouseY - followerY) * 0.1
      follower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px)`
      rafId = requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    rafId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 w-3 h-3 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block shadow-[0_0_10px_rgba(0,240,255,0.5)]" style={{ transform: 'translate(-50%, -50%)' }} />
      <div ref={followerRef} className="fixed top-0 left-0 w-7 h-7 border border-accent/40 rounded-full pointer-events-none z-[9999] hidden md:block" style={{ transform: 'translate(-50%, -50%)' }} />
    </>
  )
}
