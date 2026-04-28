import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

function splitToChars(text, className = '') {
  return text.split('').map((char, i) => (
    <span key={i} className={`char ${className}`} style={{ display: 'inline-block' }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
}

export default function Hero({ onEnter }) {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)
  const lineRef = useRef(null)
  const tagRef = useRef(null)
  const badgeRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'cubic-bezier(0.16, 1, 0.3, 1)' } })

    // Initial states
    gsap.set([titleRef.current.querySelectorAll('.char'), subtitleRef.current, buttonRef.current, lineRef.current, tagRef.current, badgeRef.current], {
      opacity: 0,
    })
    gsap.set(titleRef.current.querySelectorAll('.char'), { y: 80, rotateX: -40 })
    gsap.set(subtitleRef.current, { y: 30 })
    gsap.set(buttonRef.current, { y: 20, scale: 0.95 })
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(tagRef.current, { x: -20 })
    gsap.set(badgeRef.current, { x: 20 })

    tl.to(badgeRef.current, { opacity: 1, x: 0, duration: 0.8, delay: 0.3 })
      .to(titleRef.current.querySelectorAll('.char'), {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.0,
        stagger: 0.04,
        ease: 'power4.out',
      }, '-=0.4')
      .to(lineRef.current, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to(tagRef.current, { opacity: 1, x: 0, duration: 0.7 }, '-=0.5')
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.9 }, '-=0.4')
      .to(buttonRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.6)' }, '-=0.4')

    return () => tl.kill()
  }, [])

  const handleEnter = () => {
    const tl = gsap.timeline()
    tl.to(heroRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: onEnter,
    })
  }

  return (
    <section
      ref={heroRef}
      className="section relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden"
    >
      {/* Top badge */}
      <div ref={badgeRef} className="mb-12">
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-[0.2em] uppercase font-mono"
          style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: '#818cf8',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          />
          Student Intelligence System · S4 Cohort
        </span>
      </div>

      {/* Title */}
      <div
        className="relative mb-6"
        style={{ perspective: '800px', perspectiveOrigin: 'center' }}
      >
        <h1
          ref={titleRef}
          className="font-display font-light leading-none select-none"
          style={{
            fontSize: 'clamp(4rem, 12vw, 11rem)',
            letterSpacing: '-0.02em',
            color: 'transparent',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 40%, #6366f1 80%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {splitToChars('EliteLife')}
          <br />
          <span
            style={{
              fontSize: 'clamp(2rem, 6vw, 5.5rem)',
              letterSpacing: '0.06em',
              background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {splitToChars('SYSTEM')}
          </span>
        </h1>
      </div>

      {/* Divider line */}
      <div
        ref={lineRef}
        className="mb-6"
        style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
        }}
      />

      {/* Tag */}
      <div ref={tagRef} className="mb-8">
        <span
          className="font-mono text-xs tracking-[0.3em] uppercase"
          style={{ color: 'rgba(99, 102, 241, 0.7)' }}
        >
          FLSHm · Hassan II · GR02
        </span>
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="mb-12 font-body font-light leading-relaxed"
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: '#64748b',
          maxWidth: '520px',
          letterSpacing: '0.01em',
        }}
      >
        A system that evolves based on{' '}
        <span style={{ color: '#818cf8' }}>collective student intelligence</span>.
        <br />
        Your input shapes what comes next.
      </p>

      {/* CTA Button */}
      <button
        ref={buttonRef}
        onClick={handleEnter}
        className="relative group overflow-hidden"
        style={{
          padding: '16px 48px',
          background: 'transparent',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '2px',
          color: '#e2e8f0',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: 'none',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget, {
            boxShadow: '0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15)',
            borderColor: 'rgba(99,102,241,0.8)',
            duration: 0.3,
          })
          gsap.to(e.currentTarget.querySelector('.btn-fill'), { scaleX: 1, duration: 0.4, ease: 'power3.out' })
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget, { boxShadow: 'none', borderColor: 'rgba(99,102,241,0.4)', duration: 0.3 })
          gsap.to(e.currentTarget.querySelector('.btn-fill'), { scaleX: 0, duration: 0.3 })
        }}
        onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1 })}
        onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: 'elastic.out(1,0.4)' })}
      >
        <span
          className="btn-fill"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(129,140,248,0.08))',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
        <span className="relative z-10">Enter System</span>
      </button>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0.3 }}
      >
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#475569' }}>
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(180deg, #6366f1, transparent)',
            animation: 'float 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Corner decorations */}
      <div
        className="absolute top-8 left-8 font-mono text-xs"
        style={{ color: 'rgba(99,102,241,0.2)', letterSpacing: '0.1em' }}
      >
        ELS·001
      </div>
      <div
        className="absolute top-8 right-8 font-mono text-xs"
        style={{ color: 'rgba(99,102,241,0.2)', letterSpacing: '0.1em' }}
      >
        2025·S4
      </div>
    </section>
  )
}
