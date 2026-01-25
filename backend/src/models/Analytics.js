const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  totalProposals: {
    type: Number,
    default: 0,
  },
  totalFeedback: {
    type: Number,
    default: 0,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  totalUsers: {
    type: Number,
    default: 0,
  },
  categoryBreakdown: {
    type: mongoose.Schema.Types.Mixed,
  },
  sentimentBreakdown: {
    type: mongoose.Schema.Types.Mixed,
  },
  topProposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PolicyProposal',
  }],
  engagementMetrics: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

analyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
