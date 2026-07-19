import { useState, useEffect } from 'react'
import { navLinks, profile } from '../data'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#about')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach((s) => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header className="navbar">
        <nav
          className="navbar__inner"
          style={{
            opacity: scrolled ? 1 : 0.95,
            transform: 'none',
            justifyContent: 'center'
          }}
        >
          <div className="navbar__links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`navbar__link ${active === link.href ? 'navbar__link--active' : ''}`}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <a href="#contact" className="navbar__cta">
            Get in touch
          </a>

          <button
            className="navbar__menu-btn"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span style={{ transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
          </button>
        </nav>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-menu__link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
