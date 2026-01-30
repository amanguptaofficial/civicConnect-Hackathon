const Vote = require('../models/Vote');
const PolicyProposal = require('../models/PolicyProposal');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

const createVote = async (req, res, next) => {
  try {
    const { policyProposalId, commentId, voteType } = req.body;

    if (!policyProposalId && !commentId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Either policyProposalId or commentId is required' }
      });
    }

    let targetItem;
    let voteFilter;

    if (policyProposalId) {
      targetItem = await PolicyProposal.findById(policyProposalId);
      voteFilter = { userId: req.user._id, policyProposalId };
    } 
    else if (commentId) {
      targetItem = await Comment.findById(commentId);
      voteFilter = { userId: req.user._id, commentId };
    }

    if (!targetItem) {
      return res.status(404).json({
        success: false,
        error: { message: 'Item not found' }
      });
    }

    const existingVote = await Vote.findOne(voteFilter);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.findByIdAndDelete(existingVote._id);
        
        if (voteType === 'upvote') {
          targetItem.upvotes -= 1;
        } else {
          targetItem.downvotes -= 1;
        }
      } 
      else {
        existingVote.voteType = voteType;
        await existingVote.save();
        
        if (voteType === 'upvote') {
          targetItem.upvotes += 1;
          targetItem.downvotes -= 1;
        } else {
          targetItem.downvotes += 1;
          targetItem.upvotes -= 1;
        }
      }
    } 
    else {
      const voteData = {
        userId: req.user._id,
        voteType
      };
      
      if (policyProposalId) {
        voteData.policyProposalId = policyProposalId;
      } else if (commentId) {
        voteData.commentId = commentId;
      }
      
      await Vote.create(voteData);
      
      if (voteType === 'upvote') {
        targetItem.upvotes += 1;
      } else {
        targetItem.downvotes += 1;
      }
    }

    await targetItem.save();

    res.json({
      success: true,
      data: {
        upvotes: targetItem.upvotes,
        downvotes: targetItem.downvotes,
        userVote: existingVote ? 
          (existingVote.voteType === voteType ? null : voteType) : voteType
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const removeVote = async (req, res, next) => {
  try {
    const vote = await Vote.findById(req.params.id);

    if (!vote) {
      return res.status(404).json({
        success: false,
        error: { message: 'Vote not found' },
      });
    }

    if (vote.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to remove this vote' },
      });
    }

    if (vote.policyProposalId) {
      const proposal = await PolicyProposal.findById(vote.policyProposalId);
      if (proposal) {
        const upvotes = await Vote.countDocuments({ policyProposalId: vote.policyProposalId, voteType: 'upvote' });
        const downvotes = await Vote.countDocuments({ policyProposalId: vote.policyProposalId, voteType: 'downvote' });

        proposal.upvotes = upvotes;
        proposal.downvotes = downvotes;
        await proposal.save();
      }
    } else if (vote.commentId) {
      const comment = await Comment.findById(vote.commentId);
      if (comment) {
        const upvotes = await Vote.countDocuments({ commentId: vote.commentId, voteType: 'upvote' });
        const downvotes = await Vote.countDocuments({ commentId: vote.commentId, voteType: 'downvote' });

        comment.upvotes = upvotes;
        comment.downvotes = downvotes;
        await comment.save();
      }
    }

    await Vote.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vote removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getUserVotes = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { userId: req.params.userId };

    if (type === 'proposal') {
      query.policyProposalId = { $exists: true };
    } else if (type === 'comment') {
      query.commentId = { $exists: true };
    }

    const votes = await Vote.find(query)
      .populate('policyProposalId', 'title')
      .populate('commentId', 'content')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: votes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVote,
  removeVote,
  getUserVotes,
};
