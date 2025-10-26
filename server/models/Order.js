const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    variant: {
      name: String,
      value: String
    }
  }],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    phone: String
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    amount: {
      subtotal: Number,
      tax: Number,
      shipping: Number,
      discount: Number,
      total: Number
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  tracking: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  // Blockchain tracking
  blockchain: {
    transactionHash: String,
    blockNumber: Number,
    isVerified: { type: Boolean, default: false }
  },
  // Supply chain tracking
  supplyChain: [{
    stage: {
      type: String,
      enum: ['order_placed', 'payment_confirmed', 'production_started', 'quality_check', 'packaging', 'shipped', 'in_transit', 'delivered']
    },
    timestamp: Date,
    location: String,
    description: String,
    verified: { type: Boolean, default: false }
  }],
  notes: String,
  // Analytics
  source: String, // How the order was placed
  campaign: String, // Marketing campaign
  coupon: String
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `SPK${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
