import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, Link as LinkIcon } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePortfolio } from '../context/PortfolioContext';
import { analyticsService } from '../services/analyticsService';

export function AchievementDetail() {
  const { id } = useParams();
  const { achievements, siteSettings } = usePortfolio();
  const [item, setItem] = useState(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (achievements && achievements.length > 0) {
      const found = achievements.find(a => a.id === id);
      setItem(found);

      if (found && !trackedRef.current) {
        analyticsService.trackEvent('achievement_view', found.title);
        trackedRef.current = true;
      }
    }
  }, [id, achievements]);

  useEffect(() => {
    if (item) {
      document.title = `${item.title} - Achievement | ${siteSettings?.site_title || 'Portfolio'}`;
    }
  }, [item, siteSettings]);

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading achievement...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="achievement-detail-page">
      <main className="project-detail-main">
        {/* GitHub Style Header Area */}
        <div className="github-repo-header">
          <div className="container github-repo-header-inner" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
              <Link to="/#achievements" className="github-back-button" title="Back to Achievements">
                <ArrowLeft size={18} />
              </Link>

              <div className="github-repo-title-row" style={{ marginLeft: '16px' }}>
                <Award size={18} className="text-muted" />
                <Link to="/#achievements" className="github-repo-owner">Achievement</Link>
                <span className="github-repo-separator">/</span>
                <h1 className="github-repo-name">{item.title}</h1>
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
                {item.image && (
                  <img src={item.image} alt={item.title} style={{ marginTop: 0 }} />
                )}

                {item.content ? (
                  <div className="html-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                ) : (
                  <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{item.description}</p>
                )}
              </div>
            </div>

            {/* Sidebar Area */}
            <aside className="project-detail-sidebar">
              <div className="github-sidebar-section">
                <h3 className="github-sidebar-heading">About</h3>
                <p className="github-sidebar-desc">{item.subtitle}</p>
                <p className="github-sidebar-desc">{item.description}</p>

                {item.link && (
                  <div className="github-sidebar-meta">
                    <LinkIcon size={16} className="text-muted" />
                    <a href={item.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{new URL(item.link).hostname}</a>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
