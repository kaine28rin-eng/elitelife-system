import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'

const MODULES = [
  'Introduction to Linguistics',
  'Introduction to Discourse Analysis',
  'Introduction to Translation',
  'Introduction to Research',
  'Introduction to African Literature & Culture',
  'Introduction to Cultural Studies',
  'Foreign Language (French)',
]

const QUESTIONS = [
  {
    id: 'need',
    num: '01',
    question: 'What type of content do you need the most right now?',
    options: [
      { value: 'summaries', label: 'Comprehensive Summaries', icon: '◈', desc: 'Deep-dive structured notes' },
      { value: 'qcm', label: 'Practice Questions (QCM)', icon: '◉', desc: 'Exam-format exercises' },
      { value: 'past_exams', label: 'Past Exam Papers', icon: '◫', desc: 'Historical exam content' },
      { value: 'revision', label: 'Quick Revision Notes', icon: '◌', desc: 'Fast-scan essentials' },
    ],
  },
  {
    id: 'difficulty_module',
    num: '02',
    question: 'Which module do you find the most challenging?',
    options: MODULES.map((m, i) => ({
      value: m.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, ''),
      label: m,
      icon: String.fromCharCode(0x2460 + i),
      desc: '',
    })),
  },
  {
    id: 'weak_module',
    num: '03',
    question: 'Which module do you currently understand the least?',
    options: MODULES.map((m, i) => ({
      value: m.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, ''),
      label: m,
      icon: String.fromCharCode(0x2460 + i),
      desc: '',
    })),
  },
  {
    id: 'level',
    num: '04',
    question: 'How would you describe your current level of preparation?',
    options: [
      { value: 'fully', label: 'Fully Prepared', icon: '◈', desc: 'Confident across all modules' },
      { value: 'moderate', label: 'Moderately Prepared', icon: '◉', desc: 'Solid on most, gaps remain' },
      { value: 'not_prepared', label: 'Not Prepared', icon: '◌', desc: 'Need significant support' },
    ],
  },
  {
    id: 'study_method',
    num: '05',
    question: 'What is your preferred method of studying?',
    options: [
      { value: 'pdfs', label: 'Reading Full PDFs', icon: '◈', desc: 'Thorough document study' },
      { value: 'qcm', label: 'Practicing with QCMs', icon: '◉', desc: 'Question-based learning' },
      { value: 'summaries', label: 'Short Summaries', icon: '◫', desc: 'Condensed key points' },
      { value: 'videos', label: 'Video Explanations', icon: '◌', desc: 'Visual & audio learning' },
    ],
  },
]

function OptionCard({ option, isSelected, onClick, compact }) {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, {
      rotateY: 0, rotateX: 0,
      duration: 0.5, ease: 'power3.out',
    })
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden"
      style={{
        padding: compact ? '16px 20px' : '24px 28px',
        borderRadius: '3px',
        cursor: 'none',
        background: isSelected
          ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(129,140,248,0.08))'
          : 'rgba(255,255,255,0.025)',
        border: isSelected
          ? '1px solid rgba(99,102,241,0.5)'
          : '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        transition: 'background 0.3s, border-color 0.3s',
        boxShadow: isSelected
          ? '0 0 30px rgba(99,102,241,0.25), inset 0 0 20px rgba(99,102,241,0.05)'
          : 'none',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          gsap.to(e.currentTarget, {
            borderColor: 'rgba(99,102,241,0.3)',
            background: 'rgba(99,102,241,0.05)',
            duration: 0.3,
          })
        }
      }}
    >
      {/* Selected glow accent */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)',
          }}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <span
          style={{
            fontSize: compact ? '1rem' : '1.2rem',
            color: isSelected ? '#818cf8' : 'rgba(99,102,241,0.4)',
            fontFamily: 'monospace',
            flexShrink: 0,
            marginTop: '2px',
            transition: 'color 0.3s',
          }}
        >
          {option.icon}
        </span>

        <div className="flex-1 min-w-0">
          <div
            style={{
              fontSize: compact ? '0.85rem' : '0.95rem',
              color: isSelected ? '#e2e8f0' : '#94a3b8',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              lineHeight: 1.3,
              transition: 'color 0.3s',
            }}
          >
            {option.label}
          </div>
          {option.desc && !compact && (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#475569',
                marginTop: '4px',
                fontFamily: "'Space Mono', monospace",
                letterSpacing: '0.02em',
              }}
            >
              {option.desc}
            </div>
          )}
        </div>

        {/* Check indicator */}
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '2px',
            border: isSelected ? '1px solid rgba(99,102,241,0.7)' : '1px solid rgba(255,255,255,0.1)',
            background: isSelected ? 'rgba(99,102,241,0.3)' : 'transparent',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
          }}
        >
          {isSelected && (
            <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: '#818cf8' }} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function PollExperience({ uid, onSubmit }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const containerRef = useRef(null)
  const questionRef = useRef(null)
  const progressRef = useRef(null)

  // Animate in the poll container on mount
  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'cubic-bezier(0.16,1,0.3,1)' }
    )
  }, [])

  const transitionToQuestion = useCallback((nextIndex, direction = 1) => {
    const el = questionRef.current
    if (!el) return

    const tl = gsap.timeline()
    tl.to(el, {
      opacity: 0,
      x: direction * -60,
      scale: 0.97,
      filter: 'blur(4px)',
      duration: 0.35,
      ease: 'power2.in',
    }).call(() => {
      setCurrentQ(nextIndex)
    }).fromTo(el,
      { opacity: 0, x: direction * 80, scale: 0.97, filter: 'blur(4px)' },
      { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, ease: 'cubic-bezier(0.16,1,0.3,1)' }
    )
  }, [])

  const selectOption = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))

    // Auto-advance after brief delay
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        transitionToQuestion(currentQ + 1, 1)
      }
    }, 380)
  }

  const goBack = () => {
    if (currentQ > 0) transitionToQuestion(currentQ - 1, -1)
  }

  const q = QUESTIONS[currentQ]
  const progress = ((currentQ) / QUESTIONS.length) * 100
  const isCompact = q.options.length > 4

  const allAnswered = QUESTIONS.every(q => answers[q.id])
  const currentAnswered = answers[q.id]
  const isLast = currentQ === QUESTIONS.length - 1

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ position: 'relative', zIndex: 10 }}
    >
      <div style={{ width: '100%', maxWidth: '720px' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="font-mono text-xs" style={{ color: 'rgba(99,102,241,0.5)', letterSpacing: '0.15em' }}>
            ELITELIFE · ASSESSMENT
          </div>
          <div className="font-mono text-xs" style={{ color: 'rgba(99,102,241,0.4)' }}>
            {String(currentQ + 1).padStart(2, '0')} / {String(QUESTIONS.length).padStart(2, '0')}
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '1px',
            marginBottom: '48px',
            overflow: 'hidden',
          }}
        >
          <div
            ref={progressRef}
            style={{
              height: '100%',
              width: `${((currentQ + (currentAnswered ? 1 : 0)) / QUESTIONS.length) * 100}%`,
              background: 'linear-gradient(90deg, #6366f1, #818cf8)',
              transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
              boxShadow: '0 0 10px rgba(99,102,241,0.5)',
            }}
          />
        </div>

        {/* Question */}
        <div ref={questionRef}>
          {/* Question number */}
          <div
            className="font-mono text-xs mb-4"
            style={{ color: 'rgba(99,102,241,0.5)', letterSpacing: '0.25em' }}
          >
            QUESTION {q.num}
          </div>

          {/* Question text */}
          <h2
            className="font-display font-light mb-10"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
              color: '#e2e8f0',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {q.question}
          </h2>

          {/* Options grid */}
          <div
            className={isCompact ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}
          >
            {q.options.map((option) => (
              <OptionCard
                key={option.value}
                option={option}
                isSelected={answers[q.id] === option.value}
                onClick={() => selectOption(q.id, option.value)}
                compact={isCompact}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={goBack}
              style={{
                display: currentQ === 0 ? 'none' : 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '2px',
                color: '#475569',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                cursor: 'none',
              }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.2)', color: '#94a3b8', duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.08)', color: '#475569', duration: 0.2 })}
              onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1 })}
              onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
            >
              ← BACK
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentQ ? '24px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: answers[QUESTIONS[i].id]
                      ? '#6366f1'
                      : i === currentQ
                        ? 'rgba(99,102,241,0.4)'
                        : 'rgba(255,255,255,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              ))}
            </div>

            {isLast && currentAnswered && (
              <button
                onClick={() => onSubmit(answers)}
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))',
                  border: '1px solid rgba(99,102,241,0.5)',
                  borderRadius: '2px',
                  color: '#e2e8f0',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'none',
                }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { boxShadow: '0 0 30px rgba(99,102,241,0.4)', borderColor: 'rgba(99,102,241,0.8)', duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { boxShadow: 'none', borderColor: 'rgba(99,102,241,0.5)', duration: 0.3 })}
                onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1 })}
                onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
              >
                Submit Signal →
              </button>
            )}

            {!isLast && currentAnswered && (
              <button
                onClick={() => transitionToQuestion(currentQ + 1, 1)}
                style={{
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '2px',
                  color: '#818cf8',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  cursor: 'none',
                }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(99,102,241,0.6)', duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(99,102,241,0.3)', duration: 0.2 })}
                onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1 })}
                onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
              >
                NEXT →
              </button>
            )}

            {!currentAnswered && !isLast && currentQ !== 0 && (
              <div />
            )}
          </div>
        </div>

        {/* UID warning */}
        {!uid && (
          <div
            className="mt-8 text-center font-mono text-xs"
            style={{ color: 'rgba(239,68,68,0.5)', letterSpacing: '0.1em' }}
          >
            ⚠ No user identifier detected in URL. Submission may fail.
          </div>
        )}
      </div>
    </div>
  )
}
