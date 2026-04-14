const fs = require('fs');
const files = fs.readdirSync('v2/client/pages/common').filter(f => f.endsWith('.html')).map(f => 'v2/client/pages/common/' + f);
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  
  // Notice we only need to replace the Teacher override section now, since I explicitly set it using patch_common.js earlier.
  // Wait, I actually directly patched announcements.html, blog.html, etc using multi_replace_file_content earlier.
  
  content = content.replace(/<a href="\.\.\/\.\.\/pages\/common\/internships\.html" class="nav-item( active)?"><i class="ph ph-rocket"><\/i> <span>Internships & Hackathons<\/span><\/a>/g, '<a href="../../pages/teacher/teacher_dashboard.html#opportunities" class="nav-item"><i class="ph ph-rocket"></i> <span>Opportunities</span></a>');
  
  content = content.replace(/<a href="\.\.\/\.\.\/pages\/common\/scholarships\.html" class="nav-item( active)?"><i class="ph ph-graduation-cap"><\/i> <span>Scholarships<\/span><\/a>/g, '<a href="../../pages/teacher/teacher_dashboard.html#scholarships" class="nav-item"><i class="ph ph-graduation-cap"></i> <span>Scholarships</span></a>');
  
  content = content.replace(/<a href="\.\.\/\.\.\/pages\/common\/events\.html" class="nav-item( active)?"><i class="ph ph-ticket"><\/i> <span>Manage Events<\/span><\/a>/g, '<a href="../../pages/teacher/teacher_dashboard.html#events" class="nav-item"><i class="ph ph-ticket"></i> <span>Manage Events</span></a>');
  
  fs.writeFileSync(f, content);
  console.log('Fixed', f);
});
