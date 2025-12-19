import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../db';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const media = await prisma.media.create({
      data: {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: 'Media upload failed' });
  }
};

export const getAllMedia = async (req: Request, res: Response) => {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) return res.status(404).json({ error: 'Media not found' });

    // Delete from DB
    await prisma.media.delete({ where: { id } });

    // Delete from Filesystem
    const filePath = path.join(__dirname, '../../public/uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};

export const getMediaUsage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) return res.status(404).json({ error: 'Media not found' });

    // Search for the URL in the content fields of all models
    // Using simple string matching on the stringified JSON/Text
    const searchStr = `%${media.url}%`;

    const [posts, projects, stories] = await Promise.all([
      prisma.$queryRaw`SELECT id, title, 'post' as type FROM "Post" WHERE content::text ILIKE ${searchStr}`,
      prisma.$queryRaw`SELECT id, title, 'project' as type FROM "Project" WHERE content::text ILIKE ${searchStr}`,
      prisma.$queryRaw`SELECT id, title, 'story' as type FROM "Story" WHERE content::text ILIKE ${searchStr}`,
    ]);

    // @ts-ignore
    const usage = [...posts, ...projects, ...stories];
    res.json(usage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check media usage' });
  }
};
