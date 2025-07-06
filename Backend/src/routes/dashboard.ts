import { Router } from 'express';
import Patient from '../models/patient.model';
import Detection from '../models/detection.model';

const router = Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching dashboard statistics...');

    // Get total counts
    const totalPatients = await Patient.countDocuments();
    const totalDetections = await Detection.countDocuments();

    // Get today's detections
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysDetections = await Detection.countDocuments({
      detectionDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Get pending reviews (detections with confidence < 80%)
    const pendingReviews = await Detection.countDocuments({
      'results.confidence': { $lt: 80 }
    });

    // Get recent patients (last 5)
    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get recent detections (last 5) with patient info
    const recentDetections = await Detection.find()
      .populate('patient', 'fullName age sexe')
      .sort({ detectionDate: -1 })
      .limit(5)
      .lean();

    // Additional analytics
    const detectionAccuracy = await Detection.aggregate([
      {
        $match: {
          'results.confidence': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: '$results.confidence' },
          highConfidenceCount: {
            $sum: {
              $cond: [{ $gte: ['$results.confidence', 80] }, 1, 0]
            }
          },
          totalCount: { $sum: 1 }
        }
      }
    ]);

    const accuracy = detectionAccuracy.length > 0 
      ? (detectionAccuracy[0].highConfidenceCount / detectionAccuracy[0].totalCount) * 100 
      : 0;

    // Weekly growth calculation
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const thisWeekDetections = await Detection.countDocuments({
      detectionDate: { $gte: lastWeek }
    });

    const previousWeek = new Date(lastWeek);
    previousWeek.setDate(previousWeek.getDate() - 7);

    const previousWeekDetections = await Detection.countDocuments({
      detectionDate: {
        $gte: previousWeek,
        $lt: lastWeek
      }
    });

    const weeklyGrowth = previousWeekDetections > 0 
      ? ((thisWeekDetections - previousWeekDetections) / previousWeekDetections) * 100 
      : thisWeekDetections > 0 ? 100 : 0;

    // Critical cases (high confidence detections)
    const criticalCases = await Detection.countDocuments({
      'results.confidence': { $gte: 90 }
    });

    const stats = {
      totalPatients,
      totalDetections,
      todaysDetections,
      pendingReviews,
      recentPatients,
      recentDetections,
      analytics: {
        detectionAccuracy: Math.round(accuracy * 10) / 10,
        weeklyGrowth: Math.round(weeklyGrowth * 10) / 10,
        criticalCases,
        avgConfidence: detectionAccuracy.length > 0 ? Math.round(detectionAccuracy[0].avgConfidence * 10) / 10 : 0
      }
    };

    console.log('Dashboard stats calculated:', {
      totalPatients,
      totalDetections,
      todaysDetections,
      pendingReviews,
      recentPatientsCount: recentPatients.length,
      recentDetectionsCount: recentDetections.length
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get patient growth data for charts
router.get('/patient-growth', async (req, res) => {
  try {
    const growth = await Patient.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' }
                }
              }
            ]
          },
          count: 1
        }
      }
    ]);

    res.json(growth);
  } catch (error) {
    console.error('Error fetching patient growth data:', error);
    res.status(500).json({ error: 'Failed to fetch patient growth data' });
  }
});

// Get detection trends for the last 30 days
router.get('/detection-trends', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Detection.aggregate([
      {
        $match: {
          detectionDate: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$detectionDate'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1
        }
      }
    ]);

    res.json(trends);
  } catch (error) {
    console.error('Error fetching detection trends:', error);
    res.status(500).json({ error: 'Failed to fetch detection trends' });
  }
});

export default router;
