const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const { Web3 } = require('web3');

const router = express.Router();

// Initialize Web3 (using Ganache for development)
const web3 = new Web3(process.env.ETHEREUM_RPC_URL || 'http://localhost:7545');

// Smart contract ABI (simplified for demonstration)
const supplyChainABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "orderId", "type": "string"},
      {"internalType": "string", "name": "stage", "type": "string"},
      {"internalType": "string", "name": "location", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"}
    ],
    "name": "addSupplyChainEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "orderId", "type": "string"}],
    "name": "getSupplyChainEvents",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "stage", "type": "string"},
          {"internalType": "string", "name": "location", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "internalType": "struct SupplyChain.Event[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract address (deploy this contract in your blockchain network)
const contractAddress = process.env.SUPPLY_CHAIN_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';
const contract = new web3.eth.Contract(supplyChainABI, contractAddress);

// Add supply chain event to blockchain
router.post('/add-event', auth, async (req, res) => {
  try {
    const { orderId, stage, location, description } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add event to database
    const supplyChainEvent = {
      stage,
      timestamp: new Date(),
      location,
      description,
      verified: false
    };

    order.supplyChain.push(supplyChainEvent);
    await order.save();

    // Add to blockchain (simplified - in production, use proper wallet integration)
    try {
      // This would require proper wallet integration and gas fees
      // For demo purposes, we'll simulate the transaction
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      order.blockchain = {
        transactionHash: mockTransactionHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
        isVerified: true
      };
      
      await order.save();

      res.json({
        message: 'Supply chain event added successfully',
        transactionHash: mockTransactionHash,
        event: supplyChainEvent
      });
    } catch (blockchainError) {
      console.error('Blockchain error:', blockchainError);
      res.json({
        message: 'Event added to database, but blockchain transaction failed',
        event: supplyChainEvent
      });
    }
  } catch (error) {
    console.error('Add supply chain event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get supply chain events for an order
router.get('/events/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get events from database
    const events = order.supplyChain || [];

    // Try to get events from blockchain (simplified)
    try {
      // In production, this would call the smart contract
      // const blockchainEvents = await contract.methods.getSupplyChainEvents(orderId).call();
      
      res.json({
        orderId,
        events,
        blockchainVerified: order.blockchain?.isVerified || false,
        transactionHash: order.blockchain?.transactionHash,
        message: 'Supply chain events retrieved successfully'
      });
    } catch (blockchainError) {
      console.error('Blockchain query error:', blockchainError);
      res.json({
        orderId,
        events,
        blockchainVerified: false,
        message: 'Events retrieved from database only'
      });
    }
  } catch (error) {
    console.error('Get supply chain events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify product authenticity
router.post('/verify-product', auth, async (req, res) => {
  try {
    const { productId, blockchainId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Simulate blockchain verification
    const isVerified = Math.random() > 0.3; // 70% chance of verification for demo
    
    if (isVerified) {
      product.blockchainId = blockchainId || `BC${Date.now()}`;
      product.supplyChainHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      await product.save();
    }

    res.json({
      productId,
      isVerified,
      blockchainId: product.blockchainId,
      supplyChainHash: product.supplyChainHash,
      message: isVerified ? 'Product verified successfully' : 'Product verification failed'
    });
  } catch (error) {
    console.error('Verify product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blockchain statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const verifiedOrders = await Order.countDocuments({ 'blockchain.isVerified': true });
    const totalProducts = await Product.countDocuments();
    const verifiedProducts = await Product.countDocuments({ blockchainId: { $exists: true } });

    const verificationRate = totalOrders > 0 ? (verifiedOrders / totalOrders) * 100 : 0;
    const productVerificationRate = totalProducts > 0 ? (verifiedProducts / totalProducts) * 100 : 0;

    res.json({
      totalOrders,
      verifiedOrders,
      totalProducts,
      verifiedProducts,
      verificationRate: Math.round(verificationRate * 100) / 100,
      productVerificationRate: Math.round(productVerificationRate * 100) / 100,
      message: 'Blockchain statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Get blockchain stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate supply chain report
router.get('/report/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('buyer', 'name email')
      .populate('items.product', 'name artisan');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const report = {
      orderId: order.orderNumber,
      buyer: {
        name: order.buyer.name,
        email: order.buyer.email
      },
      products: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price
      })),
      supplyChain: order.supplyChain,
      blockchain: {
        verified: order.blockchain?.isVerified || false,
        transactionHash: order.blockchain?.transactionHash,
        blockNumber: order.blockchain?.blockNumber
      },
      timeline: order.supplyChain.map(event => ({
        stage: event.stage,
        timestamp: event.timestamp,
        location: event.location,
        description: event.description,
        verified: event.verified
      })),
      generatedAt: new Date()
    };

    res.json({
      report,
      message: 'Supply chain report generated successfully'
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
