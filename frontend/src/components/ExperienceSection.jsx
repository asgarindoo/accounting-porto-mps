import { usePortfolio } from '../context/PortfolioContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function ExperienceSection() {
  const { experience, siteSettings } = usePortfolio()
  const headerRef = useScrollReveal()

  return (
    <section id="experience" className="section section--alt">
      <div className="container">
        <div ref={headerRef} className="section__header reveal">
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            Experience
          </div>
          <h2 className="section__title">
            {siteSettings.experiences_title || 'A steady path through practice, service and study.'}
          </h2>
          <p className="section__subtitle">
            {siteSettings.experiences_subtitle || 'From audit rooms to student associations, each chapter has sharpened my discipline for numbers and for people.'}
          </p>
        </div>

        <div className="timeline">
          <div className="timeline__line" />
          <div className="timeline__items">
            {experience.map((item, index) => (
              <ExperienceItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * ExperienceItem — reusable timeline card for a single experience entry.
 * Extracted as a named export so the Admin dashboard can reuse it in a live preview.
 */
function ExperienceItem({ item }) {
  const ref = useScrollReveal()
  const isRight = item.align === 'right'

  return (
    <div
      ref={ref}
      className={`timeline__item reveal ${isRight ? 'timeline__item--right' : 'timeline__item--left'}`}
    >
      <span className="timeline__dot">
        <span className="timeline__dot-inner" />
      </span>

      <div className="timeline__meta">
        <span className="timeline__type-badge">{item.type}</span>
        <h3 className="timeline__role">{item.role}</h3>
        <div className="timeline__company">{item.company}</div>
        <div className="timeline__period">{item.period}</div>
      </div>

      <div className="timeline__desc">
        <p>{item.description}</p>
      </div>
    </div>
  )
}
