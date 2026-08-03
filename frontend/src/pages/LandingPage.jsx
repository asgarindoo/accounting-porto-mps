import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { HeroSection } from '../components/HeroSection'
import { AboutSection } from '../components/AboutSection'
import { ExperienceSection } from '../components/ExperienceSection'
import { ProjectsSection } from '../components/ProjectsSection'
import { AchievementsSection } from '../components/AchievementsSection'
import { SkillsSection } from '../components/SkillsSection'
import { ResumeSection, ContactSection } from '../components/ResumeAndContact'
import { Footer } from '../components/Footer'
import { usePortfolio } from '../context/PortfolioContext'
import { analyticsService } from '../services/analyticsService'

export function LandingPage() {
  const { refetch, siteSettings, achievements, projects } = usePortfolio()
  const location = useLocation()

  // Track page view once per session
  useEffect(() => {
    if (!sessionStorage.getItem('tracked_view')) {
      analyticsService.trackEvent('page_view');
      sessionStorage.setItem('tracked_view', 'true');
    }
    
    // Initialize time-on-site tracker
    analyticsService.initSessionDurationTracker();
  }, []);

  // Re-fetch portfolio data every time the landing page is visited
  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (siteSettings?.site_title) {
      document.title = siteSettings.site_title;
    }
  }, [siteSettings])

  // Handle Hash Scrolling when returning from another page
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const attemptScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          // Adjust for fixed navbar by scrolling a bit higher
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      };
      
      // Delay slightly to let the fetched data render in the DOM
      const timer = setTimeout(attemptScroll, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash, achievements, projects]); // re-run if data populates

  return (
    <div>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <AchievementsSection />
        <SkillsSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
