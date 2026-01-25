const mongoose = require('mongoose');

const policyProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['education', 'healthcare', 'infrastructure', 'environment', 'economy', 'social', 'other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'under_review', 'approved', 'rejected', 'implemented'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  attachments: [{
    type: String,
  }],
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  governmentResponse: {
    type: String,
  },
  responseDate: {
    type: Date,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
    address: {
      type: String,
    },
  },
  aiSummary: {
    type: String,
  },
  aiSentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
  },
  images: [{
    type: String,
  }],
}, {
  timestamps: true,
});

policyProposalSchema.index({ title: 'text', description: 'text' });
policyProposalSchema.index({ category: 1, status: 1 });
policyProposalSchema.index({ authorId: 1 });
policyProposalSchema.index({ createdAt: -1 });
policyProposalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('PolicyProposal', policyProposalSchema);
