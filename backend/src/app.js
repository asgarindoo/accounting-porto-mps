import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { db } from './db/index.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

// Import Routes
import portfolioRoutes from './routes/portfolio.routes.js';
import projectRoutes from './routes/project.routes.js';
import experienceRoutes from './routes/experience.routes.js';
import skillRoutes from './routes/skill.routes.js';
import achievementRoutes from './routes/achievement.routes.js';
import educationRoutes from './routes/education.routes.js';
import profileRoutes from './routes/profile.routes.js';
import headlineRoutes from './routes/headline.routes.js';
import bioRoutes from './routes/bio.routes.js';
import statRoutes from './routes/stat.routes.js';
import badgeRoutes from './routes/badge.routes.js';
import softskillRoutes from './routes/softskill.routes.js';
import contactRoutes from './routes/contact.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import navRoutes from './routes/nav.routes.js';
import settingsRoutes from './routes/settings.route.js';
import uploadRoutes from './routes/upload.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

// Setup environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());

// Better Auth handler — MUST be before express.json()
app.all('/api/auth/{*path}', toNodeHandler(auth));

app.use(express.json());

// ─── Root Route ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'MPS Portfolio Backend API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running correctly!',
    dbInitialized: !!db
  });
});

// ─── Public API Routes (Portfolio frontend) ───────────────────────────────────
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/analytics', analyticsRoutes);

// ─── Protected CMS Routes (Admin only) ───────────────────────────────────────
// Import middleware
import { requireAuth } from './middleware/requireAuth.js';

app.use('/api/projects', requireAuth, projectRoutes);
app.use('/api/experiences', requireAuth, experienceRoutes);
app.use('/api/skills', requireAuth, skillRoutes);
app.use('/api/achievements', requireAuth, achievementRoutes);
app.use('/api/education', requireAuth, educationRoutes);
app.use('/api/profile', requireAuth, profileRoutes);
app.use('/api/headlines', requireAuth, headlineRoutes);
app.use('/api/bios', requireAuth, bioRoutes);
app.use('/api/stats', requireAuth, statRoutes);
app.use('/api/badges', requireAuth, badgeRoutes);
app.use('/api/softskills', requireAuth, softskillRoutes);
app.use('/api/contact', requireAuth, contactRoutes);
app.use('/api/resume', requireAuth, resumeRoutes);
app.use('/api/nav', requireAuth, navRoutes);
app.use('/api/settings', requireAuth, settingsRoutes);
app.use('/api/upload', requireAuth, uploadRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
