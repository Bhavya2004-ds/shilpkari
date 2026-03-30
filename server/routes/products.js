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
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit (3D models can be larger)
  fileFilter: (req, file, cb) => {
    // Check if image or .glb model
    if (file.mimetype.startsWith('image/') || 
        file.originalname.toLowerCase().endsWith('.glb') || 
        file.mimetype === 'model/gltf-binary' ||
        file.mimetype === 'application/octet-stream') { // Sometimes .glb is detected as octet-stream
      cb(null, true);
    } else {
      cb(new Error('Only images and 3D models (.glb) are allowed'), false);
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

    // Normalize images to always be {url, alt} format
    // Mongoose casts plain strings into subdocument schemas as character-indexed objects
    // e.g. {"0":"h","1":"t","2":"t","3":"p",...} — we need to reconstruct the URL
    const normalizedProducts = products.map(p => {
      const product = p.toObject ? p.toObject() : p;
      if (product.images && product.images.length > 0) {
        product.images = product.images.map(img => {
          if (typeof img === 'string') {
            return { url: img, alt: product.name || '', isPrimary: false };
          }
          // Handle character-indexed objects from Mongoose string casting
          if (typeof img === 'object' && img !== null && !img.url && '0' in img) {
            // Reconstruct URL from character-indexed keys
            const keys = Object.keys(img).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
            if (keys.length > 0) {
              const reconstructedUrl = keys.map(k => img[k]).join('');
              return { url: reconstructedUrl, alt: product.name || '', isPrimary: img.isPrimary || false };
            }
          }
          return img;
        });
      }
      return product;
    });

    res.json({
      products: normalizedProducts,
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
    product.images = (product.images || []).map(img => {
      if (typeof img === 'string') {
        return { url: img, alt: product.name || '', isPrimary: false };
      }
      if (typeof img === 'object' && img !== null && !img.url && '0' in img) {
        const keys = Object.keys(img).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
        if (keys.length > 0) {
          return { url: keys.map(k => img[k]).join(''), alt: product.name || '', isPrimary: img.isPrimary || false };
        }
      }
      return img;
    });
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
router.post('/', auth, artisanAuth, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'model3d', maxCount: 1 }
]), async (req, res) => {
  try {
    const productData = req.body;
    productData.artisan = req.userId;

    // Handle Image Uploads
    const images = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
      if (!isCloudinaryConfigured()) {
        return res.status(400).json({ message: 'Cloudinary is not configured. Please check your .env file.' });
      }
      
      const imageFiles = req.files.images;
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
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

    // Handle 3D Model Upload
    if (req.files && req.files.model3d && req.files.model3d.length > 0) {
      const glbFile = req.files.model3d[0];
      console.log(`[3D Upload] Processing manually uploaded GLB: ${glbFile.originalname}`);

      const result = await cloudinary.uploader.upload(
        `data:${glbFile.mimetype || 'model/gltf-binary'};base64,${glbFile.buffer.toString('base64')}`,
        {
          folder: 'shilpkari/models',
          resource_type: 'raw', // Critical for .glb files
          public_id: `${productData.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`
        }
      );

      productData.model3d = {
        glbUrl: result.secure_url,
        status: 'completed',
        generatedAt: new Date()
      };
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product (Artisan only)
router.put('/:id', auth, artisanAuth, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'model3d', maxCount: 1 }
]), async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisan: req.userId
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    const updates = req.body;

    // Handle Image Uploads & Removals
    let updatedImages = [];
    
    // 1. Initial base: Try to parse existing images from body (sent by EditProduct.js)
    if (updates.images) {
      try {
        updatedImages = typeof updates.images === 'string' ? JSON.parse(updates.images) : updates.images;
      } catch (e) {
        console.error('Error parsing images JSON:', e);
        updatedImages = product.images || [];
      }
    } else {
      updatedImages = product.images || [];
    }

    // 2. Handle New Image Uploads
    if (req.files && req.files.images && req.files.images.length > 0) {
      const imageFiles = req.files.images;
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'shilpkari/products',
            transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }]
          }
        );
        updatedImages.push({
          url: result.secure_url,
          alt: updates.name || product.name,
          isPrimary: updatedImages.length === 0
        });
      }
    }
    product.images = updatedImages;

    // Handle 3D Model Upload
    if (req.files && req.files.model3d && req.files.model3d.length > 0) {
      const glbFile = req.files.model3d[0];
      const result = await cloudinary.uploader.upload(
        `data:${glbFile.mimetype || 'model/gltf-binary'};base64,${glbFile.buffer.toString('base64')}`,
        {
          folder: 'shilpkari/models',
          resource_type: 'raw',
          public_id: `${(updates.name || product.name).replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`
        }
      );

      product.model3d = {
        glbUrl: result.secure_url,
        status: 'completed',
        generatedAt: new Date()
      };
    }

    // Handle Tags (might be sent as tags[] or string)
    if (updates['tags[]']) {
      product.tags = Array.isArray(updates['tags[]']) ? updates['tags[]'] : [updates['tags[]']];
    } else if (updates.tags) {
      product.tags = Array.isArray(updates.tags) ? updates.tags : updates.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    // Handle other fields
    const skipFields = ['images', 'model3d', 'tags', 'tags[]'];
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && !skipFields.includes(key)) {
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
    res.status(500).json({ message: 'Server error', error: error.message });
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
    const { rating, comment, sentiment, sentimentScore } = req.body;
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
      sentiment: sentiment || 'neutral',
      sentimentScore: sentimentScore || 0,
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

    const ownerFields = ['owner', 'user', 'artisan', 'seller'];
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
