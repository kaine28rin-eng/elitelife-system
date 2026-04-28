import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import ThreeBackground from './components/ThreeBackground'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import ScrollSections from './components/ScrollSections'
import PollExperience from './components/PollExperience'
import LoadingScreen from './components/LoadingScreen'
import ResultScreen from './components/ResultScreen'
import { submitPollData } from './utils/supabase'

gsap.registerPlugin(ScrollTrigger)

// App phases
const PHASE = {
  LANDING: 'landing',
  POLL: 'poll',
  LOADING: 'loading',
  RESULT: 'result',
  ERROR: 'error',
}

export default function App() {
  const [phase, setPhase] = useState(PHASE.LANDING)
  const [answers, setAnswers] = useState({})
  const [errorMsg, setErrorMsg] = useState('')
  const mainRef = useRef(null)
  const pollRef = useRef(null)
  const noiseRef = useRef(null)

  // Extract uid from URL
  const uid = new URLSearchParams(window.location.search).get('uid') || null

  // Transition from landing/scroll → poll
  const enterPoll = useCallback(() => {
    // Kill all scroll triggers
    ScrollTrigger.getAll().forEach(t => t.kill())

    const tl = gsap.timeline()
    tl.to(mainRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }).call(() => {
      setPhase(PHASE.POLL)
      window.scrollTo(0, 0)
    }).to(mainRef.current, {
      opacity: 1,
      duration: 0.5,
    })
  }, [])

  // Submit answers
  const handleSubmit = useCallback(async (pollAnswers) => {
    setAnswers(pollAnswers)
    setPhase(PHASE.LOADING)

    // Minimum loading time for cinematic feel
    const minLoadTime = new Promise(res => setTimeout(res, 2800))

    try {
      const submitPromise = submitPollData({
        user_id: uid,
        need: pollAnswers.need,
        difficulty_module: pollAnswers.difficulty_module,
        weak_module: pollAnswers.weak_module,
        level: pollAnswers.level,
        study_method: pollAnswers.study_method,
      })

      await Promise.all([submitPromise, minLoadTime])

      setPhase(PHASE.RESULT)
    } catch (err) {
      await minLoadTime
      if (err.message === 'DUPLICATE_USER') {
        setErrorMsg('Your signal has already been recorded. Each student submits once.')
      } else if (!uid) {
        // No UID — still show result (graceful degradation for demo)
        setPhase(PHASE.RESULT)
        return
      } else {
        setErrorMsg('Connection failed. Your signal could not be transmitted.')
      }
      setPhase(PHASE.ERROR)
    }
  }, [uid])

  // Phase transition effect
  useEffect(() => {
    if (phase === PHASE.POLL || phase === PHASE.RESULT) {
      window.scrollTo(0, 0)
    }
  }, [phase])

  return (
    <>
      {/* Three.js background — always present */}
      <ThreeBackground />

      {/* Noise overlay */}
      <div
        ref={noiseRef}
        className="noise-overlay"
        style={{ zIndex: 0 }}
      />

      {/* Scan line */}
      <div className="scanline" />

      {/* Custom cursor */}
      <Cursor />

      {/* === LOADING OVERLAY === */}
      {phase === PHASE.LOADING && <LoadingScreen />}

      {/* === MAIN CONTENT === */}
      <main ref={mainRef} style={{ position: 'relative', zIndex: 1 }}>

        {/* === LANDING + SCROLL === */}
        {phase === PHASE.LANDING && (
          <>
            <Hero onEnter={() => {
              // Smooth scroll to scroll sections
              window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })
            }} />
            <ScrollSections onScrollComplete={enterPoll} />
          </>
        )}

        {/* === POLL === */}
        {phase === PHASE.POLL && (
          <PollExperience
            uid={uid}
            onSubmit={handleSubmit}
          />
        )}

        {/* === RESULT === */}
        {phase === PHASE.RESULT && (
          <ResultScreen answers={answers} />
        )}

        {/* === ERROR === */}
        {phase === PHASE.ERROR && (
          <div
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <div
              className="glass-strong"
              style={{ padding: '64px 48px', borderRadius: '4px', maxWidth: '520px' }}
            >
              <div
                className="font-mono text-xs mb-6"
                style={{ color: 'rgba(239,68,68,0.5)', letterSpacing: '0.2em' }}
              >
                TRANSMISSION ERROR
              </div>
              <h2
                className="font-display font-light mb-6"
                style={{ fontSize: '2rem', color: '#e2e8f0' }}
              >
                Signal lost.
              </h2>
              <p
                className="font-body mb-8"
                style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.7' }}
              >
                {errorMsg}
              </p>
              <button
                onClick={() => {
                  setPhase(PHASE.LANDING)
                  setAnswers({})
                }}
                style={{
                  padding: '12px 32px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  color: '#94a3b8',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  cursor: 'none',
                }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.3)', color: '#e2e8f0', duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8', duration: 0.2 })}
              >
                Return to base
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
