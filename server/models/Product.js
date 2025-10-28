const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 
      'paintings', 'sculptures', 'basketry', 'leatherwork', 'other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false },
    vr360Url: String, // For VR/AR viewing
    arModelUrl: String // For AR viewing
  }],
  variants: [{
    name: String, // e.g., "Size", "Color"
    options: [String] // e.g., ["Small", "Medium", "Large"]
  }],
  inventory: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 }
  },
  dimensions: {
    // Make dimensions more flexible to handle both string and number values
    length: { type: mongoose.Schema.Types.Mixed },
    width: { type: mongoose.Schema.Types.Mixed },
    height: { type: mongoose.Schema.Types.Mixed },
    weight: { type: mongoose.Schema.Types.Mixed },
    unit: { type: String, default: 'cm' },
    _id: false
  },
  materials: [String],
  techniques: [String],
  origin: {
    state: String,
    region: String,
    country: { type: String, default: 'India' }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  // AI Quality Check Results
  qualityCheck: {
    score: { type: Number, min: 0, max: 100 },
    issues: [String],
    recommendations: [String],
    lastChecked: Date,
    isApproved: { type: Boolean, default: false }
  },
  // Demand Forecasting
  demandForecast: {
    predictedDemand: Number,
    confidence: Number,
    seasonality: [Number], // Monthly demand pattern
    lastUpdated: Date
  },
  // Reviews
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    },
    sentimentScore: {
      type: Number,
      default: 0
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Analytics
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  // Blockchain
  blockchainId: String,
  supplyChainHash: String,
  // SEO
  seoTitle: String,
  seoDescription: String,
  slug: String
}, {
  timestamps: true
});

// Create slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  materials: 'text'
});

module.exports = mongoose.model('Product', productSchema);
