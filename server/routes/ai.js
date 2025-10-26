const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Demand Forecasting
router.post('/demand-forecast', auth, async (req, res) => {
  try {
    const { productId, timeHorizon = 30 } = req.body;

    // Get historical data for the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get historical sales data
    const orders = await Order.find({
      'items.product': productId,
      status: { $in: ['delivered', 'shipped'] },
      createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } // Last year
    });

    // Process sales data by month
    const monthlySales = {};
    orders.forEach(order => {
      const month = order.createdAt.getMonth();
      const year = order.createdAt.getFullYear();
      const key = `${year}-${month}`;
      
      if (!monthlySales[key]) {
        monthlySales[key] = 0;
      }
      
      order.items.forEach(item => {
        if (item.product.toString() === productId) {
          monthlySales[key] += item.quantity;
        }
      });
    });

    // Convert to array for ML processing
    const salesData = Object.values(monthlySales);
    
    if (salesData.length < 3) {
      return res.json({
        predictedDemand: Math.max(1, Math.floor(Math.random() * 10)),
        confidence: 0.3,
        seasonality: Array(12).fill(1),
        message: 'Insufficient data for accurate forecasting'
      });
    }

    // Simple moving average forecast (in production, use more sophisticated ML models)
    const windowSize = Math.min(3, salesData.length);
    const recentSales = salesData.slice(-windowSize);
    const averageSales = recentSales.reduce((a, b) => a + b, 0) / recentSales.length;
    
    // Apply seasonal adjustment (simplified)
    const currentMonth = new Date().getMonth();
    const seasonalFactors = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 0.8, 0.9, 1.0, 1.1, 1.2]; // Festival seasons
    const seasonalFactor = seasonalFactors[currentMonth] || 1.0;
    
    const predictedDemand = Math.max(1, Math.floor(averageSales * seasonalFactor));
    const confidence = Math.min(0.9, salesData.length / 12); // More data = higher confidence

    // Update product with forecast
    product.demandForecast = {
      predictedDemand,
      confidence,
      seasonality: seasonalFactors,
      lastUpdated: new Date()
    };
    await product.save();

    res.json({
      predictedDemand,
      confidence,
      seasonality: seasonalFactors,
      historicalData: salesData,
      message: 'Demand forecast generated successfully'
    });
  } catch (error) {
    console.error('Demand forecast error:', error);
    res.status(500).json({ message: 'Server error during demand forecasting' });
  }
});

// Quality Check for Product Images
router.post('/quality-check', auth, async (req, res) => {
  try {
    const { productId, imageUrl } = req.body;

    // Simulate AI quality check (in production, use actual computer vision models)
    const qualityScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
    const issues = [];
    const recommendations = [];

    // Simulate quality checks
    if (qualityScore < 70) {
      issues.push('Image resolution could be improved');
      recommendations.push('Use higher resolution camera or better lighting');
    }
    
    if (qualityScore < 80) {
      issues.push('Image composition needs improvement');
      recommendations.push('Center the product and use a clean background');
    }

    if (qualityScore < 90) {
      issues.push('Color accuracy could be better');
      recommendations.push('Ensure proper white balance and color correction');
    }

    if (qualityScore >= 90) {
      recommendations.push('Excellent image quality! This will attract more customers.');
    }

    // Update product quality check results
    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        product.qualityCheck = {
          score: qualityScore,
          issues,
          recommendations,
          lastChecked: new Date(),
          isApproved: qualityScore >= 75
        };
        await product.save();
      }
    }

    res.json({
      qualityScore,
      issues,
      recommendations,
      isApproved: qualityScore >= 75,
      message: 'Quality check completed'
    });
  } catch (error) {
    console.error('Quality check error:', error);
    res.status(500).json({ message: 'Server error during quality check' });
  }
});

// Sentiment Analysis
router.post('/sentiment-analysis', auth, async (req, res) => {
  try {
    const { text, productId } = req.body;

    // Simple sentiment analysis (in production, use NLP models)
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'beautiful', 'love', 'perfect', 'wonderful', 'fantastic', 'outstanding'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'poor', 'worst', 'horrible', 'ugly', 'broken'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    const totalWords = words.length;
    const positiveRatio = positiveCount / totalWords;
    const negativeRatio = negativeCount / totalWords;
    
    let sentiment = 'neutral';
    let score = 0;
    
    if (positiveRatio > negativeRatio && positiveRatio > 0.1) {
      sentiment = 'positive';
      score = positiveRatio * 100;
    } else if (negativeRatio > positiveRatio && negativeRatio > 0.1) {
      sentiment = 'negative';
      score = negativeRatio * 100;
    }

    // Generate recommendations based on sentiment
    const recommendations = [];
    if (sentiment === 'positive') {
      recommendations.push('Continue maintaining high quality standards');
      recommendations.push('Consider featuring this product in marketing campaigns');
    } else if (sentiment === 'negative') {
      recommendations.push('Review and improve product quality');
      recommendations.push('Consider customer feedback for product improvements');
      recommendations.push('Reach out to customers for detailed feedback');
    } else {
      recommendations.push('Gather more customer feedback for better insights');
    }

    res.json({
      sentiment,
      score: Math.round(score),
      positiveRatio,
      negativeRatio,
      recommendations,
      message: 'Sentiment analysis completed'
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ message: 'Server error during sentiment analysis' });
  }
});

// Get AI insights for artisan dashboard
router.get('/insights/:artisanId', auth, async (req, res) => {
  try {
    const { artisanId } = req.params;
    
    // Get artisan's products
    const products = await Product.find({ artisan: artisanId });
    
    // Calculate insights
    const totalProducts = products.length;
    const approvedProducts = products.filter(p => p.qualityCheck?.isApproved).length;
    const averageQualityScore = products.reduce((sum, p) => sum + (p.qualityCheck?.score || 0), 0) / totalProducts || 0;
    
    // Get demand forecasts
    const demandInsights = products.map(p => ({
      productId: p._id,
      productName: p.name,
      predictedDemand: p.demandForecast?.predictedDemand || 0,
      confidence: p.demandForecast?.confidence || 0
    }));

    // Get recent orders for sales insights
    const recentOrders = await Order.find({
      'items.product': { $in: products.map(p => p._id) },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    const totalSales = recentOrders.reduce((sum, order) => {
      return sum + order.items.reduce((orderSum, item) => {
        if (products.some(p => p._id.toString() === item.product.toString())) {
          return orderSum + (item.price * item.quantity);
        }
        return orderSum;
      }, 0);
    }, 0);

    res.json({
      totalProducts,
      approvedProducts,
      averageQualityScore: Math.round(averageQualityScore),
      demandInsights,
      totalSales,
      recentOrdersCount: recentOrders.length,
      message: 'AI insights generated successfully'
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ message: 'Server error during insights generation' });
  }
});

module.exports = router;
