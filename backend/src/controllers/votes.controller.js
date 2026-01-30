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
        error: { message: 'Either policyProposalId or commentId is required' },
      });
    }

    let vote;
    let upvotes = 0;
    let downvotes = 0;

    const filter = {
      userId: req.user._id,
      ...(policyProposalId ? { policyProposalId } : { commentId }),
    };

    const existingVote = await Vote.findOne(filter);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.findByIdAndDelete(existingVote._id);
        vote = null;
        
        if (policyProposalId) {
          if (voteType === 'upvote') {
            await PolicyProposal.findByIdAndUpdate(policyProposalId, { $inc: { upvotes: -1 } });
          } else {
            await PolicyProposal.findByIdAndUpdate(policyProposalId, { $inc: { downvotes: -1 } });
          }
        }
      } else {
        existingVote.voteType = voteType;
        await existingVote.save();
        vote = existingVote;
        
        if (policyProposalId) {
          if (voteType === 'upvote') {
            await PolicyProposal.findByIdAndUpdate(policyProposalId, { 
              $inc: { upvotes: 1, downvotes: -1 } 
            });
          } else {
            await PolicyProposal.findByIdAndUpdate(policyProposalId, { 
              $inc: { upvotes: -1, downvotes: 1 } 
            });
          }
        }
      }
    } else {
      try {
        vote = await Vote.create({
          userId: req.user._id,
          policyProposalId,
          commentId,
          voteType,
        });
        
        if (policyProposalId) {
          if (voteType === 'upvote') {
            await PolicyProposal.findByIdAndUpdate(policyProposalId, { $inc: { upvotes: 1 } });
          } else {
            await PolicyProposal.findByIdAndUpdate(policyProposalId, { $inc: { downvotes: 1 } });
          }
        }
      } catch (createError) {
        if (createError.code === 11000) {
          const duplicateVote = await Vote.findOne(filter);
          if (duplicateVote) {
            if (duplicateVote.voteType === voteType) {
              await Vote.findByIdAndDelete(duplicateVote._id);
              vote = null;
              
              if (policyProposalId) {
                if (voteType === 'upvote') {
                  await PolicyProposal.findByIdAndUpdate(policyProposalId, { $inc: { upvotes: -1 } });
                } else {
                  await PolicyProposal.findByIdAndUpdate(policyProposalId, { $inc: { downvotes: -1 } });
                }
              }
            } else {
              duplicateVote.voteType = voteType;
              await duplicateVote.save();
              vote = duplicateVote;
              
              if (policyProposalId) {
                if (voteType === 'upvote') {
                  await PolicyProposal.findByIdAndUpdate(policyProposalId, { 
                    $inc: { upvotes: 1, downvotes: -1 } 
                  });
                } else {
                  await PolicyProposal.findByIdAndUpdate(policyProposalId, { 
                    $inc: { upvotes: -1, downvotes: 1 } 
                  });
                }
              }
            }
          } else {
            vote = null;
          }
        } else {
          throw createError;
        }
      }
    }

    if (policyProposalId) {
      const proposal = await PolicyProposal.findById(policyProposalId);
      upvotes = proposal.upvotes || 0;
      downvotes = proposal.downvotes || 0;
    }

    if (policyProposalId && vote) {
      const proposal = await PolicyProposal.findById(policyProposalId);
      if (proposal && proposal.authorId.toString() !== req.user._id.toString()) {
        await Notification.create({
          userId: proposal.authorId,
          type: 'vote_received',
          title: 'New Vote on Your Proposal',
          message: `Your proposal "${proposal.title}" received a ${voteType}`,
          relatedEntityType: 'proposal',
          relatedEntityId: proposal._id.toString(),
        });
      }
    }

    res.json({
      success: true,
      data: {
        vote: vote ? { id: vote._id, voteType: vote.voteType } : null,
        upvotes: upvotes,
        downvotes: downvotes,
      },
      message: 'Vote updated successfully',
    });

  } catch (error) {
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
