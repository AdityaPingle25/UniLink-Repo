const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Blog = require('./server/models/Blog');

const dummyBlogs = [
  {
    title: 'How To Ace Your First Year',
    excerpt: 'Navigating campus, choosing the right clubs, and maintaining a good GPA in your first semester.',
    content: 'Starting college can be daunting. Exploring campus early on and joining one or two relevant clubs can make a huge difference. Don\'t stress but stay consistent with your coursework.',
    author: 'Admin',
    readTime: '5 min read'
  },
  {
    title: 'Top 10 Coding Resources',
    excerpt: 'A compiled list of the best resources for learning Full Stack Web Development in 2026.',
    content: 'From freeCodeCamp to The Odin Project, we outline the best paths for learning Full Stack Web Development from scratch. Keep building projects alongside the tutorials!',
    author: 'Tech Club',
    readTime: '7 min read'
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    await Blog.deleteMany({});
    await Blog.insertMany(dummyBlogs);
    console.log('Dummy blogs inserted!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
