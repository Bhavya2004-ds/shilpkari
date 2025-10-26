const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    let query = {};
    let productQuery = {};

    // Filter by user role
    if (req.userRole === 'artisan') {
      // Get artisan's products
      const products = await Product.find({ artisan: req.userId });
      const productIds = products.map(p => p._id);
      
      query = { 'items.product': { $in: productIds } };
      productQuery = { artisan: req.userId };
    } else if (req.userRole === 'buyer') {
      query = { buyer: req.userId };
    }

    // Get orders
    const orders = await Order.find({
      ...query,
      createdAt: { $gte: startDate }
    });

    // Calculate metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      if (order.status === 'delivered') {
        return sum + order.payment.amount.total;
      }
      return sum;
    }, 0);

    const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;

    // Get product analytics
    const products = await Product.find({
      ...productQuery,
      createdAt: { $gte: startDate }
    });

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const featuredProducts = products.filter(p => p.isFeatured).length;

    // Get top selling products
    const productSales = {};
    orders.forEach(order => {
      if (order.status === 'delivered') {
        order.items.forEach(item => {
          const productId = item.product.toString();
          if (!productSales[productId]) {
            productSales[productId] = { quantity: 0, revenue: 0 };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.price * item.quantity;
        });
      }
    });

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([productId, data]) => ({
        productId,
        ...data
      }));

    // Get daily sales data
    const dailySales = {};
    orders.forEach(order => {
      if (order.status === 'delivered') {
        const date = order.createdAt.toISOString().split('T')[0];
        if (!dailySales[date]) {
          dailySales[date] = { orders: 0, revenue: 0 };
        }
        dailySales[date].orders += 1;
        dailySales[date].revenue += order.payment.amount.total;
      }
    });

    const salesChartData = Object.entries(dailySales)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: data.revenue
      }));

    res.json({
      overview: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        totalProducts,
        activeProducts,
        featuredProducts
      },
      topProducts,
      salesChartData,
      period: days,
      message: 'Analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sales analytics
router.get('/sales', auth, async (req, res) => {
  try {
    const { period = '12', groupBy = 'month' } = req.query;
    const months = parseInt(period);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    let query = {};
    if (req.userRole === 'artisan') {
      const products = await Product.find({ artisan: req.userId });
      const productIds = products.map(p => p._id);
      query = { 'items.product': { $in: productIds } };
    } else if (req.userRole === 'buyer') {
      query = { buyer: req.userId };
    }

    const orders = await Order.find({
      ...query,
      createdAt: { $gte: startDate },
      status: 'delivered'
    });

    // Group by month
    const monthlyData = {};
    orders.forEach(order => {
      const month = order.createdAt.getMonth();
      const year = order.createdAt.getFullYear();
      const key = `${year}-${month}`;
      
      if (!monthlyData[key]) {
        monthlyData[key] = { orders: 0, revenue: 0, products: 0 };
      }
      
      monthlyData[key].orders += 1;
      monthlyData[key].revenue += order.payment.amount.total;
      monthlyData[key].products += order.items.reduce((sum, item) => sum + item.quantity, 0);
    });

    const salesData = Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([month, data]) => ({
        month,
        orders: data.orders,
        revenue: data.revenue,
        products: data.products
      }));

    res.json({
      salesData,
      period: months,
      groupBy,
      message: 'Sales analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product performance analytics
router.get('/products', auth, async (req, res) => {
  try {
    let query = {};
    if (req.userRole === 'artisan') {
      query = { artisan: req.userId };
    }

    const products = await Product.find(query)
      .populate('artisan', 'name artisanProfile.businessName')
      .sort({ createdAt: -1 });

    const productAnalytics = products.map(product => {
      const views = product.views || 0;
      const likes = product.likes || 0;
      const sales = product.sales || 0;
      const rating = product.rating?.average || 0;
      const ratingCount = product.rating?.count || 0;

      return {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        views,
        likes,
        sales,
        rating,
        ratingCount,
        qualityScore: product.qualityCheck?.score || 0,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        createdAt: product.createdAt
      };
    });

    // Sort by performance (combination of views, sales, and rating)
    productAnalytics.sort((a, b) => {
      const scoreA = (a.views * 0.3) + (a.sales * 0.5) + (a.rating * 0.2);
      const scoreB = (b.views * 0.3) + (b.sales * 0.5) + (b.rating * 0.2);
      return scoreB - scoreA;
    });

    res.json({
      products: productAnalytics,
      totalProducts: products.length,
      message: 'Product analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer analytics
router.get('/customers', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    let query = {};
    if (req.userRole === 'artisan') {
      const products = await Product.find({ artisan: req.userId });
      const productIds = products.map(p => p._id);
      query = { 'items.product': { $in: productIds } };
    }

    const orders = await Order.find({
      ...query,
      createdAt: { $gte: startDate }
    }).populate('buyer', 'name email createdAt');

    // Group by customer
    const customerData = {};
    orders.forEach(order => {
      const customerId = order.buyer._id.toString();
      if (!customerData[customerId]) {
        customerData[customerId] = {
          id: customerId,
          name: order.buyer.name,
          email: order.buyer.email,
          joinDate: order.buyer.createdAt,
          orders: 0,
          totalSpent: 0,
          lastOrder: null
        };
      }
      
      customerData[customerId].orders += 1;
      customerData[customerId].totalSpent += order.payment.amount.total;
      if (!customerData[customerId].lastOrder || order.createdAt > customerData[customerId].lastOrder) {
        customerData[customerId].lastOrder = order.createdAt;
      }
    });

    const customers = Object.values(customerData)
      .sort((a, b) => b.totalSpent - a.totalSpent);

    // Calculate customer metrics
    const totalCustomers = customers.length;
    const newCustomers = customers.filter(c => c.joinDate >= startDate).length;
    const averageOrderValue = totalCustomers > 0 ? 
      customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers : 0;

    res.json({
      customers,
      metrics: {
        totalCustomers,
        newCustomers,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100
      },
      period: days,
      message: 'Customer analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get customer analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get AI insights analytics
router.get('/ai-insights', auth, async (req, res) => {
  try {
    let query = {};
    if (req.userRole === 'artisan') {
      query = { artisan: req.userId };
    }

    const products = await Product.find(query);

    // Quality check analytics
    const qualityStats = {
      total: products.length,
      approved: products.filter(p => p.qualityCheck?.isApproved).length,
      averageScore: 0,
      issues: {}
    };

    let totalScore = 0;
    products.forEach(product => {
      if (product.qualityCheck?.score) {
        totalScore += product.qualityCheck.score;
        
        if (product.qualityCheck.issues) {
          product.qualityCheck.issues.forEach(issue => {
            qualityStats.issues[issue] = (qualityStats.issues[issue] || 0) + 1;
          });
        }
      }
    });

    qualityStats.averageScore = qualityStats.total > 0 ? 
      Math.round((totalScore / qualityStats.total) * 100) / 100 : 0;

    // Demand forecasting analytics
    const demandStats = {
      totalProducts: products.length,
      withForecast: products.filter(p => p.demandForecast?.predictedDemand).length,
      averageConfidence: 0,
      highDemandProducts: 0
    };

    let totalConfidence = 0;
    products.forEach(product => {
      if (product.demandForecast?.confidence) {
        totalConfidence += product.demandForecast.confidence;
        if (product.demandForecast.predictedDemand > 10) {
          demandStats.highDemandProducts++;
        }
      }
    });

    demandStats.averageConfidence = demandStats.withForecast > 0 ? 
      Math.round((totalConfidence / demandStats.withForecast) * 100) / 100 : 0;

    res.json({
      qualityStats,
      demandStats,
      message: 'AI insights analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get AI insights analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
