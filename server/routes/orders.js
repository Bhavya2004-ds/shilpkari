const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create Stripe Checkout Session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Validate products and build line items
    const lineItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product not found or inactive` });
      }

      const unitPrice = Math.round(product.price * 100); // Stripe uses paise/cents
      subtotal += product.price * item.quantity;

      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
            images: product.images && product.images.length > 0 ? [product.images[0]] : [],
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity,
      });
    }

    // Add tax as a line item
    const tax = Math.round(subtotal * 0.18 * 100);
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'GST (18%)' },
        unit_amount: tax,
      },
      quantity: 1,
    });

    // Add shipping if applicable
    const shipping = subtotal > 1000 ? 0 : 100;
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Shipping' },
          unit_amount: shipping * 100,
        },
        quantity: 1,
      });
    }

    const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${clientURL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientURL}/checkout`,
      metadata: {
        userId: req.userId,
        items: JSON.stringify(items.map(i => ({ product: i.product, quantity: i.quantity }))),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: 'Failed to create payment session.' });
  }
});

// Verify Stripe Session and Create Order
router.post('/verify-stripe-session', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed.' });
    }

    // Check if order already created for this session
    const existingOrder = await Order.findOne({ 'payment.transactionId': sessionId });
    if (existingOrder) {
      return res.json({
        message: 'Order already exists',
        order: {
          id: existingOrder._id,
          orderNumber: existingOrder.orderNumber,
          total: existingOrder.payment.amount.total,
          status: existingOrder.status,
        },
      });
    }

    // Parse metadata
    const items = JSON.parse(session.metadata.items);
    const shippingAddress = JSON.parse(session.metadata.shippingAddress);

    // Build order data
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      // Auto-restock for demo
      if (product.inventory.available < item.quantity) {
        await Product.findByIdAndUpdate(item.product, {
          $set: { 'inventory.available': item.quantity + 10 },
        });
      }

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });
      subtotal += product.price * item.quantity;
    }

    const tax = subtotal * 0.18;
    const shipping = subtotal > 1000 ? 0 : 100;
    const total = subtotal + tax + shipping;

    const orderData = {
      buyer: req.userId,
      items: orderItems,
      shippingAddress,
      billingAddress: shippingAddress,
      payment: {
        method: 'card',
        status: 'completed',
        transactionId: sessionId,
        amount: { subtotal, tax, shipping, discount: 0, total },
      },
    };

    const order = new Order(orderData);
    await order.save();

    // Update inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          'inventory.available': -item.quantity,
          'inventory.reserved': item.quantity,
          sales: item.quantity,
        },
      });
    }

    order.supplyChain.push({
      stage: 'order_placed',
      timestamp: new Date(),
      location: 'Online Platform',
      description: 'Order placed successfully via Stripe payment',
      verified: true,
    });

    await order.save();

    res.json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.payment.amount.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('Verify stripe session error:', error);
    res.status(500).json({ message: 'Failed to verify payment.' });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const orderData = req.body;
    orderData.buyer = req.userId;

    // Check if this is a demo order that should skip inventory check
    const skipInventoryCheck = orderData.skipInventoryCheck || false;
    delete orderData.skipInventoryCheck; // Remove from order data

    // Validate products and calculate totals
    let subtotal = 0;
    for (let item of orderData.items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({
          message: `Product ${item.product} not found or inactive`
        });
      }

      // Skip inventory check for demo orders, or auto-restock if needed
      if (!skipInventoryCheck && product.inventory.available < item.quantity) {
        // For demo purposes, auto-increase inventory if too low
        await Product.findByIdAndUpdate(item.product, {
          $set: { 'inventory.available': item.quantity + 10 }
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
    // Handle both populated buyer object and plain ObjectId
    const buyerId = order.buyer._id ? order.buyer._id.toString() : order.buyer.toString();
    if (buyerId !== req.userId && req.userRole !== 'admin') {
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

    // Check permissions - allow buyer, admin, OR artisan who owns products in this order
    const isBuyer = order.buyer.toString() === req.userId;
    const isAdmin = req.userRole === 'admin';
    let isArtisan = false;

    if (!isBuyer && !isAdmin) {
      // Check if user is the artisan for any product in this order
      const productIds = order.items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } });
      isArtisan = products.some(p => p.artisan && p.artisan.toString() === req.userId);
    }

    if (!isBuyer && !isAdmin && !isArtisan) {
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
