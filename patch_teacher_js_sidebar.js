const fs = require('fs');
const files = fs.readdirSync('v2/client/pages/common').filter(f => f.endsWith('.html')).map(f => 'v2/client/pages/common/' + f);

const searchPattern = `            <a href="../../pages/teacher/teacher_dashboard.html#dashboard" class="nav-item"><i class="ph ph-squares-four"></i> <span>Overview</span></a>
            <a href="../../pages/teacher/teacher_dashboard.html#post-announcement" class="nav-item"><i class="ph ph-megaphone"></i> <span>Post Announcement</span></a>
            <a href="../../pages/teacher/teacher_dashboard.html#manage-assignments" class="nav-item"><i class="ph ph-calendar-check"></i> <span>Manage Assignments</span></a>
            <a href="../../pages/teacher/teacher_dashboard.html#student-list" class="nav-item"><i class="ph ph-users"></i> <span>My Students</span></a>
            <a href="../../pages/common/internships.html" class="nav-item"><i class="ph ph-rocket"></i> <span>Internships & Hackathons</span></a>
            <a href="../../pages/common/scholarships.html" class="nav-item"><i class="ph ph-graduation-cap"></i> <span>Scholarships</span></a>
            <a href="../../pages/common/events.html" class="nav-item"><i class="ph ph-ticket"></i> <span>Manage Events</span></a>`;
// Wait, one of them might be `<a href="../../pages/common/internships.html" class="nav-item active">` depending on the file!

const genericSearchPattern = /<a href="\.\.\/\.\.\/pages\/teacher\/teacher_dashboard\.html#dashboard" class="nav-item"><i class="ph ph-squares-four"><\/i> <span>Overview<\/span><\/a>\s*<a href="\.\.\/\.\.\/pages\/teacher\/teacher_dashboard\.html#post-announcement" class="nav-item( active)?"><i class="ph ph-megaphone"><\/i> <span>Post Announcement<\/span><\/a>\s*<a href="\.\.\/\.\.\/pages\/teacher\/teacher_dashboard\.html#manage-assignments" class="nav-item( active)?"><i class="ph ph-calendar-check"><\/i> <span>Manage Assignments<\/span><\/a>\s*<a href="\.\.\/\.\.\/pages\/teacher\/teacher_dashboard\.html#student-list" class="nav-item( active)?"><i class="ph ph-users"><\/i> <span>My Students<\/span><\/a>\s*<a href="\.\.\/\.\.\/pages\/common\/internships\.html" class="nav-item( active)?"><i class="ph ph-rocket"><\/i> <span>Internships & Hackathons<\/span><\/a>\s*<a href="\.\.\/\.\.\/pages\/common\/scholarships\.html" class="nav-item( active)?"><i class="ph ph-graduation-cap"><\/i> <span>Scholarships<\/span><\/a>\s*<a href="\.\.\/\.\.\/pages\/common\/events\.html" class="nav-item( active)?"><i class="ph ph-ticket"><\/i> <span>Manage Events<\/span><\/a>/g;

// What if they also have `blog.html` appended? Oh yes!
// Let me write a simpler regex: I only want to replace references INSIDE `if (localStorage.getItem('userRole') === 'Teacher') { ... sidebar.innerHTML = \` ... \` }`

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  let match = content.match(/if \(localStorage\.getItem\('userRole'\) === 'Teacher'\) \{[\s\S]*?sidebar\.innerHTML = `([\s\S]*?)`;/);
  if (match) {
    let innerHtml = match[1];
    let newInnerHtml = innerHtml
      .replace(/<a href="\.\.\/\.\.\/pages\/common\/internships\.html" class="nav-item( active)?"><i class="ph ph-rocket"><\/i> <span>Internships & Hackathons<\/span><\/a>/g, '<a href="../../pages/teacher/teacher_dashboard.html#opportunities" class="nav-item$1"><i class="ph ph-rocket"></i> <span>Opportunities</span></a>')
      .replace(/<a href="\.\.\/\.\.\/pages\/common\/scholarships\.html" class="nav-item( active)?"><i class="ph ph-graduation-cap"><\/i> <span>Scholarships<\/span><\/a>/g, '<a href="../../pages/teacher/teacher_dashboard.html#scholarships" class="nav-item$1"><i class="ph ph-graduation-cap"></i> <span>Scholarships</span></a>')
      .replace(/<a href="\.\.\/\.\.\/pages\/common\/events\.html" class="nav-item( active)?"><i class="ph ph-ticket"><\/i> <span>Manage Events<\/span><\/a>/g, '<a href="../../pages/teacher/teacher_dashboard.html#events" class="nav-item$1"><i class="ph ph-ticket"></i> <span>Manage Events</span></a>');
      
    content = content.replace(match[1], newInnerHtml);
    fs.writeFileSync(f, content);
    console.log('Fixed Teacher Override in', f);
  }
});
