import { useEffect, useRef } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import { Icon } from './Icon'

export function HeroSection() {
  const { profile, siteSettings } = usePortfolio()
  const textRef = useRef(null)
  const imgRef = useRef(null)
  const badgesRef = useRef(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      textRef.current?.classList.add('visible')
      setTimeout(() => {
        imgRef.current?.classList.add('visible')
        setTimeout(() => {
          badgesRef.current
            ?.querySelectorAll('.floating-badge')
            .forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100)
            })
        }, 200)
      }, 150)
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  const renderHeadline = (parts) =>
    parts.map((part, i) => {
      if (typeof part === 'string') return <span key={i} style={{ display: 'block' }}>{part}</span>
      return (
        <span key={i} className="hero__heading-highlight" style={{ display: 'block' }}>
          <span>{part.highlight}</span>
        </span>
      )
    })

  return (
    <section id="top" className="hero">
      <div className="hero__grid-bg" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__content">
        {/* Left — Text */}
        <div ref={textRef} className="reveal">
          <h1 className="hero__heading">
            {renderHeadline(profile.headline)}
          </h1>

          <p className="hero__subtext">{siteSettings.hero_description}</p>

          <div className="hero__actions">
            <a href="#resume" className="btn-primary">
              <Icon name="Download" size={16} />
              Download CV
            </a>
            <a href="#contact" className="btn-secondary">
              Contact Me
              <Icon name="ArrowUpRight" size={16} />
            </a>
          </div>

          <div className="hero__stats">
            {profile.stats.map((stat) => (
              <div key={stat.label}>
                <div className="hero__stat-value">{stat.value}</div>
                <div className="hero__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Portrait */}
        <div className="hero__portrait-wrap" ref={badgesRef}>
          <div className="hero__portrait-deco-1" />
          <div className="hero__portrait-deco-2" />
          <div className="hero__portrait-deco-3" />

          <div ref={imgRef} className="hero__portrait-card reveal-scale">
            {profile.portrait ? (
              <img
                src={profile.portrait}
                alt={`Portrait of ${profile.name}`}
                className="hero__portrait-img"
                width={1024}
                height={1280}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              style={{
                display: profile.portrait ? 'none' : 'flex',
                width: '100%',
                minHeight: '520px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '180px',
                height: '180px',
                background: 'var(--surface-hover)',
                border: '2px dashed var(--border)',
                borderRadius: '50%',
                color: 'var(--text-disabled)',
              }}>
                <Icon name="ImageOff" size={48} />
              </div>
            </div>
            <div className="hero__portrait-gradient" />
          </div>

          {profile.floatingBadges.map((badge, i) => (
            <div key={i} className="floating-badge reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="floating-badge__icon">
                <Icon name={badge.icon} size={14} />
              </span>
              <span style={{ paddingRight: '4px' }}>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
