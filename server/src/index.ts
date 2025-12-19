import dotenv from 'dotenv';
dotenv.config(); // Load env vars immediately

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { prisma } from './db'; // Import from new db file
import authRoutes from './routes/authRoutes';
import contentRoutes from './routes/contentRoutes';
import mediaRoutes from './routes/mediaRoutes';
import systemRoutes from './routes/systemRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/system', systemRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    service: 'AncientCMS API'
  });
});

// Basic error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`[server]: AncientCMS is running at http://localhost:${PORT}`);
});

export { app };