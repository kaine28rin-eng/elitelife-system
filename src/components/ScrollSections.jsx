import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const benefits = [
  {
    icon: '◈',
    title: 'Smart Content Delivery',
    desc: 'Content prioritized based on what the majority needs — not what textbooks dictate.',
    color: '#6366f1',
  },
  {
    icon: '◉',
    title: 'Majority-Driven Learning',
    desc: 'Your vote shapes the collective curriculum. The most needed material rises to the top.',
    color: '#3b82f6',
  },
  {
    icon: '◫',
    title: 'Adaptive Study System',
    desc: 'Resources evolve with each submission cycle. The system learns. So do you.',
    color: '#818cf8',
  },
]

function BenefitCard({ item, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    gsap.set(card, { opacity: 0, y: 60, scale: 0.9, filter: 'blur(8px)' })

    ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          delay: index * 0.15,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        })
      },
    })

    // 3D tilt
    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(card, {
        rotateY: x * 12,
        rotateX: -y * 12,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      })
    }

    const onMouseLeave = () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' })
    }

    card.addEventListener('mousemove', onMouseMove)
    card.addEventListener('mouseleave', onMouseLeave)

    return () => {
      card.removeEventListener('mousemove', onMouseMove)
      card.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [index])

  return (
    <div
      ref={cardRef}
      className="glass relative overflow-hidden"
      style={{
        borderRadius: '4px',
        padding: '40px 32px',
        cursor: 'default',
        willChange: 'transform',
      }}
      onMouseEnter={(e) => {
        gsap.to(e.currentTarget, {
          borderColor: `${item.color}44`,
          boxShadow: `0 0 40px ${item.color}22, inset 0 0 30px ${item.color}08`,
          duration: 0.3,
        })
      }}
      onMouseLeave={(e) => {
        gsap.to(e.currentTarget, {
          borderColor: 'rgba(255,255,255,0.06)',
          boxShadow: 'none',
          duration: 0.3,
        })
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${item.color}88, transparent)`,
        }}
      />

      <div
        className="font-mono text-3xl mb-6"
        style={{ color: item.color }}
      >
        {item.icon}
      </div>

      <h3
        className="font-display font-light mb-4"
        style={{
          fontSize: '1.5rem',
          color: '#e2e8f0',
          letterSpacing: '-0.01em',
        }}
      >
        {item.title}
      </h3>

      <p
        className="font-body"
        style={{
          fontSize: '0.9rem',
          color: '#64748b',
          lineHeight: '1.7',
        }}
      >
        {item.desc}
      </p>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
        }}
      />
    </div>
  )
}

export default function ScrollSections({ onScrollComplete }) {
  const sectionARef = useRef(null)
  const sectionBRef = useRef(null)
  const sectionCRef = useRef(null)
  const titleARef = useRef(null)
  const titleBRef = useRef(null)
  const textLeftRef = useRef(null)
  const textRightRef = useRef(null)
  const ctaPanelRef = useRef(null)
  const ctaTitleRef = useRef(null)
  const ctaTextRef = useRef(null)
  const ctaBtnRef = useRef(null)
  const statRefs = useRef([])

  useEffect(() => {
    // === SECTION A animations ===
    gsap.set(titleARef.current, { opacity: 0, y: 50 })
    gsap.set(textLeftRef.current, { opacity: 0, x: -60 })
    gsap.set(textRightRef.current, { opacity: 0, x: 60 })

    ScrollTrigger.create({
      trigger: sectionARef.current,
      start: 'top 60%',
      onEnter: () => {
        const tl = gsap.timeline()
        tl.to(titleARef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' })
          .to(textLeftRef.current, { opacity: 1, x: 0, duration: 0.8, ease: 'cubic-bezier(0.16,1,0.3,1)' }, '-=0.5')
          .to(textRightRef.current, { opacity: 1, x: 0, duration: 0.8, ease: 'cubic-bezier(0.16,1,0.3,1)' }, '-=0.7')
      },
    })

    // === SECTION B - stats counter ===
    gsap.set(titleBRef.current, { opacity: 0, y: 40 })
    ScrollTrigger.create({
      trigger: sectionBRef.current,
      start: 'top 65%',
      onEnter: () => {
        gsap.to(titleBRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      },
    })

    // === SECTION C - CTA assemble ===
    gsap.set(ctaPanelRef.current, { opacity: 0, scale: 0.96 })
    gsap.set(ctaTitleRef.current, { opacity: 0, y: 30 })
    gsap.set(ctaTextRef.current, { opacity: 0, y: 20 })
    gsap.set(ctaBtnRef.current, { opacity: 0, scale: 0.9 })

    ScrollTrigger.create({
      trigger: sectionCRef.current,
      start: 'top 60%',
      onEnter: () => {
        const tl = gsap.timeline()
        tl.to(ctaPanelRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' })
          .to(ctaTitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
          .to(ctaTextRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .to(ctaBtnRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: 'elastic.out(1,0.5)' }, '-=0.3')
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <>
      {/* ====== SECTION A — CONCEPT ====== */}
      <section
        ref={sectionARef}
        className="section min-h-screen flex flex-col justify-center px-6 py-32"
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        <div ref={titleARef} className="mb-20 text-center">
          <div
            className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: 'rgba(99,102,241,0.6)' }}
          >
            01 · System Logic
          </div>
          <h2
            className="font-display font-light"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#e2e8f0',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Intelligence emerges from
            <br />
            <em style={{ color: '#6366f1', fontStyle: 'italic' }}>collective signal</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div ref={textLeftRef}>
            <p
              className="font-body font-light leading-loose mb-6"
              style={{ fontSize: '1.05rem', color: '#64748b' }}
            >
              Traditional study systems are static. Fixed curricula, fixed timelines, fixed priorities — regardless of where students actually struggle.
            </p>
            <p
              className="font-body font-light leading-loose"
              style={{ fontSize: '1.05rem', color: '#475569' }}
            >
              EliteLife System flips this. Every submission is data. Every vote reshapes what comes next. The platform listens.
            </p>
          </div>

          <div ref={textRightRef}>
            <div
              className="glass relative"
              style={{
                padding: '32px',
                borderRadius: '4px',
                borderLeft: '2px solid rgba(99,102,241,0.3)',
              }}
            >
              <div className="font-mono text-xs mb-4" style={{ color: 'rgba(99,102,241,0.5)' }}>
                PROCESS FLOW
              </div>
              {['Student submits preference', 'Data aggregates in real-time', 'System identifies majority need', 'Content drops follow the signal'].map((step, i) => (
                <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
                  <span
                    className="font-mono text-xs w-6 h-6 rounded-sm flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(99,102,241,0.1)',
                      color: '#6366f1',
                      border: '1px solid rgba(99,102,241,0.2)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-body text-sm" style={{ color: '#94a3b8' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-32"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)',
          }}
        />
      </section>

      {/* ====== SECTION B — BENEFITS ====== */}
      <section
        ref={sectionBRef}
        className="section min-h-screen flex flex-col justify-center px-6 py-32"
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        <div ref={titleBRef} className="mb-20 text-center">
          <div
            className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: 'rgba(99,102,241,0.6)' }}
          >
            02 · Core Capabilities
          </div>
          <h2
            className="font-display font-light"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#e2e8f0',
              letterSpacing: '-0.02em',
            }}
          >
            What the system
            <br />
            <em style={{ color: '#6366f1', fontStyle: 'italic' }}>delivers</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((item, i) => (
            <BenefitCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Divider */}
        <div
          className="mt-32"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)',
          }}
        />
      </section>

      {/* ====== SECTION C — TRANSITION TO POLL ====== */}
      <section
        ref={sectionCRef}
        className="section min-h-screen flex flex-col items-center justify-center px-6 py-32"
      >
        <div ref={ctaPanelRef} className="glass-strong text-center" style={{ maxWidth: '680px', padding: '80px 60px', borderRadius: '4px' }}>
          <div
            ref={ctaTitleRef}
            className="font-mono text-xs tracking-[0.3em] uppercase mb-6"
            style={{ color: 'rgba(99,102,241,0.6)' }}
          >
            03 · Your Signal
          </div>

          <h2
            className="font-display font-light mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#e2e8f0',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Now it's your turn
            <br />
            <em style={{ color: '#6366f1', fontStyle: 'italic' }}>to shape it</em>
          </h2>

          <p
            ref={ctaTextRef}
            className="font-body font-light mb-12"
            style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.8' }}
          >
            Five questions. Two minutes. Your responses feed the collective intelligence that determines what this system delivers to your cohort.
          </p>

          <button
            ref={ctaBtnRef}
            onClick={onScrollComplete}
            style={{
              padding: '18px 52px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(129,140,248,0.08))',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: '2px',
              color: '#e2e8f0',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'none',
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                boxShadow: '0 0 40px rgba(99,102,241,0.4)',
                borderColor: 'rgba(99,102,241,0.8)',
                duration: 0.3,
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { boxShadow: 'none', borderColor: 'rgba(99,102,241,0.4)', duration: 0.3 })
            }}
            onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1 })}
            onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
          >
            Begin Assessment
          </button>
        </div>
      </section>
    </>
  )
}
