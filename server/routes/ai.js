const express = require('express');
const axios = require('axios');
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

// ============================================
// 3D Model Generation (TripoSR via Tripo3D API)
// ============================================

const TRIPO_API_BASE = 'https://api.tripo3d.ai/v2/openapi';

// Helper: Poll Tripo task until completion
const pollTripoTask = async (taskId, apiKey, maxAttempts = 36, interval = 5000) => {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, interval));

    const response = await axios.get(`${TRIPO_API_BASE}/task/${taskId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    const { data } = response.data;
    console.log(`[TripoSR] Poll ${i + 1}/${maxAttempts} - Task ${taskId} status: ${data.status}`);

    if (data.status === 'success') {
      return { success: true, output: data.output };
    }

    if (['failed', 'banned', 'expired', 'cancelled'].includes(data.status)) {
      return { success: false, error: `Task ${data.status}` };
    }
    // queued or running — keep polling
  }

  return { success: false, error: 'Timed out waiting for 3D model generation' };
};

// POST /api/ai/generate-3d-model
router.post('/generate-3d-model', async (req, res) => {
  try {
    const { productId } = req.body;
    const apiKey = process.env.TRIPO_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'TRIPO_API_KEY not configured on the server' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already processing
    if (product.model3d?.status === 'processing') {
      return res.status(400).json({
        message: 'A 3D model is already being generated for this product',
        taskId: product.model3d.taskId
      });
    }

    // Get the product's primary image URL
    // Images may be stored as plain strings in MongoDB, but Mongoose casts them through
    // the subdocument schema {url, alt, isPrimary}, creating character-indexed objects
    // like {'0':'h','1':'t','2':'t','3':'p',...}. We need to reconstruct the URL.
    let imageUrl = '';
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') {
        imageUrl = firstImage;
      } else if (firstImage && typeof firstImage === 'object') {
        const imgObj = firstImage.toObject ? firstImage.toObject() : firstImage;

        if (imgObj.url && typeof imgObj.url === 'string') {
          // Standard case: image is {url: "https://...", ...}
          imageUrl = imgObj.url;
        } else {
          // Mongoose character-indexed case: {'0':'h','1':'t',...}
          const numericKeys = Object.keys(imgObj).filter(k => /^\d+$/.test(k));
          if (numericKeys.length > 0) {
            numericKeys.sort((a, b) => Number(a) - Number(b));
            imageUrl = numericKeys.map(k => imgObj[k]).join('');
          }
        }
      }
    }

    // Ensure it's a plain string
    imageUrl = String(imageUrl).trim();

    if (!imageUrl) {
      return res.status(400).json({ message: 'Product has no image to generate a 3D model from' });
    }

    console.log(`[TripoSR] Starting 3D model generation for product ${productId}, image: ${imageUrl}`);

    // Step 1: Download the product image
    console.log('[TripoSR] Downloading product image...');
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Determine file extension
    const ext = imageUrl.match(/\.(jpg|jpeg|png|webp)/i)?.[1]?.toLowerCase() || 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    // Step 2: Upload image to Tripo's upload endpoint to get file_token
    console.log('[TripoSR] Uploading image to Tripo...');
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename: `product.${ext}`, contentType: mimeType });

    const uploadResponse = await axios.post(`${TRIPO_API_BASE}/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (uploadResponse.data.code !== 0) {
      throw new Error(`Tripo upload error: ${JSON.stringify(uploadResponse.data)}`);
    }

    const fileToken = uploadResponse.data.data.image_token;
    console.log(`[TripoSR] Image uploaded, token: ${fileToken}`);

    // Step 3: Create the Tripo task with file_token
    const createResponse = await axios.post(`${TRIPO_API_BASE}/task`, {
      type: 'image_to_model',
      model_version: 'v2.5-20250123',
      file: {
        type: ext === 'png' ? 'png' : ext === 'webp' ? 'webp' : 'jpg',
        file_token: fileToken
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (createResponse.data.code !== 0) {
      throw new Error(`Tripo API error: ${JSON.stringify(createResponse.data)}`);
    }

    const taskId = createResponse.data.data.task_id;
    console.log(`[TripoSR] Task created: ${taskId}`);

    // Update product status to processing
    product.model3d = {
      status: 'processing',
      taskId: taskId,
      glbUrl: null,
      generatedAt: null,
      error: null
    };
    await product.save();

    // Return immediately — client will poll for status
    res.json({
      message: '3D model generation started',
      taskId: taskId,
      status: 'processing'
    });

    // Step 2: Poll in the background (non-blocking)
    pollTripoTask(taskId, apiKey)
      .then(async (result) => {
        const updatedProduct = await Product.findById(productId);
        if (!updatedProduct) return;

        if (result.success) {
          const glbUrl = result.output.model || result.output.pbr_model;
          console.log(`[TripoSR] Model ready for product ${productId}: ${glbUrl}`);

          updatedProduct.model3d = {
            status: 'completed',
            taskId: taskId,
            glbUrl: glbUrl,
            generatedAt: new Date(),
            error: null
          };
        } else {
          console.error(`[TripoSR] Failed for product ${productId}: ${result.error}`);
          updatedProduct.model3d = {
            status: 'failed',
            taskId: taskId,
            glbUrl: null,
            generatedAt: null,
            error: result.error
          };
        }

        await updatedProduct.save();
      })
      .catch(async (err) => {
        console.error(`[TripoSR] Polling error for product ${productId}:`, err.message);
        try {
          const updatedProduct = await Product.findById(productId);
          if (updatedProduct) {
            updatedProduct.model3d = {
              status: 'failed',
              taskId: taskId,
              glbUrl: null,
              generatedAt: null,
              error: err.message
            };
            await updatedProduct.save();
          }
        } catch (saveErr) {
          console.error('[TripoSR] Failed to save error status:', saveErr.message);
        }
      });

  } catch (error) {
    console.error('Generate 3D model error:', error);
    res.status(500).json({ message: 'Failed to start 3D model generation', error: error.message });
  }
});

// GET /api/ai/3d-model-status/:productId
router.get('/3d-model-status/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select('model3d');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      status: product.model3d?.status || 'none',
      glbUrl: product.model3d?.glbUrl || null,
      error: product.model3d?.error || null,
      generatedAt: product.model3d?.generatedAt || null
    });
  } catch (error) {
    console.error('3D model status error:', error);
    res.status(500).json({ message: 'Failed to get 3D model status' });
  }
});

module.exports = router;
