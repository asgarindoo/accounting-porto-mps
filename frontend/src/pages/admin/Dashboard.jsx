import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Eye, Download, TrendingUp, Users, FolderGit2, Code, Trophy, LayoutGrid, Award } from 'lucide-react';
import { projectService } from '../../services/projectService.js';
import { skillService } from '../../services/skillService.js';
import { achievementService } from '../../services/achievementService.js';
import { analyticsService } from '../../services/analyticsService.js';
import '../../components/admin/admin.css';

export function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalDownloads: 0,
    recentViews: 0,
    uniqueVisitors: 0,
    topProjects: [],
    topAchievements: [],
    avgTimeOnSite: 0,
    totalContactClicks: 0,
    deviceSplit: { mobile: 0, desktop: 0 }
  });
  const [stats, setStats] = useState({ projects: 0, skills: 0, achievements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, p, s, ach] = await Promise.allSettled([
          analyticsService.getStats(),
          projectService.getAll(),
          skillService.getAll(),
          achievementService.getAll()
        ]);

        if (a.status === 'fulfilled' && a.value?.success) {
          setAnalytics(a.value.data);
        }

        setStats({
          projects: p.value?.length ?? 0,
          skills: s.value?.length ?? 0,
          achievements: ach.value?.length ?? 0,
        });

      } catch (_) {
        // Ignore errors
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalDevices = analytics.deviceSplit.mobile + analytics.deviceSplit.desktop || 1; // prevent div/0
  const mobilePct = Math.round((analytics.deviceSplit.mobile / totalDevices) * 100);
  const desktopPct = Math.round((analytics.deviceSplit.desktop / totalDevices) * 100);

  // Helper to format seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Your portfolio analytics overview.</p>
        </div>
      </div>

      {/* Analytics Overview - Big Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <MetricCard
          title="Total Page Views"
          value={analytics.totalViews}
          icon={<Eye size={20} />}
          loading={loading}
          trend={`+${analytics.recentViews} this week`}
        />
        <MetricCard
          title="Unique Visitors"
          value={analytics.uniqueVisitors}
          icon={<Users size={20} />}
          loading={loading}
        />
        <MetricCard
          title="Resume Downloads"
          value={analytics.totalDownloads}
          icon={<Download size={20} />}
          loading={loading}
        />
        <MetricCard
          title="Avg. Time on Site"
          value={formatTime(analytics.avgTimeOnSite)}
          icon={<Globe size={20} />}
          loading={loading}
          isText={true}
        />
      </div>

      {/* Detailed Contact Clicks */}
      <div style={{ marginBottom: 32, padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={16} /> Contact Clicks Breakdown
        </h3>
        {analytics.contactClicksDetail && analytics.contactClicksDetail.length > 0 ? (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {analytics.contactClicksDetail.map((contact, idx) => (
              <div key={idx} style={{ padding: '8px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{contact.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', background: 'var(--surface)', padding: '2px 8px', borderRadius: 10 }}>
                  {contact.count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--text-disabled)', margin: 0 }}>No contact clicks yet.</p>
        )}
      </div>

      {/* CMS Content Totals */}
      <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 32,
        padding: '12px 16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
      }}>
        <StatChip icon={FolderGit2} label="Total Projects" value={stats.projects} loading={loading} />
        <Divider />
        <StatChip icon={Trophy} label="Total Achievements" value={stats.achievements} loading={loading} />
        <Divider />
        <StatChip icon={Code} label="Total Skills" value={stats.skills} loading={loading} />
      </div>

      {/* Top Content Rankings */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <DashboardCard title="Top Projects" icon={<LayoutGrid size={14} />}>
          {analytics.topProjects && analytics.topProjects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px' }}>
              {analytics.topProjects.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.count} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ padding: '12px', fontSize: 13, color: 'var(--text-disabled)', textAlign: 'center' }}>No project views yet</p>
          )}
        </DashboardCard>

        <DashboardCard title="Top Achievements" icon={<Award size={14} />}>
          {analytics.topAchievements && analytics.topAchievements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px' }}>
              {analytics.topAchievements.map((a, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{a.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{a.count} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ padding: '12px', fontSize: 13, color: 'var(--text-disabled)', textAlign: 'center' }}>No achievement views yet</p>
          )}
        </DashboardCard>
      </div>

      {/* Style for dashboard grid mobile */}
      <style>{`
        @media (max-width: 640px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Sub-components ─── */

function MetricCard({ title, value, icon, loading, trend }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>{title}</h3>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
          {loading ? '...' : value?.toLocaleString()}
        </div>
        {trend && !loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#10b981', fontWeight: 500 }}>
            <TrendingUp size={14} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, loading }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px' }}>
      <Icon size={14} style={{ color: 'var(--text-disabled)', flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: 600,
        color: loading ? 'var(--text-disabled)' : 'var(--text-primary)',
        minWidth: 16,
      }}>
        {loading ? '—' : value}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: 'var(--border)', flexShrink: 0 }} />;
}

function DashboardCard({ title, icon, children }) {
  return (
    <div style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <span style={{ color: 'var(--text-disabled)' }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '8px 4px' }}>
        {children}
      </div>
    </div>
  );
}
