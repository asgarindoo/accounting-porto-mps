import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePortfolio } from '../context/PortfolioContext';
import { Icon } from '../components/Icon';
import { analyticsService } from '../services/analyticsService';

export function ProjectDetail() {
  const { id } = useParams();
  const { projects } = usePortfolio();
  const [project, setProject] = useState(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (projects && projects.length > 0) {
      const found = projects.find(p => p.id === id);
      setProject(found);
      
      if (found && !trackedRef.current) {
        analyticsService.trackEvent('project_view', found.title);
        trackedRef.current = true;
      }
    }
  }, [id, projects]);

  const { siteSettings } = usePortfolio();

  useEffect(() => {
    if (project) {
      document.title = `${project.title} - Project | ${siteSettings?.site_title || 'Portfolio'}`;
    }
  }, [project, siteSettings]);

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading project...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Safe URL parser
  const getDomain = (url) => {
    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  };

  const safeLink = project.link && (!project.link.startsWith('http') ? 'https://' + project.link : project.link);
  const hasContent = project.content && project.content.trim() !== '<p><br></p>';

  return (
    <div className="project-detail-page">
      <main className="project-detail-main">
        {/* ... header code untouched up to the github-repo-title-row ... */}
        <div className="github-repo-header">
          <div className="container github-repo-header-inner" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>

              <Link to="/#projects" className="github-back-button" title="Back to Projects">
                <ArrowLeft size={18} />
              </Link>

              <div className="github-repo-title-row" style={{ marginLeft: '16px' }}>
                <Icon name="BookOpen" size={18} className="text-muted" />
                <Link to="/#projects" className="github-repo-owner">Project</Link>
                <span className="github-repo-separator">/</span>
                <h1 className="github-repo-name">{project.title}</h1>
                <span className="github-badge">Public</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="project-detail-layout">

            {/* Main Content Area */}
            <div className="project-detail-main-col">
              <div className="github-readme-body markdown-body" style={{ padding: 0 }}>
                {project.image && (
                  <img src={project.image} alt={project.title} style={{ marginTop: 0 }} />
                )}

                {hasContent && (
                  <div className="html-content" dangerouslySetInnerHTML={{ __html: project.content.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '').replace(/\u00A0/g, ' ').replace(/&nbsp;/g, ' ') }} />
                )}
              </div>
            </div>

            {/* Sidebar Area */}
            <aside className="project-detail-sidebar">
              <div className="github-sidebar-section">
                <h3 className="github-sidebar-heading">About</h3>
                <p className="github-sidebar-desc">{project.description?.replace(/\u00A0/g, ' ')}</p>

                {project.link && (
                  <div className="github-sidebar-meta" style={{ marginTop: '16px' }}>
                    <Icon name="Link" size={16} className="text-muted" />
                    <a href={safeLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', wordBreak: 'break-all' }}>
                      {project.link}
                    </a>
                  </div>
                )}

                {project.featured && (
                  <div className="github-sidebar-meta">
                    <Icon name="Star" size={16} className="text-muted" />
                    <span>Featured Project</span>
                  </div>
                )}
              </div>

              {project.tags && project.tags.length > 0 && (
                <div className="github-sidebar-section">
                  <h3 className="github-sidebar-heading">Topics</h3>
                  <div className="github-sidebar-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="github-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
