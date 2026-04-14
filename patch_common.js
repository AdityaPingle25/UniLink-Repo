const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'v2', 'client', 'pages', 'common');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'internships.html');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const searchPattern = /document\.addEventListener\("DOMContentLoaded", \(\) => {\s*const storedName = localStorage\.getItem\('userName'\);\s*if \(storedName\) {\s*document\.getElementById\('navUserName'\)\.innerText = storedName;\s*document\.getElementById\('navAvatar'\)\.innerText = storedName\.charAt\(0\)\.toUpperCase\(\);\s*}/;

  const replacePattern = `document.addEventListener("DOMContentLoaded", () => {
      if (localStorage.getItem('userRole') === 'Teacher') {
        const tName = localStorage.getItem('teacherName') || 'Faculty';
        document.getElementById('navUserName').innerText = tName;
        document.getElementById('navAvatar').innerText = tName.charAt(0).toUpperCase();
        const roleSpan = document.querySelector('.user-role');
        if(roleSpan) roleSpan.innerText = 'Faculty';
        const profileLink = document.querySelector('.user-profile');
        if(profileLink) profileLink.href = '../../pages/teacher/teacher_profile.html';

        // Override Sidebar
        const sidebar = document.querySelector('.sidebar .nav-items');
        if(sidebar) {
          sidebar.innerHTML = \`
            <a href="../../pages/teacher/teacher_dashboard.html#dashboard" class="nav-item"><i class="ph ph-squares-four"></i> <span>Overview</span></a>
            <a href="../../pages/teacher/teacher_dashboard.html#post-announcement" class="nav-item"><i class="ph ph-megaphone"></i> <span>Post Announcement</span></a>
            <a href="../../pages/teacher/teacher_dashboard.html#manage-assignments" class="nav-item"><i class="ph ph-calendar-check"></i> <span>Manage Assignments</span></a>
            <a href="../../pages/teacher/teacher_dashboard.html#student-list" class="nav-item"><i class="ph ph-users"></i> <span>My Students</span></a>
            <a href="../../pages/teacher/teacher_dashboard.html#opportunities" class="nav-item"><i class="ph ph-rocket"></i> <span>Opportunities</span></a>
            <a href="../../pages/teacher/teacher_dashboard.html#scholarships" class="nav-item"><i class="ph ph-graduation-cap"></i> <span>Scholarships</span></a>
            <a href="../../pages/teacher/teacher_dashboard.html#events" class="nav-item"><i class="ph ph-ticket"></i> <span>Manage Events</span></a>
          \`;
          
          // Mark active if matches current page
          const links = sidebar.querySelectorAll('a');
          const currentUrl = window.location.href;
          links.forEach(l => {
            if (currentUrl.includes(l.getAttribute('href').split('/').pop())) {
              l.classList.add('active');
            }
          });
        }
      } else {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          document.getElementById('navUserName').innerText = storedName;
          document.getElementById('navAvatar').innerText = storedName.charAt(0).toUpperCase();
        }
      }`;

  if (content.match(searchPattern)) {
    content = content.replace(searchPattern, replacePattern);

    // Also replace the logout logic to handle Teacher vs Student if it's there
    const logoutPatternRegex = /\/\/ Logout logic[\s\S]*?window\.location\.href = '\.\.\/\.\.\/pages\/auth\/student_login\.html';\s*\}\);\s*\}/;
    
    // We already do logout logic dynamically, wait we need to replace the static logout logic
    const newLogout = `// Logout logic
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.clear();
          if (localStorage.getItem('userRole') === 'Teacher') {
            window.location.href = '../../pages/auth/teacher_login.html';
          } else {
            window.location.href = '../../pages/auth/student_login.html';
          }
        });
      }`;
    if (content.match(logoutPatternRegex)) {
       content = content.replace(logoutPatternRegex, newLogout);
    }
    
    fs.writeFileSync(filePath, content);
    console.log('Patched', file);
  } else {
    console.log('Skipped (Pattern not found)', file);
  }
}
