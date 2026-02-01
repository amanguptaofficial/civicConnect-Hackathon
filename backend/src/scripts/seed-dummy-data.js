const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const PolicyProposal = require('../models/PolicyProposal');
const Feedback = require('../models/Feedback');

const dummyProposals = [
  {
    title: "Improve Public Transportation System",
    description: "Proposal to upgrade and expand the city's public transportation network with new buses, improved routes, and better scheduling to reduce traffic congestion and carbon emissions.",
    category: "infrastructure",
    status: "under_review",
    priority: "high",
    tags: ["transportation", "environment", "urban-planning"],
    upvotes: 45,
    downvotes: 8,
    viewCount: 234,
    location: {
      coordinates: [77.2090, 28.6139],
      address: "New Delhi, India"
    },
    aiSentiment: "positive"
  },
  {
    title: "Free Healthcare for Senior Citizens",
    description: "Implement a comprehensive healthcare program providing free medical services, medications, and regular check-ups for citizens above 60 years of age.",
    category: "healthcare",
    status: "pending",
    priority: "urgent",
    tags: ["healthcare", "senior-citizens", "social-welfare"],
    upvotes: 89,
    downvotes: 12,
    viewCount: 456,
    location: {
      coordinates: [72.8777, 19.0760],
      address: "Mumbai, India"
    },
    aiSentiment: "positive"
  },
  {
    title: "Digital Literacy Program in Rural Schools",
    description: "Launch a nationwide initiative to provide computers, internet access, and digital skills training in rural schools to bridge the digital divide.",
    category: "education",
    status: "approved",
    priority: "medium",
    tags: ["education", "digital-literacy", "rural-development"],
    upvotes: 67,
    downvotes: 5,
    viewCount: 189,
    location: {
      coordinates: [76.7179, 15.4909],
      address: "Hubli, Karnataka"
    },
    governmentResponse: "Proposal approved. Implementation to begin in Q3 2024.",
    responseDate: new Date('2024-01-15'),
    aiSentiment: "positive"
  },
  {
    title: "Plastic Ban and Alternative Materials",
    description: "Phase out single-use plastics and promote biodegradable alternatives through incentives for manufacturers and awareness campaigns.",
    category: "environment",
    status: "implemented",
    priority: "high",
    tags: ["environment", "plastic-ban", "sustainability"],
    upvotes: 123,
    downvotes: 34,
    viewCount: 678,
    location: {
      coordinates: [74.8779, 31.6340],
      address: "Amritsar, Punjab"
    },
    governmentResponse: "Successfully implemented. Plastic usage reduced by 40%.",
    responseDate: new Date('2023-12-01'),
    aiSentiment: "positive"
  },
  {
    title: "Small Business Support Fund",
    description: "Create a financial assistance program for small businesses and startups affected by economic downturns, providing low-interest loans and mentorship.",
    category: "economy",
    status: "pending",
    priority: "high",
    tags: ["economy", "small-business", "startup-support"],
    upvotes: 56,
    downvotes: 18,
    viewCount: 345,
    location: {
      coordinates: [80.2707, 13.0827],
      address: "Chennai, Tamil Nadu"
    },
    aiSentiment: "neutral"
  },
  {
    title: "Women's Safety Initiative",
    description: "Implement comprehensive safety measures including increased street lighting, police patrols, and emergency response systems in high-risk areas.",
    category: "social",
    status: "under_review",
    priority: "urgent",
    tags: ["women-safety", "security", "social-welfare"],
    upvotes: 145,
    downvotes: 7,
    viewCount: 892,
    location: {
      coordinates: [75.8577, 26.9124],
      address: "Jaipur, Rajasthan"
    },
    aiSentiment: "positive"
  },
  {
    title: "Renewable Energy Subsidy Program",
    description: "Provide subsidies and tax incentives for households and businesses installing solar panels and other renewable energy systems.",
    category: "environment",
    status: "approved",
    priority: "medium",
    tags: ["renewable-energy", "solar", "sustainability"],
    upvotes: 78,
    downvotes: 22,
    viewCount: 423,
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Pune, Maharashtra"
    },
    governmentResponse: "Approved with budget allocation of ₹500 crores.",
    responseDate: new Date('2024-01-20'),
    aiSentiment: "positive"
  },
  {
    title: "Public Wi-Fi in Urban Areas",
    description: "Deploy free public Wi-Fi zones in parks, bus stations, and public squares to improve internet access for all citizens.",
    category: "infrastructure",
    status: "draft",
    priority: "low",
    tags: ["internet", "digital-infrastructure", "public-services"],
    upvotes: 34,
    downvotes: 15,
    viewCount: 167,
    location: {
      coordinates: [77.5946, 12.9716],
      address: "Bangalore, Karnataka"
    },
    aiSentiment: "neutral"
  },
  {
    title: "Mental Health Awareness Campaign",
    description: "Launch a nationwide mental health awareness program with free counseling services, helplines, and community support groups.",
    category: "healthcare",
    status: "pending",
    priority: "medium",
    tags: ["mental-health", "healthcare", "awareness"],
    upvotes: 92,
    downvotes: 6,
    viewCount: 534,
    location: {
      coordinates: [88.3639, 22.5726],
      address: "Kolkata, West Bengal"
    },
    aiSentiment: "positive"
  },
  {
    title: "Agricultural Modernization Support",
    description: "Provide modern farming equipment, training, and financial support to small farmers to increase productivity and income.",
    category: "economy",
    status: "under_review",
    priority: "high",
    tags: ["agriculture", "farming", "rural-development"],
    upvotes: 61,
    downvotes: 9,
    viewCount: 298,
    location: {
      coordinates: [78.4867, 17.3850],
      address: "Hyderabad, Telangana"
    },
    aiSentiment: "positive"
  }
];

const dummyFeedback = [
  {
    title: "Great initiative for transportation",
    content: "The public transportation proposal is exactly what our city needs. I support the expansion of bus routes and better scheduling.",
    category: "support",
    sentiment: "positive",
    status: "acknowledged",
    location: {
      coordinates: [77.2090, 28.6139],
      address: "New Delhi, India"
    }
  },
  {
    title: "Concern about implementation timeline",
    content: "While I support the healthcare proposal, I'm concerned about how quickly this can be implemented. We need more details on the rollout plan.",
    category: "concern",
    sentiment: "neutral",
    status: "new",
    location: {
      coordinates: [72.8777, 19.0760],
      address: "Mumbai, India"
    }
  },
  {
    title: "Add more schools to the program",
    content: "The digital literacy program is excellent, but we should include more remote villages. Many areas still lack basic computer facilities.",
    category: "suggestion",
    sentiment: "positive",
    status: "addressed",
    location: {
      coordinates: [76.7179, 15.4909],
      address: "Hubli, Karnataka"
    }
  },
  {
    title: "Plastic ban impact on small businesses",
    content: "The plastic ban is good for environment, but we need to consider small businesses that rely on plastic packaging. Alternative materials should be subsidized.",
    category: "concern",
    sentiment: "neutral",
    status: "acknowledged",
    location: {
      coordinates: [74.8779, 31.6340],
      address: "Amritsar, Punjab"
    }
  },
  {
    title: "Excellent support for startups",
    content: "The small business support fund will help many entrepreneurs like myself. Thank you for considering this important initiative.",
    category: "support",
    sentiment: "positive",
    status: "new",
    location: {
      coordinates: [80.2707, 13.0827],
      address: "Chennai, Tamil Nadu"
    }
  },
  {
    title: "Need more police presence",
    content: "The women's safety initiative is good, but we need more police presence in sensitive areas, especially during night hours.",
    category: "suggestion",
    sentiment: "neutral",
    status: "acknowledged",
    location: {
      coordinates: [75.8577, 26.9124],
      address: "Jaipur, Rajasthan"
    }
  },
  {
    title: "Solar subsidy process too complex",
    content: "The renewable energy subsidy is welcome, but the application process is too complicated for common people. Please simplify it.",
    category: "suggestion",
    sentiment: "negative",
    status: "addressed",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Pune, Maharashtra"
    }
  },
  {
    title: "Public Wi-Fi security concerns",
    content: "While public Wi-Fi is a good idea, we need to ensure proper security measures to protect user data and privacy.",
    category: "question",
    sentiment: "neutral",
    status: "new",
    location: {
      coordinates: [77.5946, 12.9716],
      address: "Bangalore, Karnataka"
    }
  },
  {
    title: "Mental health support desperately needed",
    content: "Thank you for addressing mental health. This is a crucial issue that has been ignored for too long in our society.",
    category: "support",
    sentiment: "positive",
    status: "acknowledged",
    location: {
      coordinates: [88.3639, 22.5726],
      address: "Kolkata, West Bengal"
    }
  },
  {
    title: "Include organic farming methods",
    content: "The agricultural modernization should also include organic farming techniques and sustainable practices for long-term benefits.",
    category: "suggestion",
    sentiment: "positive",
    status: "new",
    location: {
      coordinates: [78.4867, 17.3850],
      address: "Hyderabad, Telangana"
    }
  }
];

const seedDummyData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('Error: MONGODB_URI is not set in .env file');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    if (users.length < 2) {
      console.error('Error: Need at least 2 users in the database (1 citizen and 1 admin)');
      process.exit(1);
    }

    const citizenUser = users.find(user => user.role === 'citizen') || users[0];
    const adminUser = users.find(user => user.role === 'admin') || users[1];

    console.log(`Using citizen: ${citizenUser.email}`);
    console.log(`Using admin: ${adminUser.email}`);

    await PolicyProposal.deleteMany({});
    await Feedback.deleteMany({});
    console.log('Cleared existing proposals and feedback');

    const createdProposals = [];
    for (let i = 0; i < dummyProposals.length; i++) {
      const proposalData = {
        ...dummyProposals[i],
        authorId: i % 2 === 0 ? citizenUser._id : adminUser._id
      };
      const proposal = await PolicyProposal.create(proposalData);
      createdProposals.push(proposal);
      console.log(`Created proposal: ${proposal.title}`);
    }

    for (let i = 0; i < dummyFeedback.length; i++) {
      const feedbackData = {
        ...dummyFeedback[i],
        userId: i % 2 === 0 ? citizenUser._id : adminUser._id,
        policyProposalId: createdProposals[i % createdProposals.length]._id
      };
      const feedback = await Feedback.create(feedbackData);
      console.log(`Created feedback: ${feedback.title}`);
    }

    console.log('\n✅ Dummy data seeded successfully!');
    console.log(`Created ${createdProposals.length} proposals`);
    console.log(`Created ${dummyFeedback.length} feedback entries`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding dummy data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDummyData();
