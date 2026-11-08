import express from 'express';
import cors from 'cors';
import { apiRouter } from '../server/routes/api.js';
import { getDatabase } from '../server/db.js';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Zaitoon-Website-Id'],
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize DB
getDatabase();

// Mount API routes
app.use('/api/v1', apiRouter);

// Fallback
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.method} ${req.path} not found on Zaitoon Core API.` });
});

export default app;
