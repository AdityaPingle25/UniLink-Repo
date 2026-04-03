const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Blog = require('./models/Blog');

const blogs = [
  {
    title: 'How To Ace Your First Year',
    excerpt: 'Navigating campus, choosing the right clubs, and maintaining a good GPA in your first semester.',
    content: 'Starting college can be daunting. Exploring campus early on and joining one or two relevant clubs can make a huge difference. Don\'t stress but stay consistent with your coursework. Build relationships with professors, attend office hours, and get involved in study groups. The first year sets the foundation for everything that follows.',
    author: 'Admin',
    readTime: '5 min read'
  },
  {
    title: 'Top 10 Coding Resources for 2026',
    excerpt: 'A compiled list of the best resources for learning Full Stack Web Development.',
    content: 'From freeCodeCamp to The Odin Project, we outline the best paths for learning Full Stack Web Development from scratch. Keep building projects alongside the tutorials! Also check out MDN Web Docs for references, JavaScript.info for deep dives, and platforms like LeetCode and HackerRank for sharpening your problem-solving skills.',
    author: 'Tech Club',
    readTime: '7 min read'
  },
  {
    title: '5 Tips for Cracking Campus Placements',
    excerpt: 'Practical advice from seniors who got placed at top companies.',
    content: 'Campus placement season can be stressful, but preparation is key. Start with Data Structures and Algorithms at least 6 months before. Practice on LeetCode and GeeksforGeeks. Work on 2-3 solid projects for your resume. Prepare your introduction and common HR questions well. Finally, stay calm during the interview — confidence matters as much as knowledge.',
    author: 'Placement Cell',
    readTime: '6 min read'
  },
  {
    title: 'Why You Should Attend Hackathons',
    excerpt: 'Hackathons are more than just coding marathons — they are career boosters.',
    content: 'Hackathons push you to build something real in a short time, which is an invaluable skill. You learn to work in teams, present ideas, and solve problems under pressure. Many students have landed internships directly through hackathon connections. Plus, the swag and prizes are a nice bonus! Start with beginner-friendly ones like MLH Local Hack Day.',
    author: 'CS Department',
    readTime: '4 min read'
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    await Blog.deleteMany({});
    await Blog.insertMany(blogs);
    console.log('Blog posts seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
