const PolicyProposal = require('../models/PolicyProposal');
const Vote = require('../models/Vote');
const Notification = require('../models/Notification');
const { generateSummary, analyzeSentiment } = require('../services/ai.service');

const getProposals = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
    } = req.query;

    const query = { isPublic: true };

    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const proposals = await PolicyProposal.find(query)
      .populate('authorId', 'firstName lastName email profileImage')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await PolicyProposal.countDocuments(query);

    res.json({
      success: true,
      data: proposals,
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

const getProposal = async (req, res, next) => {
  try {
    const proposal = await PolicyProposal.findById(req.params.id)
      .populate('authorId', 'firstName lastName email profileImage role')
      .populate({
        path: 'attachments',
        select: 'url',
      });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: { message: 'Proposal not found' },
      });
    }

    proposal.viewCount += 1;
    await proposal.save();

    const userVote = req.user ? await Vote.findOne({
      userId: req.user._id,
      policyProposalId: proposal._id,
    }) : null;

    res.json({
      success: true,
      data: {
        ...proposal.toObject(),
        userVote: userVote ? userVote.voteType : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createProposal = async (req, res, next) => {
  try {
    const { title, description, category, priority, tags, attachments, isPublic, location, images } = req.body;

    const proposalData = {
      title,
      description,
      category,
      priority,
      tags,
      attachments,
      images,
      isPublic: isPublic !== undefined ? isPublic : true,
      authorId: req.user._id,
    };

    if (location && location.coordinates && location.coordinates.length === 2) {
      proposalData.location = {
        type: 'Point',
        coordinates: [location.coordinates[0], location.coordinates[1]],
        address: location.address || '',
      };
    }

    const proposal = await PolicyProposal.create(proposalData);

    if (description && description.length > 50) {
      try {
        const [aiSummary, aiSentiment] = await Promise.all([
          generateSummary(description),
          analyzeSentiment(description),
        ]);

        if (aiSummary || aiSentiment) {
          proposal.aiSummary = aiSummary;
          proposal.aiSentiment = aiSentiment;
          await proposal.save();
        }
      } catch (aiError) {
        console.error('AI processing error:', aiError);
      }
    }

    const populatedProposal = await PolicyProposal.findById(proposal._id)
      .populate('authorId', 'firstName lastName email profileImage');

    res.status(201).json({
      success: true,
      data: populatedProposal,
      message: 'Proposal created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateProposal = async (req, res, next) => {
  try {
    const proposal = await PolicyProposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: { message: 'Proposal not found' },
      });
    }

    if (proposal.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to update this proposal' },
      });
    }

    const { title, description, category, priority, tags, attachments, isPublic } = req.body;

    Object.assign(proposal, {
      title: title || proposal.title,
      description: description || proposal.description,
      category: category || proposal.category,
      priority: priority || proposal.priority,
      tags: tags || proposal.tags,
      attachments: attachments || proposal.attachments,
      isPublic: isPublic !== undefined ? isPublic : proposal.isPublic,
    });

    await proposal.save();

    const updatedProposal = await PolicyProposal.findById(proposal._id)
      .populate('authorId', 'firstName lastName email profileImage');

    res.json({
      success: true,
      data: updatedProposal,
      message: 'Proposal updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteProposal = async (req, res, next) => {
  try {
    const proposal = await PolicyProposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: { message: 'Proposal not found' },
      });
    }

    if (proposal.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to delete this proposal' },
      });
    }

    await PolicyProposal.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Proposal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateProposalStatus = async (req, res, next) => {
  try {
    const { status, governmentResponse } = req.body;

    if (!['policymaker', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only policymakers can update proposal status' },
      });
    }

    const proposal = await PolicyProposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: { message: 'Proposal not found' },
      });
    }

    proposal.status = status;
    if (governmentResponse) {
      proposal.governmentResponse = governmentResponse;
      proposal.responseDate = new Date();
    }

    await proposal.save();

    await Notification.create({
      userId: proposal.authorId,
      type: 'status_change',
      title: 'Proposal Status Updated',
      message: `Your proposal "${proposal.title}" status has been updated to ${status}`,
      relatedEntityType: 'proposal',
      relatedEntityId: proposal._id.toString(),
    });

    const updatedProposal = await PolicyProposal.findById(proposal._id)
      .populate('authorId', 'firstName lastName email profileImage');

    res.json({
      success: true,
      data: updatedProposal,
      message: 'Proposal status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal,
  updateProposalStatus,
};
