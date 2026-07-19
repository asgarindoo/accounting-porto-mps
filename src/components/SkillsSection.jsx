import { skills } from '../data'
import { useScrollReveal, useScrollRevealGroup } from '../hooks/useScrollReveal'
import { Icon } from './Icon'

export function SkillsSection() {
  const headerRef = useScrollReveal()
  const gridRef = useScrollRevealGroup()

  return (
    <section className="section">
      <div className="container">
        <div ref={headerRef} className="section__header reveal">
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            Skills
          </div>
          <h2 className="section__title">A toolkit built around discipline.</h2>
          <p className="section__subtitle">
            A modern accounting stack — from ledgers to dashboards — supported
            by the analytical fundamentals that keep every number honest.
          </p>
        </div>

        <div ref={gridRef} className="skills__grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item reveal">
              <div className="skill-item__icon">
                <Icon name={skill.icon} size={22} strokeWidth={1.5} />
              </div>
              <div className="skill-item__content">
                <h3 className="skill-item__title">{skill.title}</h3>
                <div className="skill-item__subtitle">{skill.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
