'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const backgrounds = {
  normal: '/europa.mp4',
  herbst: '/herbst.mp4',
  winter: '/snow.mp4'
}

const backgroundIcons = {
  normal: '/euheart.svg',
  herbst: '/pumpkin.svg',
  winter: '/snowman.svg'
}

const logos = {
  normal: '/Logo.png',
  herbst: '/logo_herbst.png',
  winter: '/logo_winter.png'
}

export function DashboardWithOverlayComponent() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayContent, setOverlayContent] = useState<string>('')
  const [overlayType, setOverlayType] = useState<'iframe' | 'contact'>('iframe')
  const [background, setBackground] = useState<keyof typeof backgrounds>('normal')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = backgrounds[background]
      videoRef.current.play()
    }
  }, [background])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  }

  const buttons = [
    { name: 'Raumplan', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', url: 'https://mybseplapagefri.vercel.app/' },
    { name: 'Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', url: 'https://www.bs-elmshorn.de/' },
    { name: 'Kontakt', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ]

  const handleBackgroundChange = (newBackground: keyof typeof backgrounds) => {
    setBackground(newBackground)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white border-opacity-20 p-4 sm:p-6 md:p-8">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight text-center">Herzlich Willkommen</h1>
          <p className="text-lg sm:text-xl text-white mb-4 sm:mb-6 md:mb-8 opacity-80 text-center">Berufliche Schule Elmshorn</p>
          <div className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 sm:mb-3 md:mb-4">{formatTime(currentTime)}</div>
          <div className="text-white text-sm sm:text-base md:text-lg opacity-80 mb-4 sm:mb-6 md:mb-8 text-center">{formatDate(currentTime)}</div>          
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full max-w-lg mx-auto">
            {buttons.map((button) => (
              <motion.button
                key={button.name}
                className="bg-white bg-opacity-20 rounded-xl p-4 sm:p-6 flex flex-row sm:flex-col items-center justify-center transition-all duration-300 flex-1"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (button.url) {
                    setOverlayContent(button.url)
                    setOverlayType('iframe')
                  } else {
                    setOverlayType('contact')
                  }
                  setShowOverlay(true)
                }}
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white mb-0 sm:mb-2 md:mb-3 mr-3 sm:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={button.icon} />
                </svg>
                <span className="text-base sm:text-lg font-medium text-white">{button.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Logo in der unteren linken Ecke */}
      <div className="absolute bottom-4 left-4 z-20">
        <Image
          src={logos[background]}
          alt="Schullogo"
          width={150}
          height={150}
          className="w-auto h-auto max-h-24 sm:max-h-32 md:max-h-40 lg:max-h-48" // Responsive Größe, größer als zuvor
        />
      </div>

      <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
        {/* Fullscreen-Schalter */}
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black bg-opacity-50 text-white transition-colors duration-200 hover:bg-opacity-75 flex items-center justify-center"
          title={isFullscreen ? "Vollbildmodus beenden" : "Vollbildmodus"}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            )}
          </svg>
        </button>

        {/* Bestehende Hintergrund-Schalter */}
        {(Object.keys(backgrounds) as Array<keyof typeof backgrounds>).map((bg) => (
          <button
            key={bg}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
              background === bg ? 'bg-white text-black' : 'bg-black bg-opacity-50 text-white'
            } transition-colors duration-200 hover:bg-opacity-75 flex items-center justify-center`}
            onClick={() => handleBackgroundChange(bg)}
            title={bg.charAt(0).toUpperCase() + bg.slice(1)}
          >
            <div className="flex items-center justify-center w-full h-full">
              <Image
                src={backgroundIcons[bg]}
                alt={`${bg} icon`}
                width={16}
                height={16}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </div>
          </button>
        ))}
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
                  <iframe src={overlayContent} className="w-full h-full border-none" title="Overlay Content" />
                ) : (
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Kontakt</h2>
                    <p className="text-xl mb-4">Wenn wir Ihr Interesse geweckt haben und Sie sich bewerben möchten oder zusätzliche Informationen wünschen, können Sie uns gerne kontaktieren unter:</p>
                    <a href="mailto:info@bs-elmshorn.de" className="text-2xl text-blue-600 hover:underline">info@bs-elmshorn.de</a>
                  </div>
                )}
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
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