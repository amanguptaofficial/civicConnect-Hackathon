const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

const getFeedback = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      policyProposalId,
      userId,
      sentiment,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (policyProposalId) query.policyProposalId = policyProposalId;
    if (userId) query.userId = userId;
    if (sentiment) query.sentiment = sentiment;

    const feedback = await Feedback.find(query)
      .populate('userId', 'firstName lastName email profileImage')
      .populate('policyProposalId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      data: feedback,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackItem = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('userId', 'firstName lastName email profileImage')
      .populate('policyProposalId', 'title description');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: { message: 'Feedback not found' },
      });
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

const createFeedback = async (req, res, next) => {
  try {
    const { policyProposalId, title, content, category, isAnonymous, attachments, images } = req.body;

    const feedback = await Feedback.create({
      userId: req.user._id,
      policyProposalId,
      title,
      content,
      category,
      isAnonymous: isAnonymous || false,
      attachments,
      images: images || [],
    });

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('userId', 'firstName lastName email profileImage')
      .populate('policyProposalId', 'title');

    if (policyProposalId) {
      const proposal = await require('../models/PolicyProposal').findById(policyProposalId);
      if (proposal) {
        await Notification.create({
          userId: proposal.authorId,
          type: 'feedback_response',
          title: 'New Feedback Received',
          message: `New feedback has been submitted for your proposal "${proposal.title}"`,
          relatedEntityType: 'feedback',
          relatedEntityId: feedback._id.toString(),
        });
      }
    }

    res.status(201).json({
      success: true,
      data: populatedFeedback,
      message: 'Feedback created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: { message: 'Feedback not found' },
      });
    }

    if (feedback.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to update this feedback' },
      });
    }

    const { title, content, category, isAnonymous, attachments, images } = req.body;

    Object.assign(feedback, {
      title: title || feedback.title,
      content: content || feedback.content,
      category: category || feedback.category,
      isAnonymous: isAnonymous !== undefined ? isAnonymous : feedback.isAnonymous,
      attachments: attachments || feedback.attachments,
      images: images !== undefined ? images : feedback.images,
    });

    await feedback.save();

    const updatedFeedback = await Feedback.findById(feedback._id)
      .populate('userId', 'firstName lastName email profileImage')
      .populate('policyProposalId', 'title');

    res.json({
      success: true,
      data: updatedFeedback,
      message: 'Feedback updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: { message: 'Feedback not found' },
      });
    }

    if (feedback.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to delete this feedback' },
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateFeedbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['policymaker', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only policymakers can update feedback status' },
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: { message: 'Feedback not found' },
      });
    }

    feedback.status = status;
    await feedback.save();

    await Notification.create({
      userId: feedback.userId,
      type: 'status_change',
      title: 'Feedback Status Updated',
      message: `Your feedback "${feedback.title}" status has been updated to ${status}`,
      relatedEntityType: 'feedback',
      relatedEntityId: feedback._id.toString(),
    });

    const updatedFeedback = await Feedback.findById(feedback._id)
      .populate('userId', 'firstName lastName email profileImage')
      .populate('policyProposalId', 'title');

    res.json({
      success: true,
      data: updatedFeedback,
      message: 'Feedback status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeedback,
  getFeedbackItem,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  updateFeedbackStatus,
};
