import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { AboutSection } from './components/AboutSection'
import { ExperienceSection } from './components/ExperienceSection'
import { ProjectsSection } from './components/ProjectsSection'
import { AchievementsSection } from './components/AchievementsSection'
import { SkillsSection } from './components/SkillsSection'
import { ResumeSection, ContactSection } from './components/ResumeAndContact'
import { Footer } from './components/Footer'

export default function App() {
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
