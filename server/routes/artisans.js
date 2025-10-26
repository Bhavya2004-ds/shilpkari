const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);

    const query = { role: 'artisan' };

    const total = await User.countDocuments(query);
    const artisans = await User.find(query)
      .select('name profileImage artisanProfile language')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      artisans,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get artisans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rawId = req.params.id;

    // tolerant artisan lookup (string _id or ObjectId or fallback by email/name/businessName)
    let artisan = await User.findOne({ _id: rawId }).select('-password').lean();
    if (!artisan && mongoose.Types.ObjectId.isValid(rawId)) {
      artisan = await User.findById(new mongoose.Types.ObjectId(rawId)).select('-password').lean();
    }
    if (!artisan && rawId.includes('@')) {
      artisan = await User.findOne({ email: rawId }).select('-password').lean();
    }
    if (!artisan) {
      artisan = await User.findOne({
        $or: [{ name: rawId }, { 'artisanProfile.businessName': rawId }]
      }).select('-password').lean();
    }

    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    // build id variants so product lookup matches string or ObjectId stored refs
    const ids = [rawId];
    if (mongoose.Types.ObjectId.isValid(rawId)) ids.push(new mongoose.Types.ObjectId(rawId));
    if (artisan._id && !ids.some(x => x.toString() === artisan._id.toString())) ids.push(artisan._id);

    const ownerFields = ['artisan', 'owner', 'user', 'seller'];
    const orClauses = ownerFields.map(f => ({ [f]: { $in: ids } }));

    const products = await Product.find({ $or: orClauses })
      .select('title name price images currency artisan slug createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ artisan, products });
  } catch (err) {
    console.error('Get artisan by id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
