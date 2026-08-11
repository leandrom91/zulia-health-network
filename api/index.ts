// Vercel Serverless Function entry point
// Vercel auto-discovers files inside /api and serves them as serverless functions.
// This file re-exports the Express app so all /api/* routes are handled by it.
import app from '../server/src/server';

export default app;
