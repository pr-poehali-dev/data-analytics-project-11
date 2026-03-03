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