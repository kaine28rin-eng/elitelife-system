import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

function getPersonalization(answers) {
  const lines = []
  if (answers.need === 'qcm') lines.push('Practice-first approach — QCMs will be your primary weapon.')
  if (answers.need === 'summaries') lines.push('Simplified, structured summaries are your lane. Digest before you practice.')
  if (answers.need === 'revision') lines.push('Quick revision mode activated. Speed and precision over depth.')
  if (answers.level === 'not_prepared') lines.push('Consistency compounds. One module per day changes everything.')
  if (answers.level === 'moderate') lines.push('You have a base. Build on it systematically.')
  if (answers.study_method === 'videos') lines.push('Visual learning assets will be prioritized in your content drops.')
  return lines
}

export default function ResultScreen({ answers }) {
  const containerRef = useRef(null)
  const badgeRef = useRef(null)
  const titleRef = useRef(null)
  const bodyRef = useRef(null)
  const itemsRef = useRef([])
  const personalRef = useRef(null)
  const footerRef = useRef(null)

  const personalLines = getPersonalization(answers)

  useEffect(() => {
    const els = [
      badgeRef.current,
      titleRef.current,
      bodyRef.current,
      ...itemsRef.current,
      personalRef.current,
      footerRef.current,
    ].filter(Boolean)

    gsap.set(els, { opacity: 0, y: 30 })
    gsap.set(containerRef.current, { opacity: 0, scale: 0.98 })

    const tl = gsap.timeline({ delay: 0.3 })

    tl.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: 'power3.out',
    })
    .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to(itemsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power3.out',
    }, '-=0.2')

    if (personalRef.current) {
      tl.to(personalRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    }

    tl.to(footerRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.1')

    return () => tl.kill()
  }, [])

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ position: 'relative', zIndex: 10 }}
    >
      <div ref={containerRef} style={{ width: '100%', maxWidth: '680px' }}>

        {/* Success badge */}
        <div ref={badgeRef} className="text-center mb-10">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '1px solid rgba(99,102,241,0.4)',
              background: 'rgba(99,102,241,0.08)',
              marginBottom: '16px',
              fontSize: '24px',
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          >
            ◈
          </div>
          <div
            className="font-mono text-xs tracking-[0.3em]"
            style={{ color: 'rgba(99,102,241,0.6)' }}
          >
            SIGNAL RECEIVED · PROCESSED
          </div>
        </div>

        {/* Main panel */}
        <div
          className="glass-strong text-center"
          style={{ padding: '64px 48px', borderRadius: '4px' }}
        >
          {/* Top accent */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
            }}
          />

          <h1
            ref={titleRef}
            className="font-display font-light mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#e2e8f0',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Submission received.
          </h1>

          <p
            ref={bodyRef}
            className="font-body font-light mb-12"
            style={{
              fontSize: '1rem',
              color: '#64748b',
              lineHeight: '1.8',
            }}
          >
            You are now part of how this system evolves.
            <br />
            Based on collective input, the platform will focus on:
          </p>

          {/* Focus items */}
          <div className="text-left mb-12 space-y-3">
            {[
              ['◈', 'The most requested content type across all submissions'],
              ['◉', 'The most challenging modules by majority vote'],
              ['◫', 'The most effective study methods for this cohort'],
            ].map(([icon, text], i) => (
              <div
                key={i}
                ref={el => itemsRef.current[i] = el}
                className="flex items-center gap-4"
                style={{
                  padding: '16px 20px',
                  background: 'rgba(99,102,241,0.04)',
                  border: '1px solid rgba(99,102,241,0.1)',
                  borderRadius: '2px',
                }}
              >
                <span style={{ color: '#6366f1', fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                <span className="font-body text-sm" style={{ color: '#94a3b8' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Personalization */}
          {personalLines.length > 0 && (
            <div
              ref={personalRef}
              style={{
                padding: '24px',
                background: 'rgba(99,102,241,0.04)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: '2px',
                marginBottom: '32px',
                textAlign: 'left',
              }}
            >
              <div
                className="font-mono text-xs mb-4"
                style={{ color: 'rgba(99,102,241,0.5)', letterSpacing: '0.15em' }}
              >
                PERSONAL SIGNAL ANALYSIS
              </div>
              {personalLines.map((line, i) => (
                <p
                  key={i}
                  className="font-body text-sm mb-2 last:mb-0"
                  style={{ color: '#64748b', lineHeight: '1.7' }}
                >
                  — {line}
                </p>
              ))}
            </div>
          )}

          {/* Footer */}
          <p
            ref={footerRef}
            className="font-mono text-xs"
            style={{ color: '#334155', letterSpacing: '0.1em' }}
          >
            Stay active. The next drops will follow the majority.
          </p>
        </div>

        {/* Bottom tag */}
        <div className="text-center mt-8">
          <span
            className="font-mono text-xs"
            style={{ color: 'rgba(99,102,241,0.2)', letterSpacing: '0.2em' }}
          >
            ELITELIFE SYSTEM · FLSHm S4 · 2025
          </span>
        </div>
      </div>
    </div>
  )
}
