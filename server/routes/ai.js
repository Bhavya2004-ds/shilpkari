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

    // Simulate detailed AI quality check (in production, use computer vision models)
    // Generate sub-scores for each quality dimension
    const subScores = {
      resolution: Math.floor(Math.random() * 35) + 65,
      lighting: Math.floor(Math.random() * 40) + 60,
      composition: Math.floor(Math.random() * 35) + 65,
      background: Math.floor(Math.random() * 40) + 60,
      sharpness: Math.floor(Math.random() * 30) + 70
    };

    // Overall score is weighted average
    const qualityScore = Math.round(
      subScores.resolution * 0.20 +
      subScores.lighting * 0.25 +
      subScores.composition * 0.20 +
      subScores.background * 0.15 +
      subScores.sharpness * 0.20
    );

    const issues = [];
    const recommendations = [];

    // Resolution feedback
    if (subScores.resolution < 75) {
      issues.push('Low image resolution detected');
      recommendations.push('Use a camera with at least 12MP or shoot in higher resolution mode');
    } else if (subScores.resolution < 85) {
      issues.push('Image resolution is acceptable but could be better');
      recommendations.push('Consider using a DSLR or higher-end smartphone camera');
    }

    // Lighting feedback
    if (subScores.lighting < 70) {
      issues.push('Poor lighting conditions detected');
      recommendations.push('Use natural daylight or a softbox lighting setup for even illumination');
    } else if (subScores.lighting < 85) {
      issues.push('Lighting could be more even');
      recommendations.push('Avoid harsh shadows by using diffused lighting or reflectors');
    }

    // Composition feedback
    if (subScores.composition < 75) {
      issues.push('Product is not well-centered in the frame');
      recommendations.push('Center the product and follow the rule of thirds for better visual appeal');
    } else if (subScores.composition < 85) {
      issues.push('Composition could be improved');
      recommendations.push('Try different angles and ensure the product fills 60-80% of the frame');
    }

    // Background feedback
    if (subScores.background < 70) {
      issues.push('Distracting or cluttered background');
      recommendations.push('Use a clean, solid-color background (white or neutral tones work best)');
    } else if (subScores.background < 85) {
      issues.push('Background could be cleaner');
      recommendations.push('Consider using a plain backdrop or lightly textured surface');
    }

    // Sharpness feedback
    if (subScores.sharpness < 75) {
      issues.push('Image appears blurry or out of focus');
      recommendations.push('Use a tripod and tap-to-focus on the product before shooting');
    } else if (subScores.sharpness < 85) {
      issues.push('Slight softness detected in the image');
      recommendations.push('Ensure your camera lens is clean and use proper focus settings');
    }

    // Positive feedback
    if (qualityScore >= 90) {
      recommendations.push('Excellent image quality! This will attract more customers.');
    } else if (qualityScore >= 80) {
      recommendations.push('Good image quality. A few tweaks could make it even better.');
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
      subScores,
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
