'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function DashboardWithOverlayComponent() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayContent, setOverlayContent] = useState<string>('')
  const [overlayType, setOverlayType] = useState<'iframe' | 'contact'>('iframe')
  const [countdown, setCountdown] = useState<number | null>(null)

  const OVERLAY_TIMEOUT = 20000; // 20 Sekunden
  const COUNTDOWN_START = 5; // Countdown startet bei 3 Sekunden

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let overlayTimer: NodeJS.Timeout | null = null;
    let countdownTimer: NodeJS.Timeout | null = null;

    if (showOverlay) {
      overlayTimer = setTimeout(() => {
        setShowOverlay(false)
      }, OVERLAY_TIMEOUT)

      countdownTimer = setTimeout(() => {
        setCountdown(COUNTDOWN_START)
      }, OVERLAY_TIMEOUT - COUNTDOWN_START * 1000)
    }

    return () => {
      if (overlayTimer) clearTimeout(overlayTimer)
      if (countdownTimer) clearTimeout(countdownTimer)
    }
  }, [showOverlay])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  }

  const buttons = [
    { name: 'Raumplan', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { name: 'Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Kontakt', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ]

  const seconds = currentTime.getSeconds()
  const progress = (seconds / 60) * 360

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 animate-gradient-xy"></div>
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white border-opacity-20">
          <div className="p-8 flex flex-col items-center">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Herzlich Willkommen</h1>
            <p className="text-xl text-white mb-8 opacity-80">Berufliche Schule Elmshorn</p>
            
            <div className="relative w-64 h-64 mb-2">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="10"
                  strokeDasharray={`${progress} 360`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <div className="text-white text-5xl font-bold">{formatTime(currentTime)}</div>
              </div>
            </div>
            
            <div className="text-white text-lg opacity-80 mb-8">{formatDate(currentTime)}</div>
            
            <div className="grid grid-cols-3 gap-6 w-full max-w-lg">
              {buttons.map((button) => (
                <motion.button
                  key={button.name}
                  className={`bg-white bg-opacity-20 rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 ${activeButton === button.name ? 'bg-opacity-40 scale-105' : ''}`}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveButton(button.name)
                    if (button.name === 'Raumplan') {
                      setOverlayContent('https://mybseplapagefri.vercel.app/')
                      setOverlayType('iframe')
                      setShowOverlay(true)
                    } else if (button.name === 'Info') {
                      setOverlayContent('https://www.bs-elmshorn.de/')
                      setOverlayType('iframe')
                      setShowOverlay(true)
                    } else if (button.name === 'Kontakt') {
                      setOverlayType('contact')
                      setShowOverlay(true)
                    }
                  }}
                >
                  <svg className="w-10 h-10 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={button.icon} />
                  </svg>
                  <span className="text-lg font-medium text-white">{button.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowOverlay(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-white rounded-lg shadow-xl ${overlayType === 'iframe' ? 'w-full h-full' : 'max-w-md'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`relative ${overlayType === 'iframe' ? 'w-full h-full' : 'p-8'}`}>
                {overlayType === 'iframe' ? (
                  <iframe
                    src={overlayContent}
                    className="w-full h-full border-none"
                    title="Overlay Content"
                  />
                ) : (
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Kontakt</h2>
                    <p className="text-xl mb-4">Wenn wir Ihr Interesse geweckt haben und Sie sich bewerben möchten oder zusätzliche Informationen wünschen, können Sie uns gerne kontaktieren unter:</p>
                    <a href="mailto:info@bs-elmshorn.de" className="text-2xl text-blue-600 hover:underline">info@bs-elmshorn.de</a>
                  </div>
                )}
                
                {countdown !== null && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
                    {countdown}
                  </div>
                )}

                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 z-10"
                  onClick={() => setShowOverlay(false)}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}