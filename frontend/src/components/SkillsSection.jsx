import { usePortfolio } from '../context/PortfolioContext'
import { useScrollReveal, useScrollRevealGroup } from '../hooks/useScrollReveal'
import { Icon } from './Icon'

export function SkillsSection() {
  const { skills, siteSettings } = usePortfolio()
  const headerRef = useScrollReveal()
  const gridRef = useScrollRevealGroup()

  return (
    <section id="skills" className="section section--alt">
      <div className="container">
        <div ref={headerRef} className="section__header reveal">
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            Skills
          </div>
          <h2 className="section__title">{siteSettings.skills_title || 'A toolkit built around discipline.'}</h2>
          <p className="section__subtitle">
            {siteSettings.skills_subtitle || 'A modern accounting stack — from ledgers to dashboards — supported by the analytical fundamentals that keep every number honest.'}
          </p>
        </div>

        <div ref={gridRef} className="skills__grid">
          {skills.map((skill, index) => (
            <SkillItem key={index} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * SkillItem — reusable card for a single skill entry.
 * Extracted as a named export so the Admin dashboard can reuse it in a live preview.
 */
export function SkillItem({ skill }) {
  return (
    <div className="skill-item reveal">
      <div className="skill-item__icon">
        <Icon name={skill.icon} size={22} strokeWidth={1.5} />
      </div>
      <div className="skill-item__content">
        <h3 className="skill-item__title">{skill.title}</h3>
        <div className="skill-item__subtitle">{skill.subtitle}</div>
      </div>
    </div>
  )
}
