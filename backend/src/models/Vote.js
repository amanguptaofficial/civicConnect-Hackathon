const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  policyProposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PolicyProposal',
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  voteType: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true,
  },
}, {
  timestamps: true,
});

voteSchema.index({ userId: 1, policyProposalId: 1 }, { unique: true, sparse: true });
voteSchema.index({ userId: 1, commentId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Vote', voteSchema);
