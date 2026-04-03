const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Create new blog
router.post('/', async (req, res) => {
  try {
    const { title, excerpt, content, author, readTime } = req.body;
    
    if (!title || !excerpt || !content || !author || !readTime) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const newBlog = new Blog({
      title,
      excerpt,
      content,
      author,
      readTime
    });

    await newBlog.save();
    res.status(201).json({ success: true, data: newBlog });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    
    await blog.deleteOne();
    res.json({ success: true, message: 'Blog removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
