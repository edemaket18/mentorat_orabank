 // src/controllers/analyticsController.ts
import { Request, Response } from 'express';
import User from '../models/User';
 import Mongoose from 'mongoose';
import Report from '../models/Report';
import Attestation from '../models/Attestation';
import MentorshipMatch from '../models/MentorshipMatch'; 
 import Meeting from '../models/Meeting';
import Skill from '../models/Skill';
import { Types } from 'mongoose';
import { Parser } from 'json2csv';


export const getAnalytics  = async (req: Request, res: Response) => {
  try {
    const { role, status, from, to } = req.query;

    // Build filter object dynamically
    const dateFilter: any = {};
    if (from) dateFilter.$gte = new Date(from as string);
    if (to) dateFilter.$lte = new Date(to as string);

    const userFilter: any = {};
    if (role) userFilter.role = role;
    if (status) userFilter.status = status;
    if (from || to) userFilter.createdAt = dateFilter;

    // Aggregated data
    const totalUsers = await User.countDocuments(userFilter);
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalStagiaires = await User.countDocuments({ role: 'stagiaire' });

    // Make sure Mentorship is a Mongoose model, not a Router
    // Use MentorshipMatch Mongoose model for mentorships count
    const totalMentorships = await MentorshipMatch.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalAttestations = await Attestation.countDocuments();

    res.json({
      totalUsers,
      totalMentors,
      totalStagiaires,
      totalMentorships,
      totalReports,
      totalAttestations,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des statistiques.' });
  }
};


export const exportAnalyticsCSV = async (req: Request, res: Response) => {
  try {
    const { role, status, from, to } = req.query;

    const dateFilter: any = {};
    if (from) dateFilter.$gte = new Date(from as string);
    if (to) dateFilter.$lte = new Date(to as string);

    const userFilter: any = {};
    if (role) userFilter.role = role;
    if (status) userFilter.status = status;
    if (from || to) userFilter.createdAt = dateFilter;

    const totalUsers = await User.countDocuments(userFilter);
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalStagiaires = await User.countDocuments({ role: 'stagiaire' });
    const totalMentorships = await MentorshipMatch.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalAttestations = await Attestation.countDocuments();

    const data = [{
      totalUsers,
      totalMentors,
      totalStagiaires,
      totalMentorships,
      totalReports,
      totalAttestations,
      filteredBy: {
        role: role || 'tous',
        status: status || 'tous',
        from: from || '-',
        to: to || '-'
      }
    }];

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('analytics.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Erreur export CSV :', error);
    res.status(500).json({ message: 'Erreur lors de l’export CSV.' });
  }
};
 



interface AnalyticsData {
  userStats: {
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
    recentSignups: number;
  };
  meetingStats: {
    total: number;
    upcoming: number;
    completed: number;
    byType: Record<string, number>;
  };
  skillStats: {
    mostPopular: {
      name: string;
      count: number;
    }[];
    leastPopular: {
      name: string;
      count: number;
    }[];
  };
  stageStats?: {
    validated: number;
    inProgress: number;
    notStarted: number;
  };
}

export const getAnalyticsData = async (req: Request, res: Response) => {
  try {
    // 1. User Analytics
    const userStats = {
      total: await User.countDocuments(),
      byRole: await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $project: { role: '$_id', count: 1, _id: 0 } }
      ]).then(results => 
        results.reduce((acc, { role, count }) => ({ ...acc, [role]: count }), {})
      ),
      byStatus: await User.aggregate([
        { $group: { _id: '$accountStatus', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } }
      ]).then(results =>
        results.reduce((acc, { status, count }) => ({ ...acc, [status]: count }), {})
      ),
      recentSignups: await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      })
    };

    // 2. Meeting Analytics
    const meetingStats = {
      total: await Meeting.countDocuments(),
      upcoming: await Meeting.countDocuments({ startTime: { $gt: new Date() } }),
      completed: await Meeting.countDocuments({ endTime: { $lt: new Date() } }),
      byType: await Meeting.aggregate([
        { $group: { _id: '$meetingType', count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } }
      ]).then(results =>
        results.reduce((acc, { type, count }) => ({ ...acc, [type]: count }), {})
      )
    };

    // 3. Skill Analytics
    const skillStats = {
      mostPopular: await Skill.aggregate([
        { $project: { name: 1, userCount: { $size: '$users' } } },
        { $sort: { userCount: -1 } },
        { $limit: 5 }
      ]),
      leastPopular: await Skill.aggregate([
        { $project: { name: 1, userCount: { $size: '$users' } } },
        { $sort: { userCount: 1 } },
        { $limit: 5 }
      ])
    };

    // 4. Optional Stage Analytics (if applicable)
    const stageStats = await User.aggregate([
      { $match: { role: 'intern' } },
      { $group: { 
        _id: '$stage.status', 
        count: { $sum: 1 } 
      }},
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]).then(results => ({
      validated: results.find(r => r.status === 'validated')?.count || 0,
      inProgress: results.find(r => r.status === 'in-progress')?.count || 0,
      notStarted: results.find(r => r.status === 'not-started')?.count || 0
    }));

    const responseData: AnalyticsData = {
      userStats,
      meetingStats,
      skillStats,
      ...(req.query.includeStage === 'true' && { stageStats })
    };

    res.status(200).json({
      success: true,
      data: responseData,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      //error: process.env.NODE_ENV === 'development' ?  error.message : undefined  
       
    });
  }
};
