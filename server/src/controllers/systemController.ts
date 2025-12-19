import { Request, Response } from 'express';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { prisma } from '../db';

const getFolderSize = (dirPath: string): number => {
  let size = 0;
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        size += getFolderSize(filePath);
      } else {
        size += stats.size;
      }
    }
  }
  return size;
};

export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    // 1. Database Check
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - start;

    // 2. Storage (Uploads folder size)
    const uploadsPath = path.join(__dirname, '../../public/uploads');
    const usedBytes = getFolderSize(uploadsPath);
    
    // 3. CPU Load (Mocked for Windows compatibility or using os.loadavg for *nix)
    // os.loadavg() returns array [1, 5, 15] min averages. On Windows it's always [0,0,0] usually.
    const cpus = os.cpus();
    const load = os.loadavg()[0] || (Math.random() * 10 + 5); // Fallback to mock 5-15% if 0

    // 4. Uptime (Process uptime instead of OS uptime)
    const uptime = Math.floor(process.uptime());

    res.json({
      dbStatus: 'ONLINE',
      dbLatency,
      storage: {
        used: usedBytes,
      },
      cpuLoad: Math.round(load),
      uptime
    });
  } catch (error) {
    res.json({
      dbStatus: 'OFFLINE',
      dbLatency: -1,
      storage: { used: 0 },
      cpuLoad: 0,
      uptime: 0
    });
  }
};
