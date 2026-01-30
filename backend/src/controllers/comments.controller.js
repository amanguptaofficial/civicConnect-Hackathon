const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const Notification = require('../models/Notification');

const getComments = async (req, res, next) => {
  try {
    const { policyProposalId, feedbackId, page = 1, limit = 20 } = req.query;

    const query = {};
    if (policyProposalId) query.policyProposalId = policyProposalId;
    if (feedbackId) query.feedbackId = feedbackId;

    query.parentCommentId = { $exists: false };

    const comments = await Comment.find(query)
      .populate('userId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Comment.countDocuments(query);

    const commentsWithRepliesCount = await Promise.all(
      comments.map(async (comment) => {
        const repliesCount = await Comment.countDocuments({ parentCommentId: comment._id });

        const userVote = req.user ? await Vote.findOne({
          userId: req.user._id,
          commentId: comment._id,
        }) : null;

        return {
          ...comment.toObject(),
          repliesCount,
          userVote: userVote ? userVote.voteType : null,
        };
      })
    );

    res.json({
      success: true,
      data: commentsWithRepliesCount,
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

const getReplies = async (req, res, next) => {
  try {
    const { parentCommentId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = { parentCommentId };

    const replies = await Comment.find(query)
      .populate('userId', 'firstName lastName email profileImage')
      .sort({ createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Comment.countDocuments(query);

    const repliesWithVotes = await Promise.all(
      replies.map(async (reply) => {
        const userVote = req.user ? await Vote.findOne({
          userId: req.user._id,
          commentId: reply._id,
        }) : null;

        return {
          ...reply.toObject(),
          userVote: userVote ? userVote.voteType : null,
        };
      })
    );

    res.json({
      success: true,
      data: repliesWithVotes,
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

const createComment = async (req, res, next) => {
  try {
    const { policyProposalId, feedbackId, parentCommentId, content } = req.body;

    const comment = await Comment.create({
      userId: req.user._id,
      policyProposalId,
      feedbackId,
      parentCommentId,
      content,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'firstName lastName email profileImage');

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment) {
        await Notification.create({
          userId: parentComment.userId,
          type: 'comment_reply',
          title: 'New Reply to Your Comment',
          message: `${req.user.firstName} replied to your comment`,
          relatedEntityType: 'comment',
          relatedEntityId: comment._id.toString(),
        });
      }
    } else if (policyProposalId) {
      const proposal = await require('../models/PolicyProposal').findById(policyProposalId);
      if (proposal && proposal.authorId.toString() !== req.user._id.toString()) {
        await Notification.create({
          userId: proposal.authorId,
          type: 'comment_reply',
          title: 'New Comment on Your Proposal',
          message: `${req.user.firstName} commented on your proposal "${proposal.title}"`,
          relatedEntityType: 'comment',
          relatedEntityId: comment._id.toString(),
        });
      }
    } else if (feedbackId) {
      const feedback = await require('../models/Feedback').findById(feedbackId);
      if (feedback && feedback.userId.toString() !== req.user._id.toString()) {
        await Notification.create({
          userId: feedback.userId,
          type: 'comment_reply',
          title: 'New Comment on Your Feedback',
          message: `${req.user.firstName} commented on your feedback`,
          relatedEntityType: 'comment',
          relatedEntityId: comment._id.toString(),
        });
      }
    }

    res.status(201).json({
      success: true,
      data: populatedComment,
      message: 'Comment created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Comment not found' },
      });
    }

    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to update this comment' },
      });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('userId', 'firstName lastName email profileImage');

    res.json({
      success: true,
      data: updatedComment,
      message: 'Comment updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Comment not found' },
      });
    }

    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to delete this comment' },
      });
    }

    await Comment.deleteMany({ parentCommentId: comment._id });
    await Comment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComments,
  getReplies,
  createComment,
  updateComment,
  deleteComment,
};
