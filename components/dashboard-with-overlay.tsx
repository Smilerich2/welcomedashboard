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
  normal: '/logo.png',
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
        <div className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white border-opacity-20 p-8">

          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight text-center">Herzlich Willkommen</h1>
          <p className="text-xl text-white mb-8 opacity-80 text-center">Berufliche Schule Elmshorn</p>
          <div className="text-white text-5xl font-bold text-center mb-4">{formatTime(currentTime)}</div>
          <div className="text-white text-lg opacity-80 mb-4 text-center">{formatDate(currentTime)}</div>          
          
          <div className="flex justify-center gap-6 w-full max-w-lg mx-auto">
            {buttons.map((button) => (
              <motion.button
                key={button.name}
                className="bg-white bg-opacity-20 rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 flex-1"
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
                <svg className="w-10 h-10 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={button.icon} />
                </svg>
                <span className="text-lg font-medium text-white">{button.name}</span>
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
          width={150}  // Erhöht von 100 auf 150 (50% größer)
          height={150} // Erhöht von 100 auf 150 (50% größer)
          className="w-auto h-auto" // Erlaubt dem Bild, sein natürliches Seitenverhältnis beizubehalten
        />
      </div>

      <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
        {(Object.keys(backgrounds) as Array<keyof typeof backgrounds>).map((bg) => (
          <button
            key={bg}
            className={`w-10 h-10 rounded-full ${
              background === bg ? 'bg-white text-black' : 'bg-black bg-opacity-50 text-white'
            } transition-colors duration-200 hover:bg-opacity-75 flex items-center justify-center`}
            onClick={() => handleBackgroundChange(bg)}
            title={bg.charAt(0).toUpperCase() + bg.slice(1)}
          >
            <div className="flex items-center justify-center w-full h-full">
              <Image
                src={backgroundIcons[bg]}
                alt={`${bg} icon`}
                width={20}
                height={20}
                className="w-5 h-5"
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