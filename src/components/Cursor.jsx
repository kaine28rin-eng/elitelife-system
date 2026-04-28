import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const glow = glowRef.current

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let glowX = 0, glowY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      })
    }

    // Smooth ring follow
    const lerp = (a, b, n) => (1 - n) * a + n * b

    let rafId
    const animateRing = () => {
      ringX = lerp(ringX, mouseX, 0.1)
      ringY = lerp(ringY, mouseY, 0.1)
      glowX = lerp(glowX, mouseX, 0.06)
      glowY = lerp(glowY, mouseY, 0.06)

      gsap.set(ring, { x: ringX, y: ringY })
      gsap.set(glow, { x: glowX, y: glowY })

      rafId = requestAnimationFrame(animateRing)
    }
    animateRing()

    // Hover effects
    const onEnter = () => {
      gsap.to(dot, { scale: 2.5, background: '#818cf8', duration: 0.3 })
      gsap.to(ring, { scale: 1.5, borderColor: 'rgba(129,140,248,0.8)', duration: 0.3 })
    }

    const onLeave = () => {
      gsap.to(dot, { scale: 1, background: '#6366f1', duration: 0.3 })
      gsap.to(ring, { scale: 1, borderColor: 'rgba(99,102,241,0.5)', duration: 0.3 })
    }

    const onMouseDown = () => {
      gsap.to(dot, { scale: 0.6, duration: 0.15 })
      gsap.to(ring, { scale: 0.8, duration: 0.15 })
    }

    const onMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' })
      gsap.to(ring, { scale: 1, duration: 0.3 })
    }

    const interactEls = document.querySelectorAll('a, button, [data-cursor="hover"]')
    interactEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    // Re-attach on DOM changes
    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll('a, button, [data-cursor="hover"]')
      els.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={glowRef} className="cursor-glow" />
    </>
  )
}
