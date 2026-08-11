import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clinicRoutes from './routes/clinicRoutes';
import authRoutes from './routes/authRoutes';
import { testConnection } from './db/connection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', clinicRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'Zulia Health Network API', version: '1.0.0' });
});

// Global Error Handler Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ [SERVER GLOBAL ERROR]:', err);
  res.status(500).json({ error: err?.message || 'Error interno del servidor' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  await testConnection();
});
