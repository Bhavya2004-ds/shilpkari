const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const orderData = req.body;
    orderData.buyer = req.userId;

    // Validate products and calculate totals
    let subtotal = 0;
    for (let item of orderData.items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ 
          message: `Product ${item.product} not found or inactive` 
        });
      }
      
      if (product.inventory.available < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient inventory for product ${product.name}` 
        });
      }

      item.price = product.price;
      subtotal += item.price * item.quantity;
    }

    // Calculate totals
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 1000 ? 0 : 100; // Free shipping above 1000
    const discount = 0; // Can be calculated based on coupons
    const total = subtotal + tax + shipping - discount;

    orderData.payment.amount = {
      subtotal,
      tax,
      shipping,
      discount,
      total
    };

    // Create order
    const order = new Order(orderData);
    await order.save();

    // Update product inventory
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          'inventory.available': -item.quantity,
          'inventory.reserved': item.quantity,
          sales: item.quantity
        }
      });
    }

    // Add initial supply chain event
    order.supplyChain.push({
      stage: 'order_placed',
      timestamp: new Date(),
      location: 'Online Platform',
      description: 'Order placed successfully',
      verified: true
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.payment.amount.total,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { buyer: req.userId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone')
      .populate('items.product', 'name images artisan');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    if (order.buyer._id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, location, description } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions
    if (order.buyer.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.status = status;

    // Add supply chain event
    if (location && description) {
      order.supplyChain.push({
        stage: status,
        timestamp: new Date(),
        location,
        description,
        verified: true
      });
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order: {
        id: order._id,
        status: order.status,
        supplyChain: order.supplyChain
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.buyer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled' 
      });
    }

    order.status = 'cancelled';

    // Restore inventory
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          'inventory.available': item.quantity,
          'inventory.reserved': -item.quantity,
          sales: -item.quantity
        }
      });
    }

    // Add cancellation event
    order.supplyChain.push({
      stage: 'cancelled',
      timestamp: new Date(),
      location: 'Online Platform',
      description: 'Order cancelled by customer',
      verified: true
    });

    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order: {
        id: order._id,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get artisan's orders
router.get('/artisan/orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Get artisan's products
    const products = await Product.find({ artisan: req.userId });
    const productIds = products.map(p => p._id);

    const query = { 'items.product': { $in: productIds } };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('buyer', 'name email phone')
      .populate('items.product', 'name images artisan')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get artisan orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update tracking information
router.put('/:id/tracking', auth, async (req, res) => {
  try {
    const { carrier, trackingNumber, trackingUrl, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the artisan for this order
    const productIds = order.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const isArtisan = products.some(p => p.artisan.toString() === req.userId);

    if (!isArtisan && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.tracking = {
      carrier,
      trackingNumber,
      trackingUrl,
      estimatedDelivery: new Date(estimatedDelivery)
    };

    order.status = 'shipped';

    // Add shipping event
    order.supplyChain.push({
      stage: 'shipped',
      timestamp: new Date(),
      location: 'Shipping Center',
      description: `Order shipped via ${carrier}. Tracking: ${trackingNumber}`,
      verified: true
    });

    await order.save();

    res.json({
      message: 'Tracking information updated successfully',
      order: {
        id: order._id,
        tracking: order.tracking,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Update tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
