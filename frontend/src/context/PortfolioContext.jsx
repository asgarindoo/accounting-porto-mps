import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

/**
 * PortfolioContext — single source of truth for all portfolio data.
 *
 * Now fetched dynamically from the Express backend API.
 * Exposes a `refetch` function so pages can trigger a data refresh.
 */
const PortfolioContext = createContext(null)

const DEFAULT_DATA = {
  profile: {
    headline: [],
    bio: [''],
    stats: [],
    floatingBadges: [],
    socialLinks: [],
    cvUrl: '',
    portraitUrl: ''
  },
  hero: { headline: '', highlight: '', subheadline: '', buttons: [] },
  about: { title: '', description: '', image: '', stats: [] },
  experience: [],
  education: [],
  softSkills: [],
  projects: [],
  skills: [],
  achievements: [],
  resumeSections: [],
  contactLinks: [],
  navLinks: [],
  contact: {
    email: '',
    whatsapp: '',
    linkedin: '',
    location: ''
  },
  siteSettings: {
    hero_description: '',
    about_title: '',
    projects_title: '',
    projects_subtitle: '',
    resume_title: '',
    resume_subtitle: '',
    contact_title: '',
    contact_subtitle: ''
  }
}

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(DEFAULT_DATA)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/portfolio`)
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }, [])

  // Fetch on initial mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Inject dynamic metadata
  useEffect(() => {
    const settings = data.siteSettings;
    if (!settings) return;

    if (settings.site_description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = settings.site_description;
    }
    if (settings.seo_keywords) {
      let metaKw = document.querySelector('meta[name="keywords"]');
      if (!metaKw) {
        metaKw = document.createElement('meta');
        metaKw.name = 'keywords';
        document.head.appendChild(metaKw);
      }
      metaKw.content = settings.seo_keywords;
    }
    if (settings.author_name) {
      let metaAuthor = document.querySelector('meta[name="author"]');
      if (!metaAuthor) {
        metaAuthor = document.createElement('meta');
        metaAuthor.name = 'author';
        document.head.appendChild(metaAuthor);
      }
      metaAuthor.content = settings.author_name;
    }
    if (settings.seo_robots) {
      let metaRobots = document.querySelector('meta[name="robots"]');
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        document.head.appendChild(metaRobots);
      }
      metaRobots.content = settings.seo_robots;
    }
    if (settings.seo_canonical) {
      let linkCanon = document.querySelector('link[rel="canonical"]');
      if (!linkCanon) {
        linkCanon = document.createElement('link');
        linkCanon.rel = 'canonical';
        document.head.appendChild(linkCanon);
      }
      linkCanon.href = settings.seo_canonical;
    }
    if (settings.site_favicon) {
      let linkIcon = document.querySelector("link[rel~='icon']");
      if (!linkIcon) {
        linkIcon = document.createElement('link');
        linkIcon.rel = 'icon';
        document.head.appendChild(linkIcon);
      }
      linkIcon.href = settings.site_favicon;
    }
  }, [data.siteSettings]);

  if (error && data === DEFAULT_DATA) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <p>Error loading portfolio: {error}</p>
      </div>
    )
  }

  return (
    <PortfolioContext.Provider value={{ ...data, refetch: fetchData }}>
      {children}
    </PortfolioContext.Provider>
  )
}

/**
 * usePortfolio — convenience hook to consume portfolio data from any component.
 * Throws a clear error if used outside PortfolioProvider.
 */
export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a <PortfolioProvider>')
  }
  return context
}
