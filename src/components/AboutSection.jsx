import { profile, education, softSkills } from '../data'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Icon } from './Icon'

export function AboutSection() {
  const headerRef = useScrollReveal()
  const leftRef = useScrollReveal()
  const rightRef = useScrollReveal()

  return (
    <section id="about" className="section">
      <div className="container">
        <div ref={headerRef} className="section__header reveal">
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            About Me
          </div>
          <h2 className="section__title">
            A precise mind for numbers, a steady hand for business.
          </h2>
        </div>

        <div className="about__grid">
          {/* Left — Bio + Objective */}
          <div ref={leftRef} className="reveal">
            <div className="about__text">
              {profile.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Right — Education + Soft Skills */}
          <div ref={rightRef} className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <div className="card__label">
                <Icon name="GraduationCap" size={14} />
                Education
              </div>
              <div className="education__list">
                {education.map((item, i) => (
                  <div key={i} className="education__item">
                    <div className="education__degree">{item.degree}</div>
                    <div className="education__school">{item.institution}</div>
                    <div className="education__meta">
                      {item.period}
                      {item.detail && ` · ${item.detail}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card__label">
                <Icon name="ShieldCheck" size={14} />
                Soft Skills
              </div>
              <div className="skills-tags">
                {softSkills.map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
