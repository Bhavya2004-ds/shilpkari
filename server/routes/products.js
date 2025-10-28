const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { auth, artisanAuth } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
});

// Helper to validate Cloudinary configuration
const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return false;
  if (CLOUDINARY_API_KEY === 'your_api_key' || CLOUDINARY_API_SECRET === 'your_api_secret') return false;
  return true;
};

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      artisan,
      featured
    } = req.query;

    const query = { isActive: true };

    // Apply filters
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (artisan) query.artisan = artisan;
    if (featured === 'true') query.isFeatured = true;

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { materials: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('artisan', 'name artisanProfile.businessName profileImage')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    // First, get the raw product without strict validation
    let product = await Product.findById(req.params.id)
      .populate('artisan', 'name artisanProfile.businessName profileImage artisanProfile.description')
      .populate({
        path: 'reviews.user',
        select: 'name profileImage',
        options: { strictPopulate: false }
      })
      .lean(); // Use lean() for better performance

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure all required fields have default values
    product.images = product.images || [];
    product.reviews = product.reviews || [];

    // Handle dimensions safely
    if (product.dimensions) {
      // If dimensions is a string, convert it to an object
      if (typeof product.dimensions === 'string') {
        product.dimensions = {
          description: product.dimensions,
          unit: 'cm'
        };
      }
      // Ensure all dimension fields exist
      product.dimensions = {
        length: product.dimensions.length || '',
        width: product.dimensions.width || '',
        height: product.dimensions.height || '',
        weight: product.dimensions.weight || '',
        unit: product.dimensions.unit || 'cm',
        description: product.dimensions.description || ''
      };
    } else {
      product.dimensions = {
        length: '',
        width: '',
        height: '',
        weight: '',
        unit: 'cm',
        description: ''
      };
    }

    // Increment view count
    await Product.updateOne(
      { _id: req.params.id },
      { $inc: { views: 1 } }
    );
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Artisan only)
router.post('/', auth, artisanAuth, upload.array('images', 10), async (req, res) => {
  try {
    const productData = req.body;
    productData.artisan = req.userId;

    // Upload images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      if (!isCloudinaryConfigured()) {
        return res.status(400).json({ message: 'Image upload is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET on the server.' });
      }
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'shilpkari/products',
            transformation: [
              { width: 800, height: 600, crop: 'fill', quality: 'auto' }
            ]
          }
        );
        images.push({
          url: result.secure_url,
          alt: productData.name,
          isPrimary: i === 0
        });
      }
    }

    productData.images = images;

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Artisan only)
router.put('/:id', auth, artisanAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisan: req.userId
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        product[key] = updates[key];
      }
    });

    await product.save();
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Artisan only)
router.delete('/:id', auth, artisanAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisan: req.userId
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get artisan's products
router.get('/artisan/:artisanId', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const products = await Product.find({ 
      artisan: req.params.artisanId,
      isActive: true 
    })
      .populate('artisan', 'name artisanProfile.businessName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments({ 
      artisan: req.params.artisanId,
      isActive: true 
    });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get artisan products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ 
      isFeatured: true,
      isActive: true 
    })
      .populate('artisan', 'name artisanProfile.businessName profileImage')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user is the artisan who created the product
    if (product.artisan.toString() === req.userId) {
      return res.status(403).json({ 
        message: 'Artisans cannot review their own products' 
      });
    }

    // Get user to check their role
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is a buyer (not an artisan)
    if (user.role === 'artisan') {
      return res.status(403).json({ 
        message: 'Only buyers can submit reviews' 
      });
    }

    const review = {
      user: req.userId,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    product.reviews.push(review);
    
    // Update the product's average rating
    const totalReviews = product.reviews.length;
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / totalReviews;
    
    product.rating = {
      average: parseFloat(averageRating.toFixed(1)),
      count: totalReviews
    };
    
    await product.save();

    // Populate user details for the response
    await product.populate('reviews.user', 'name profileImage');
    const newReview = product.reviews[product.reviews.length - 1];
    
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});

// Get reviews for a product
router.get('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name profileImage')
      .select('reviews');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product.reviews || []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});


// GET /api/products/mine  -> returns products for logged-in user (works with string or ObjectId refs)
router.get('/mine', auth, async (req, res) => {
  try {
    const uid = req.user && (req.user._id || req.user.id);
    if (!uid) return res.status(401).json({ message: 'Unauthorized' });

    const possibleIds = [uid];
    if (mongoose.Types.ObjectId.isValid(uid)) possibleIds.push(mongoose.Types.ObjectId(uid));

    const ownerFields = ['owner','user','artisan','seller'];
    const orClauses = ownerFields.map(f => ({ [f]: { $in: possibleIds } }));

    const products = await Product.find({ $or: orClauses })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ products });
  } catch (err) {
    console.error('GET /api/products/mine error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
