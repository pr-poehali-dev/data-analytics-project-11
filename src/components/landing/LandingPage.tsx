import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Section from './Section'
import Layout from './Layout'
import { sections } from './sections'

const players = [
  { nick: 'nek0', role: 'IGL' },
  { nick: 'drask3t', role: 'AWPer' },
  { nick: '67', role: 'Entry' },
  { nick: 'mafaGGH', role: 'Rifler' },
  { nick: 'qcold', role: 'Lurker' },
]

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop
        const windowHeight = window.innerHeight
        const newActiveSection = Math.floor(scrollPosition / windowHeight)
        setActiveSection(newActiveSection)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleNavClick = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <Layout>
      <div className="fixed top-0 left-0 z-30 p-6">
        <img
          src="https://cdn.poehali.dev/projects/7a500cdd-bef0-4b51-b0b3-07deaddbde50/bucket/f03c029e-e20a-4be5-8a78-3e7522463c83.jpg"
          alt="K37"
          className="w-20 h-20 object-contain"
        />
      </div>
      <div className="fixed left-6 bottom-0 z-30 flex flex-col items-center gap-4 pb-8">
        <div className="w-px h-24 bg-gradient-to-t from-[#00FF87] to-transparent" />
        <a
          href="https://t.me/k37gg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00FF8760] hover:text-[#00FF87] transition-colors"
          title="Telegram канал K37"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
        <span
          className="text-[#00FF8760] text-xs tracking-[0.4em] uppercase font-mono"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Киберспорт · 2026 · K37
        </span>
      </div>
      <nav className="fixed top-0 right-0 h-screen flex flex-col justify-center z-30 p-4">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`w-3 h-3 rounded-full my-2 transition-all ${
              index === activeSection ? 'bg-[#00FF87] scale-150' : 'bg-gray-600'
            }`}
            onClick={() => handleNavClick(index)}
          />
        ))}
      </nav>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[#00FF87] origin-left z-30"
        style={{ scaleX }}
      />
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
      >
        {sections.map((section, index) => (
          section.id === 'roster' ? (
            <section key="roster" id="roster" className="relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24">
              <motion.h2
                className="text-4xl md:text-6xl lg:text-[5rem] font-bold leading-[1.1] tracking-tight text-white mb-12"
                initial={{ opacity: 0, y: 50 }}
                animate={index === activeSection ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                Состав команды.
              </motion.h2>
              <div className="flex flex-col gap-4 max-w-lg">
                {players.map((player, i) => (
                  <motion.div
                    key={player.nick}
                    className="flex items-center gap-6 border border-[#00FF8730] bg-[#00FF8708] px-6 py-4"
                    initial={{ opacity: 0, x: -40 }}
                    animate={index === activeSection ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <span className="text-[#00FF87] font-mono text-sm w-6 text-right">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-white font-bold text-xl tracking-wide flex-1">{player.nick}</span>
                    <span className="text-neutral-500 text-sm uppercase tracking-widest">{player.role}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          ) : (
            <Section
              key={section.id}
              {...section}
              isActive={index === activeSection}
            />
          )
        ))}
      </div>
    </Layout>
  )
}