import { achievements } from '../data'
import { useScrollReveal, useScrollRevealGroup } from '../hooks/useScrollReveal'
import { Icon } from './Icon'

export function AchievementsSection() {
  const headerRef = useScrollReveal()
  const gridRef = useScrollRevealGroup()

  return (
    <section id="achievements" className="section section--alt">
      <div className="container">
        <div ref={headerRef} className="section__header reveal">
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            Achievements
          </div>
          <h2 className="section__title">
            Milestones that mark the pursuit of mastery.
          </h2>
        </div>

        <div ref={gridRef} className="achievements__grid">
          {achievements.map((item, index) => (
            <div key={index} className="achievement-card reveal">
              <div className="achievement-card__content">
                <h3 className="achievement-card__title">{item.title}</h3>
                <span className="achievement-card__subtitle">{item.subtitle}</span>
                <p className="achievement-card__desc">{item.description}</p>
                {item.image && (
                  <div style={{ marginTop: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
