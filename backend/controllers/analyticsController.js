const Analytics = require('../models/Analytics');
const Portfolio = require('../models/Portfolio');
const CaseStudy = require('../models/CaseStudy');

// @desc    Get portfolio analytics
// @route   GET /api/analytics/portfolio
// @access  Private
exports.getPortfolioAnalytics = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    // Get analytics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analytics = await Analytics.aggregate([
      {
        $match: {
          portfolio: portfolio._id,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$pageViews" },
          avgTimeSpent: { $avg: "$timeSpent" },
          uniqueVisitors: { $addToSet: "$visitor.ip" }
        }
      },
      {
        $project: {
          _id: 0,
          totalViews: 1,
          avgTimeSpent: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" }
        }
      }
    ]);

    // Get top case studies by views
    const topCaseStudies = await Analytics.aggregate([
      {
        $match: {
          portfolio: portfolio._id,
          caseStudy: { $exists: true },
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: "$caseStudy",
          views: { $sum: "$pageViews" }
        }
      },
      {
        $sort: { views: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "casestudies",
          localField: "_id",
          foreignField: "_id",
          as: "caseStudy"
        }
      },
      {
        $unwind: "$caseStudy"
      },
      {
        $project: {
          _id: 0,
          caseStudy: "$caseStudy.title",
          views: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: analytics[0] || { totalViews: 0, avgTimeSpent: 0, uniqueVisitors: 0 },
        topCaseStudies
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get case study analytics
// @route   GET /api/analytics/case-study/:id
// @access  Private
exports.getCaseStudyAnalytics = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    const caseStudy = await CaseStudy.findOne({
      _id: req.params.id,
      portfolio: portfolio._id
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    // Get analytics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analytics = await Analytics.aggregate([
      {
        $match: {
          portfolio: portfolio._id,
          caseStudy: caseStudy._id,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$pageViews" },
          avgTimeSpent: { $avg: "$timeSpent" },
          uniqueVisitors: { $addToSet: "$visitor.ip" }
        }
      },
      {
        $project: {
          _id: 0,
          totalViews: 1,
          avgTimeSpent: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" }
        }
      }
    ]);

    // Get click events
    const clickEvents = await Analytics.aggregate([
      {
        $match: {
          portfolio: portfolio._id,
          caseStudy: caseStudy._id,
          date: { $gte: thirtyDaysAgo },
          "clickEvents.0": { $exists: true }
        }
      },
      {
        $unwind: "$clickEvents"
      },
      {
        $group: {
          _id: "$clickEvents.element",
          clicks: { $sum: "$clickEvents.count" }
        }
      },
      {
        $sort: { clicks: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: analytics[0] || { totalViews: 0, avgTimeSpent: 0, uniqueVisitors: 0 },
        clickEvents
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Track portfolio view (public)
// @route   POST /api/analytics/track
// @access  Public
exports.trackView = async (req, res, next) => {
  try {
    const { portfolioId, caseStudyId, timeSpent, clickEvents, visitor } = req.body;

    const analyticsData = {
      portfolio: portfolioId,
      pageViews: 1,
      timeSpent: timeSpent || 0,
      visitor
    };

    if (caseStudyId) {
      analyticsData.caseStudy = caseStudyId;
    }

    if (clickEvents && clickEvents.length > 0) {
      analyticsData.clickEvents = clickEvents;
    }

    await Analytics.create(analyticsData);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};