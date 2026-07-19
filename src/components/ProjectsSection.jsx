import { projects } from '../data'
import { useScrollReveal, useScrollRevealGroup } from '../hooks/useScrollReveal'
import { Icon } from './Icon'

export function ProjectsSection() {
  const headerRef = useScrollReveal()
  const gridRef = useScrollRevealGroup()

  return (
    <section className="section">
      <div className="container">
        <div ref={headerRef} className="section__header reveal">
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            Featured Case Studies
          </div>
          <h2 className="section__title">
            Selected work — where analysis meets clarity.
          </h2>
          <p className="section__subtitle">
            Coursework and independent projects that translate financial concepts
            into structured decision-ready insight.
          </p>
        </div>

        <div ref={gridRef} className="projects__grid">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  return (
    <article className={`project-card reveal ${project.featured ? 'project-card--featured' : ''}`}>
      <div className="project-card__img-wrap">
        <img
          src={project.image}
          alt={project.title}
          className="project-card__img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.querySelector('.project-card__img-placeholder').style.display = 'grid'
          }}
        />
        <div
          className="project-card__img-placeholder"
          style={{ display: 'none' }}
        >
          📊
        </div>
        <div className="project-card__img-overlay" />
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>

        <div className="project-card__footer">
          <div className="project-card__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-card__tag">{tag}</span>
            ))}
          </div>
          <button className="project-card__link" type="button">
            View Details
            <Icon name="ArrowUpRight" size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}
