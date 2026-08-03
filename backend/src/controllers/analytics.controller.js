import { db } from '../db/index.js';
import { analyticsEvents } from '../db/schema.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sql, eq, and, gte, desc } from 'drizzle-orm';

export const trackEvent = catchAsync(async (req, res) => {
  const { eventType, visitorId, metadata } = req.body;
  if (!eventType) {
    return res.status(400).json({ success: false, message: 'eventType is required' });
  }

  await db.insert(analyticsEvents).values({ 
    eventType,
    visitorId: visitorId || null,
    metadata: metadata || null
  });
  
  res.status(201).json({ success: true });
});

export const getStats = catchAsync(async (req, res) => {
  // Total page views
  const pageViewsResult = await db
    .select({ count: sql`count(*)` })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'page_view'));
    
  // Unique visitors (using count distinct on visitor_id)
  const uniqueVisitorsResult = await db
    .select({ count: sql`count(distinct visitor_id)` })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'page_view'));

  // Total resume downloads
  const resumeDownloadsResult = await db
    .select({ count: sql`count(*)` })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'resume_download'));

  // Get views over the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentViewsResult = await db
    .select({ count: sql`count(*)` })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.eventType, 'page_view'),
        gte(analyticsEvents.createdAt, sevenDaysAgo)
      )
    );

  // Top Projects (Top 3)
  const topProjectsResult = await db
    .select({
      metadata: analyticsEvents.metadata,
      count: sql`count(*)`.as('count')
    })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'project_view'))
    .groupBy(analyticsEvents.metadata)
    .orderBy(desc(sql`count(*)`))
    .limit(3);

  // Top Achievements (Top 3)
  const topAchievementsResult = await db
    .select({
      metadata: analyticsEvents.metadata,
      count: sql`count(*)`.as('count')
    })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'achievement_view'))
    .groupBy(analyticsEvents.metadata)
    .orderBy(desc(sql`count(*)`))
    .limit(3);

  // Average Time on Site
  const timeOnSiteResult = await db
    .select({
      avgDuration: sql`avg(CAST(metadata AS INTEGER))`.as('avgDuration')
    })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'session_duration'));

  // Detailed Contact Clicks
  const contactClicksResult = await db
    .select({
      contact: analyticsEvents.metadata,
      count: sql`count(*)`.as('count')
    })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'contact_click'))
    .groupBy(analyticsEvents.metadata);
    
  let totalContactClicks = 0;
  const contactClicksDetail = contactClicksResult.map(r => {
    const c = Number(r.count);
    totalContactClicks += c;
    return { name: r.contact || 'Unknown', count: c };
  });

  // Device Split
  const deviceSplitResult = await db
    .select({
      device: analyticsEvents.metadata,
      count: sql`count(*)`.as('count')
    })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'page_view'))
    .groupBy(analyticsEvents.metadata);

  let mobileCount = 0;
  let desktopCount = 0;
  deviceSplitResult.forEach(row => {
    if (row.device === 'Mobile') mobileCount += Number(row.count);
    if (row.device === 'Desktop') desktopCount += Number(row.count);
  });

  res.status(200).json({
    success: true,
    data: {
      totalViews: Number(pageViewsResult[0]?.count || 0),
      uniqueVisitors: Number(uniqueVisitorsResult[0]?.count || 0),
      totalDownloads: Number(resumeDownloadsResult[0]?.count || 0),
      recentViews: Number(recentViewsResult[0]?.count || 0),
      topProjects: topProjectsResult.map(r => ({ name: r.metadata, count: Number(r.count) })),
      topAchievements: topAchievementsResult.map(r => ({ name: r.metadata, count: Number(r.count) })),
      avgTimeOnSite: Math.round(Number(timeOnSiteResult[0]?.avgDuration || 0)),
      totalContactClicks,
      contactClicksDetail,
      deviceSplit: { mobile: mobileCount, desktop: desktopCount }
    }
  });
});

