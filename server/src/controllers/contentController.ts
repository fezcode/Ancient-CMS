import { Request, Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';

export const createContent = (modelName: 'post' | 'project' | 'story') => {
  return async (req: AuthRequest, res: Response) => {
    try {
      const { title, slug, content, language, translationGroupId, status } = req.body;
      const authorId = req.user?.id;

      if (!authorId) return res.status(401).json({ error: 'Unauthorized' });

      const data: any = {
        title,
        slug,
        content,
        language: language || 'en',
        translationGroupId,
        status: status || 'DRAFT',
        author: { connect: { id: authorId } }
      };

      // @ts-ignore
      const result = await prisma[modelName].create({ data });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create content' });
    }
  };
};

export const getContent = (modelName: 'post' | 'project' | 'story') => {
  return async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore
      const result = await prisma[modelName].findFirst({
        where: {
          OR: [
            { id: id },
            { slug: id }
          ]
        },
        include: { author: { select: { name: true, email: true } } }
      });
      
      if (!result) return res.status(404).json({ error: 'Content not found' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  };
};

export const getAllContent = (modelName: 'post' | 'project' | 'story') => {
  return async (req: Request, res: Response) => {
    try {
      const { status, language } = req.query;
      const where: any = {};
      if (status) where.status = status;
      if (language) where.language = language;

      // @ts-ignore
      const result = await prisma[modelName].findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } }
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch content list' });
    }
  };
};

export const updateContent = (modelName: 'post' | 'project' | 'story') => {
  return async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, slug, content, status, language } = req.body;

      // @ts-ignore
      const result = await prisma[modelName].update({
        where: { id },
        data: { title, slug, content, status, language }
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: 'Update failed' });
    }
  };
};

export const deleteContent = (modelName: 'post' | 'project' | 'story') => {
  return async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore
      await prisma[modelName].delete({ where: { id } });
      res.json({ message: 'Content deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Delete failed' });
    }
  };
};

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const limit = 5;
    
    const [posts, projects, stories] = await Promise.all([
      prisma.post.findMany({ 
        take: limit, 
        orderBy: { updatedAt: 'desc' },
        include: { author: { select: { name: true } } }
      }),
      prisma.project.findMany({ 
        take: limit, 
        orderBy: { updatedAt: 'desc' },
        include: { author: { select: { name: true } } }
      }),
      prisma.story.findMany({ 
        take: limit, 
        orderBy: { updatedAt: 'desc' },
        include: { author: { select: { name: true } } }
      }),
    ]);

    // Combine and format
    const activity = [
      ...posts.map(p => ({ ...p, type: 'post' })),
      ...projects.map(p => ({ ...p, type: 'project' })),
      ...stories.map(p => ({ ...p, type: 'story' })),
    ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10); // Return top 10 most recent actions

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [posts, projects, stories, users] = await Promise.all([
      prisma.post.count(),
      prisma.project.count(),
      prisma.story.count(),
      prisma.user.count(),
    ]);

    res.json({
      posts,
      projects,
      stories,
      users
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getActivityChartData = async (req: Request, res: Response) => {
  try {
    // Get stats for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Raw query to group by date
    // Note: returning count as BigInt, usually needs handling, but we cast to int
    const getCounts = async (table: string) => {
      return prisma.$queryRawUnsafe(`
        SELECT DATE("updatedAt") as date, COUNT(*)::int as count 
        FROM "${table}" 
        WHERE "updatedAt" >= $1 
        GROUP BY DATE("updatedAt")
      `, sevenDaysAgo);
    };

    const [posts, projects, stories] = await Promise.all([
      getCounts('Post'),
      getCounts('Project'),
      getCounts('Story'),
    ]);

    // Merge and format data
    const dateMap = new Map<string, number>();
    
    // Initialize last 7 days with 0
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dateMap.set(d.toISOString().split('T')[0], 0);
    }

    const process = (rows: any[]) => {
      rows.forEach((row: any) => {
        // row.date might be a Date object or string depending on driver
        const dateStr = new Date(row.date).toISOString().split('T')[0];
        const current = dateMap.get(dateStr) || 0;
        dateMap.set(dateStr, current + row.count);
      });
    };

    process(posts as any[]);
    process(projects as any[]);
    process(stories as any[]);

    // Convert to array and sort
    const chartData = Array.from(dateMap.entries())
      .map(([date, count]) => ({ 
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
        count 
      }))
      .reverse(); // Show oldest to newest

    res.json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
};
