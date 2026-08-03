import { Outlet, Link, useLocation } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Megaphone,
  Info,
// Removed User
  FolderGit2,
  Briefcase,
  Code,
  GraduationCap,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  FileText,
  Mail,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import './AdminLayout.css';

/* Navigation structure — grouped */
const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Hero', path: '/admin/hero', icon: Megaphone },
      { name: 'About', path: '/admin/about', icon: Info },
      { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
      { name: 'Experience', path: '/admin/experiences', icon: Briefcase },
      { name: 'Skills', path: '/admin/skills', icon: Code },
      { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
      { name: 'Resume', path: '/admin/resume', icon: FileText },
      { name: 'Contact', path: '/admin/contact', icon: Mail },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

/* Bottom nav items (4 most used + More) */
const BOTTOM_NAV = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
  { name: 'Skills', path: '/admin/skills', icon: Code },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

/* Get current page title */
function getPageTitle(pathname) {
  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const match = allItems.find((item) =>
    item.exact ? pathname === item.path : pathname.startsWith(item.path)
  );
  return match?.name || 'Dashboard';
}

function isActive(path, pathname, exact = false) {
  return exact ? pathname === path : pathname === path || pathname.startsWith(path + '/');
}

/* Logout button for sidebar — needs useAuth which requires Router context */
function SidebarLogout() {
  const { session, logout } = useAuth();
  return (
    <button
      className="nav-item"
      onClick={logout}
      title={session?.user?.email}
      style={{ width: '100%', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left', color: 'var(--text-secondary)' }}
    >
      <LogOut size={15} />
      Logout
    </button>
  );
}

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { siteSettings } = usePortfolio();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  const pageTitle = getPageTitle(location.pathname);

  // Update document title and protect Admin from search engines
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} - Admin | ${siteSettings?.site_title || 'MPS Portfolio'}`;
    }

    // Force noindex for admin pages
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'noindex, nofollow';

    // Restore original robots tag when leaving admin
    return () => {
      if (metaRobots && siteSettings?.seo_robots) {
        metaRobots.content = siteSettings.seo_robots;
      }
    };
  }, [pageTitle, siteSettings]);

  return (
    <div className="admin-root">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-name">{siteSettings?.admin_title || (siteSettings?.site_title ? `${siteSettings.site_title} Admin` : 'MPS Admin')}</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_GROUPS.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-group-label">{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, location.pathname, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item${active ? ' active' : ''}`}
                  >
                    <Icon size={15} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <Link to="/" className="nav-item" style={{ marginBottom: 4 }}>
            ↗ View Site
          </Link>
          <SidebarLogout />
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button
            className="topbar-mobile-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={16} />
          </button>

          <div className="topbar-breadcrumb">
            <span>{siteSettings?.author_name ? siteSettings.author_name.split(' ').map(w => w[0]).join('').toUpperCase() : 'MPS'}</span>
            <ChevronRight size={13} className="topbar-breadcrumb-sep" />
            <span className="topbar-breadcrumb-current">{pageTitle}</span>
          </div>

          <div className="topbar-actions">
            <Link to="/" className="btn btn-ghost" style={{ fontSize: 12, height: 28 }}>
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="admin-scroll">
          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <div className="mobile-bottom-nav-inner">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, location.pathname, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item${active ? ' active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            className="mobile-nav-item"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={18} />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* ─── Mobile Full Menu ─── */}
      <div
        className={`mobile-menu-overlay${menuOpen ? ' open' : ''}`}
        onClick={closeMenu}
      >
        <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-handle" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Navigation</span>
            <button className="btn btn-ghost btn-icon" onClick={closeMenu}>
              <X size={16} />
            </button>
          </div>

          <div className="mobile-menu-grid">
            {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, location.pathname, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-menu-link${active ? ' active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <Link to="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <LogOut size={14} /> Back to Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
