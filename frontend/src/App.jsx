import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

import { LandingPage } from './pages/LandingPage'
import { ProjectDetail } from './pages/ProjectDetail'
import { AchievementDetail } from './pages/AchievementDetail'
import { AdminLayout } from './layouts/AdminLayout'
import { Dashboard } from './pages/admin/Dashboard'
import { ProjectsAdmin } from './pages/admin/ProjectsAdmin'
import { ExperiencesAdmin } from './pages/admin/ExperiencesAdmin'
import { SkillsAdmin } from './pages/admin/SkillsAdmin'
import { AchievementsAdmin } from './pages/admin/AchievementsAdmin'
import { HeroAdmin } from './pages/admin/HeroAdmin'
import { AboutAdmin } from './pages/admin/AboutAdmin'
import { SettingsAdmin } from './pages/admin/SettingsAdmin'
import { ResumeAdmin } from './pages/admin/ResumeAdmin'
import { ContactAdmin } from './pages/admin/ContactAdmin'

// Auth Pages
import { LoginPage } from './pages/admin/LoginPage'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ─── Public Routes ─── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/achievement/:id" element={<AchievementDetail />} />

          {/* ─── Auth Routes (public) ─── */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* ─── Protected Admin Routes ─── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="experiences" element={<ExperiencesAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="achievements" element={<AchievementsAdmin />} />
            <Route path="hero" element={<HeroAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="resume" element={<ResumeAdmin />} />
            <Route path="contact" element={<ContactAdmin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}
