import { Link } from 'react-router-dom'
import { usePortfolio } from '../context/PortfolioContext'
import { useScrollReveal, useScrollRevealGroup } from '../hooks/useScrollReveal'
import { Icon } from './Icon'

export function ProjectsSection() {
  const { projects, siteSettings } = usePortfolio()
  const headerRef = useScrollReveal()
  const gridRef = useScrollRevealGroup()

  return (
    <section id="projects" className="section section--alt">
      <div className="container">
        <div ref={headerRef} className="section__header reveal">
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            Featured Case Studies
          </div>
          <h2 className="section__title">{siteSettings.projects_title || 'Projects'}</h2>
          <p className="section__subtitle">
            {siteSettings.projects_subtitle}
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

/**
 * ProjectCard — reusable card for a single project entry.
 * Extracted as a named export so the Admin dashboard can render a live preview
 * of a project while it is being edited.
 */
export function ProjectCard({ project }) {
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
        <p className="project-card__desc">{project.description?.replace(/\u00A0/g, ' ')}</p>

        <div className="project-card__footer">
          {project.tags && project.tags.length > 0 && (
            <div className="project-card__tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-card__tag">{tag}</span>
              ))}
            </div>
          )}
          <div style={{ marginTop: '12px', width: '100%' }}>
            <Link className="project-card__link" to={`/project/${project.id}`}>
              View Details
              <Icon name="ArrowUpRight" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
