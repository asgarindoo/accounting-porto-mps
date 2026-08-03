const API_URL = (import.meta.env.VITE_API_URL || '') + '/api/analytics';

const getVisitorId = () => {
  let vid = localStorage.getItem('visitor_id');
  if (!vid) {
    vid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', vid);
  }
  return vid;
};

const getDeviceType = () => {
  return window.innerWidth <= 768 ? 'Mobile' : 'Desktop';
};

export const analyticsService = {
  async trackEvent(eventType, metadata = null) {
    try {
      const visitorId = getVisitorId();
      
      // Auto-inject device type for page views if no metadata is provided
      if (eventType === 'page_view' && !metadata) {
        metadata = getDeviceType();
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventType, visitorId, metadata: metadata ? String(metadata) : null }),
      });
      if (!res.ok) throw new Error('Failed to track event');
      return await res.json();
    } catch (error) {
      console.error('Analytics tracking failed:', error);
      return { success: false };
    }
  },

  async getStats() {
    try {
      const res = await fetch(`${API_URL}/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (error) {
      console.error('Failed to get stats:', error);
      return { success: false, data: null };
    }
  },

  initSessionDurationTracker() {
    if (window._analyticsSessionInitialized) return;
    window._analyticsSessionInitialized = true;
    
    const startTime = Date.now();
    let hasSent = false;

    const sendDurationEvent = () => {
      if (hasSent) return;
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
      if (durationSeconds > 1) { // Only track meaningful sessions > 1 second
        analyticsService.trackEvent('session_duration', durationSeconds);
        hasSent = true;
      }
    };

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendDurationEvent();
      }
    });

    window.addEventListener('beforeunload', sendDurationEvent);
  }
};
