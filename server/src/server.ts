import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import clinicRoutes from './routes/clinicRoutes';
import authRoutes from './routes/authRoutes';
import { testConnection } from './db/connection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Allowed Origins (CORS) ───────────────────────────────────────────────────
// In production, only allow requests from your Vercel domain.
// Locally, also allow localhost:3000 (Vite dev server).
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,               // e.g. https://zulia-health-network.vercel.app
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow localhost, any *.vercel.app deployment URL, or explicit CLIENT_URL
    if (
      origin.includes('localhost') ||
      origin.endsWith('.vercel.app') ||
      (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
    ) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
    callback(new Error(`CORS bloqueado: origen no permitido → ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Helmet (HTTP Security Headers) ─────────────────────────────────────────
// Sets X-Frame-Options, X-Content-Type-Options, HSTS, CSP, etc.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images from same domain
}));

// ─── Body Size Limit ─────────────────────────────────────────────────────────
// Prevents payload-based denial-of-service attacks.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── General Rate Limiter ─────────────────────────────────────────────────────
// Max 100 requests per IP per 15 minutes for all /api routes.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Por favor intente de nuevo en 15 minutos.' },
});

// ─── Strict Auth Rate Limiter ─────────────────────────────────────────────────
// Max 10 login attempts per IP per 15 minutes to prevent brute-force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de inicio de sesión. Intente en 15 minutos.' },
});

// ─── Apply Limiters ──────────────────────────────────────────────────────────
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', clinicRoutes);
app.use('/api/auth', authRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'Zulia Health Network API', version: '1.0.0' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Don't expose internal stack traces to the client in production
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('❌ [SERVER GLOBAL ERROR]:', err);
  res.status(err.status || 500).json({
    error: err?.message || 'Error interno del servidor',
    ...(isDev && { stack: err?.stack }),
  });
});

// ─── Start Server (local dev only) ───────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`🔐 CORS allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
    await testConnection();
  });
} else {
  // In production (Vercel), just test the DB connection once on cold start
  testConnection();
}

// ─── Export for Vercel Serverless ────────────────────────────────────────────
export default app;
