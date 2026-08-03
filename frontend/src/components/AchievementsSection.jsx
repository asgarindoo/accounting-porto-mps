import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePortfolio } from '../context/PortfolioContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Icon } from './Icon'
import { Award } from 'lucide-react'

export function AchievementsSection() {
  const { achievements, siteSettings } = usePortfolio()
  const headerRef = useScrollReveal()
  const layoutRef = useScrollReveal()
  
  // State for interactions
  const [hoveredId, setHoveredId] = useState(null)

  // Determine current preview image
  const hoveredAchievement = achievements.find(a => a.id === hoveredId)

  return (
    <section id="achievements" className="section section--alt">
      <div className="container">
        <div ref={headerRef} className="section__header reveal">
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            Achievements
          </div>
          <h2 className="section__title">
            {siteSettings.achievements_title || 'Milestones that mark the pursuit of mastery.'}
          </h2>
          {siteSettings.achievements_subtitle && (
            <p className="section__subtitle">
              {siteSettings.achievements_subtitle}
            </p>
          )}
        </div>

        {/* Editorial Layout */}
        <div ref={layoutRef} className="achievements-editorial reveal" style={{ marginTop: 40 }}>
          
          {/* Left Column: Preview */}
          <div className="achievements-editorial__left">
            <div 
              className="achievements-editorial__preview"
              style={{
                opacity: hoveredId ? 1 : 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }}
            >
              {achievements.map(ach => (
                <img 
                  key={ach.id}
                  src={ach.image} 
                  alt={ach.title}
                  style={{ 
                    opacity: hoveredId === ach.id ? 1 : 0 
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Column: List */}
          <div className="achievements-editorial__list">
            {achievements.map((item) => (
              <Link 
                to={`/achievement/${item.id}`}
                key={item.id} 
                className="editorial-row"
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="editorial-row__content">
                  <h3 className="editorial-row__title">{item.title}</h3>
                  <div className="editorial-row__meta">
                    <Award size={14} />
                    <span>{item.subtitle}</span>
                  </div>
                </div>
                <Icon name="ArrowRight" size={24} className="editorial-row__icon" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

