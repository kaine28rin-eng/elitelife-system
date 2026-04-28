import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function LoadingScreen() {
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const textRef = useRef(null)
  const dotsRef = useRef([])

  const steps = ['Encrypting payload', 'Connecting to network', 'Submitting signal', 'Verifying receipt']

  useEffect(() => {
    const tl = gsap.timeline()

    gsap.set(containerRef.current, { opacity: 0 })
    tl.to(containerRef.current, { opacity: 1, duration: 0.5 })

    // Animate progress
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 2.5,
      ease: 'power1.inOut',
    })

    // Step texts
    steps.forEach((step, i) => {
      tl.call(() => {
        if (textRef.current) {
          gsap.to(textRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
              textRef.current.textContent = step + '...'
              gsap.fromTo(textRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 })
            }
          })
        }
      }, null, i * 0.65)
    })

    // Animate dots
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return
      gsap.to(dot, {
        opacity: 1,
        y: -4,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        delay: i * 0.15,
        ease: 'power2.inOut',
      })
    })

    return () => tl.kill()
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ zIndex: 100, background: 'rgba(2,6,23,0.95)', backdropFilter: 'blur(20px)' }}
    >
      {/* Animated rings */}
      <div className="relative mb-16">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              borderRadius: '50%',
              border: `1px solid rgba(99, 102, 241, ${0.4 - i * 0.12})`,
              animation: `pulse-glow ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '1px solid rgba(99,102,241,0.6)',
            borderTopColor: '#6366f1',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '280px',
          height: '1px',
          background: 'rgba(255,255,255,0.06)',
          marginBottom: '20px',
          overflow: 'hidden',
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            width: '100%',
            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
            boxShadow: '0 0 10px rgba(99,102,241,0.6)',
          }}
        />
      </div>

      {/* Step text */}
      <p
        ref={textRef}
        className="font-mono text-xs"
        style={{ color: '#475569', letterSpacing: '0.1em' }}
      >
        Initializing...
      </p>

      {/* Dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={el => dotsRef.current[i] = el}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.5)',
              opacity: 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}
